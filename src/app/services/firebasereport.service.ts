import { inject, Injectable } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import { checkIfWeAreTesting, Member } from '../interfaces/interfaces';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseReportService {

  firestore = inject(AngularFirestore);
  constructor() { }

  /**
   * Fetch a page of members sorted by last updated/added timestamp descending.
   */
  async getMemberAuditReport(
    pageSize: number = 50,
    lastDoc: QueryDocumentSnapshot<any> | null = null
  ): Promise<{ members: Member[], lastVisibleDoc: QueryDocumentSnapshot<any> | null }> {
    const collectionName = 'members' + checkIfWeAreTesting();

    let query = this.firestore.collection(collectionName, ref => {
      let q = ref.orderBy('timestamp', 'desc').limit(pageSize);
      if (lastDoc) {
        q = q.startAfter(lastDoc);
      }
      return q;
    });

    const snapshot = await firstValueFrom(query.get());

    if (snapshot.empty) {
      return { members: [], lastVisibleDoc: null };
    }

    const members: Member[] = snapshot.docs.map(doc => {
      const data = doc.data() as Member;
      return { id: doc.id, ...data };
    });

    const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1] as QueryDocumentSnapshot<any>;

    return { members, lastVisibleDoc };
  }

  /**
   * Helper to safely extract a numeric millisecond timestamp for sorting across
   * Firestore Timestamps, JS Dates, and ISO/date strings.
   */
  private parseTimestamp(dateValue: any): number {
    if (!dateValue) return 0;
    if (typeof dateValue.toDate === 'function') {
      return dateValue.toDate().getTime();
    }
    const parsed = new Date(dateValue).getTime();
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Fetch Needy Family Fund records from members.helpReceived array.
   * Sorted descending by date.
   */
  async getCharityReport(
    pageSize: number = 50,
    pageIndex: number = 0
  ): Promise<{ records: any[], totalCount: number }> {
    const collectionName = 'members' + checkIfWeAreTesting();

    // Fetch all members to extract their helpReceived sub-arrays
    const snapshot = await firstValueFrom(this.firestore.collection(collectionName).get());

    if (snapshot.empty) {
      return { records: [], totalCount: 0 };
    }

    const allHelpRecords: any[] = [];

    snapshot.docs.forEach(doc => {
      const member = doc.data() as Member;
      if (member && Array.isArray(member.helpReceived)) {
        member.helpReceived.forEach((helpItem: any) => {
          allHelpRecords.push({
            ...helpItem,
            memberId: doc.id,
            recipientName: `${member.initial || ''} ${member.fname || ''} ${member.lname || ''}`.trim(),
            village: member.village || '',
            phone: member.phone || ''
          });
        });
      }
    });

    // Sort all records by date descending
    allHelpRecords.sort((a, b) => {
      const timeA = this.parseTimestamp(a.date || a.timestamp);
      const timeB = this.parseTimestamp(b.date || b.timestamp);
      return timeB - timeA;
    });

    const totalCount = allHelpRecords.length;
    const startIndex = pageIndex * pageSize;
    const paginatedRecords = allHelpRecords.slice(startIndex, startIndex + pageSize);

    return { records: paginatedRecords, totalCount };
  }

  /**
   * Fetch Donors / Donations records from members.donations array.
   * Sorted descending by date.
   */
  async getDonorsReport(
    pageSize: number = 50,
    pageIndex: number = 0
  ): Promise<{ records: any[], totalCount: number }> {
    const collectionName = 'members' + checkIfWeAreTesting();

    // Fetch all members to extract their donations sub-arrays
    const snapshot = await firstValueFrom(this.firestore.collection(collectionName).get());

    if (snapshot.empty) {
      return { records: [], totalCount: 0 };
    }

    const allDonationRecords: any[] = [];

    snapshot.docs.forEach(doc => {
      const member = doc.data() as Member;
      if (member && Array.isArray(member.donations)) {
        member.donations.forEach((donationItem: any) => {
          allDonationRecords.push({
            ...donationItem,
            memberId: doc.id,
            donorName: `${member.initial || ''} ${member.fname || ''} ${member.lname || ''}`.trim(),
            village: member.village || '',
            phone: member.phone || ''
          });
        });
      }
    });

    // Sort all records by date descending
    allDonationRecords.sort((a, b) => {
      const timeA = this.parseTimestamp(a.date || a.timestamp);
      const timeB = this.parseTimestamp(b.date || b.timestamp);
      return timeB - timeA;
    });

    const totalCount = allDonationRecords.length;
    const startIndex = pageIndex * pageSize;
    const paginatedRecords = allDonationRecords.slice(startIndex, startIndex + pageSize);

    return { records: paginatedRecords, totalCount };
  }

  /**
   * Fetch Recommendation Letter records from members.recommendationLetters array.
   * Sorted descending by date.
   */
  async getRecommendationReport(
    pageSize: number = 50,
    pageIndex: number = 0
  ): Promise<{ records: any[], totalCount: number }> {
    const collectionName = 'members' + checkIfWeAreTesting();

    // Fetch all members to extract their recommendationLetters sub-arrays
    const snapshot = await firstValueFrom(this.firestore.collection(collectionName).get());

    if (snapshot.empty) {
      return { records: [], totalCount: 0 };
    }

    const allRecommendationRecords: any[] = [];

    snapshot.docs.forEach(doc => {
      const member = doc.data() as Member;
      if (member && Array.isArray(member.recommendationLetters)) {
        member.recommendationLetters.forEach((recItem: any) => {
          allRecommendationRecords.push({
            ...recItem,
            memberId: doc.id,
            fname: `${member.initial || ''} ${member.fname || ''}`.trim(),
            lname: member.lname || '',
            village: member.village || '',
            phone: member.phone || ''
          });
        });
      }
    });

    // Sort all records by date descending
    allRecommendationRecords.sort((a, b) => {
      const timeA = this.parseTimestamp(a.date || a.timestamp);
      const timeB = this.parseTimestamp(b.date || b.timestamp);
      return timeB - timeA;
    });

    const totalCount = allRecommendationRecords.length;
    const startIndex = pageIndex * pageSize;
    const paginatedRecords = allRecommendationRecords.slice(startIndex, startIndex + pageSize);

    return { records: paginatedRecords, totalCount };
  }
}