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

  // ... inside FirebaseService class

  /**
   * Fetch a page of 50 members sorted by last updated/added timestamp descending.
   * @param pageSize Number of items per page (default 50)
   * @param lastDoc The last QueryDocumentSnapshot from the previous page for pagination cursor
   */
  async getMemberAuditReport(pageSize: number = 50, lastDoc: QueryDocumentSnapshot<any> | null = null): Promise<{ members: Member[], lastVisibleDoc: QueryDocumentSnapshot<any> | null }> {
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
}
