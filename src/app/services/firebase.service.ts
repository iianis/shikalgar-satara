import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, switchMap, Observable, of, from, firstValueFrom } from 'rxjs';
import firebase from 'firebase/compat/app';
import { checkIfWeAreTesting, IEvent, IMember, Member } from '../interfaces/interfaces';
import { Timestamp } from '@angular/fire/firestore';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  authService = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  isUserAuthenticated = false;

  getAuthState() { return this.authService.authState; }

  getCurrentUser(): Observable<any> {
    return this.getAuthState().pipe(switchMap(user => {
      if (user) {
        this.isUserAuthenticated = true;
        return of(user);
      } else {
        this.isUserAuthenticated = false;
        return of(null);
      }
    }));
  }

  getMembers(): Observable<any[]> {
    return this.firestore.collection('members' + checkIfWeAreTesting()).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  async addMasterData(collectionName: string, item: any): Promise<void> {
    const id = this.firestore.createId();
    item.timestamp = Timestamp.now();
    return await this.firestore.collection(collectionName + checkIfWeAreTesting()).doc(id).set(item);
  }

  // Search by First Name
  getMemberByFname(fname: string): Observable<any[]> {
    return this.firestore.collection('members' + checkIfWeAreTesting(),
      ref => ref.where('fname', '==', fname)
    ).valueChanges({ idField: 'id' });
  }

  // Pattern search for fname (case-insensitive partial match)
  getMembersByFnamePattern(pattern: string): Observable<any[]> {
    const searchRegex = new RegExp(pattern, 'i'); // 'i' for case-insensitive
    return this.getMembers().pipe(
      map(members => members.filter(member => member.fname && searchRegex.test(member.fname)))
    );
  }

  // Check if a phone number already exists (excluding current member ID if in edit mode)
  async checkDuplicatePhone(phone: string, currentId?: string | null): Promise<boolean> {
    const snapshot = await firstValueFrom(
      this.firestore.collection('members' + checkIfWeAreTesting(),
        ref => ref.where('phone', '==', phone)
      ).get()
    );

    if (snapshot.empty) return false;

    // If editing, allow matching the exact same document ID
    if (currentId) {
      return snapshot.docs.some(doc => doc.id !== currentId);
    }

    return true; // Duplicate found
  }

  getMasterData(collectionName: string): Observable<any[]> {
    return this.firestore.collection(collectionName + checkIfWeAreTesting()).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getCollectionCount(collectionName: string): Observable<number> {
    return from(this.firestore.collection(collectionName + checkIfWeAreTesting()).get()).pipe(
      map(snapshot => snapshot.size)
    );
  }

  getMasterDataOrderByField(collectionName: string, fieldName: string): Observable<any[]> {
    return this.firestore.collection(collectionName + checkIfWeAreTesting(),
      ref => ref.orderBy(fieldName))
      .valueChanges();
  }

  getMasterDataOrderByFieldDesc(collectionName: string, fieldName: string): Observable<any[]> {
    return this.firestore.collection(collectionName + checkIfWeAreTesting(),
      ref => ref.orderBy(fieldName, 'desc'))
      .valueChanges();
  }

  getMasterDataOrderByTimestamp(collectionName: string, fieldName: string): Observable<any[]> {
    return this.firestore.collection(collectionName + checkIfWeAreTesting(),
      ref => ref.orderBy(fieldName, 'desc'))
      .valueChanges();
  }

  getSettingById(id: string): Observable<any> {
    return this.firestore.collection('settings' + checkIfWeAreTesting()).doc(id).valueChanges();
  }

  getMemberByPhone(phone: string): Observable<any[]> {
    return this.firestore.collection('members' + checkIfWeAreTesting(), ref => ref.where('phone', '==', phone)).valueChanges({ idField: 'id' });
  }

  async getMemberByPhonev2(phone: string): Promise<Observable<any[]>> {
    return this.firestore.collection('members' + checkIfWeAreTesting(), ref => ref.where('phone', '==', phone)).valueChanges({ idField: 'id' });
  }

  registerUser(phone: string, verificationId: string, verificationCode: string): Promise<void | null> {
    const id = this.firestore.createId();
    const userData = { uid: id, phone: phone, createdAt: firebase.firestore.FieldValue.serverTimestamp() };
    return this.firestore.collection('users' + checkIfWeAreTesting()).doc(id).set(userData);
  }

  registerEvent(eventData: IEvent): Promise<void | null> {
    const id = this.firestore.createId();
    return this.firestore.collection('events' + checkIfWeAreTesting()).doc(id).set(eventData);
  }

  async addMember(memberData: IMember | Member): Promise<void> {
    const collectionName = "members" + checkIfWeAreTesting();
    const id = this.firestore.createId();

    // Attach server timestamp for reliable creation ordering
    const payload = {
      ...memberData,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    return this.firestore.collection(collectionName).doc(id).set(payload);
  }

  async updateMember(id: string, memberData: Partial<Member>): Promise<void> {
    const collectionName = 'members' + checkIfWeAreTesting();

    // Refresh timestamp on update so edited members rise to top of audit report
    const payload = {
      ...memberData,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    return await this.firestore.collection(collectionName).doc(id).update(payload);
  }

  async addUserIssues(issue: string): Promise<void> {
    const id = this.firestore.createId();
    let item = {
      issue: issue,
      timestamp: Timestamp.now(),
    };
    return this.firestore.collection('memberrequests' + checkIfWeAreTesting()).doc(id).set(item);
  }

  loginUser(phoneNumber: string, verificationId: string, verificationCode: string): Observable<any> {
    const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
    return from(this.authService.signInWithCredential(credential).then(userCredential => {
      const user = userCredential.user;
      if (user) {
        return this.firestore.collection('users' + checkIfWeAreTesting()).doc(user.uid).get().toPromise().then(doc => {
          if (doc!.exists) {
            return user;
          } else {
            throw new Error('User not found in Firestore');
          }
        });
      } throw new Error('Authentication failed');
    }));
  }

  async exportCollectionToCsv(collectionName: string): Promise<void> {
    try {
      const snapshot = await firstValueFrom(this.firestore.collection(collectionName).get());

      const data = snapshot.docs.map((doc) => {
        const docData = doc.data() as any;
        const fullData: Record<string, any> = docData ? { id: doc.id, ...docData } : { id: doc.id };

        const cleanedData: Record<string, any> = {};
        for (const key in fullData) {
          if (!['id', 'createdAt', 'updatedAt', 'timestamp'].includes(key)) {
            cleanedData[key] = fullData[key];
          }
        }
        return cleanedData;
      });

      data.sort((a, b) => {
        const talukaA = (a['taluka'] || '').toString().toLowerCase();
        const talukaB = (b['taluka'] || '').toString().toLowerCase();
        const villageA = (a['village'] || '').toString().toLowerCase();
        const villageB = (b['village'] || '').toString().toLowerCase();

        const talukaCompare = talukaA.localeCompare(talukaB);
        if (talukaCompare !== 0) {
          return talukaCompare;
        }
        return villageA.localeCompare(villageB);
      });

      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${collectionName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting collection to CSV:', error);
    }
  }

  async readCsvAndWriteToDatabase(file: File, collectionName: string): Promise<void> {
    try {
      const csvData = await this.parseCsv(file);
      const batch = this.firestore.firestore.batch();

      csvData.forEach((item: any) => {
        const docRef = this.firestore.collection(collectionName).doc().ref;
        if (item.hasOwnProperty('order')) {
          item.order = Number(item.order);
        }
        item.timestamp = firebase.firestore.Timestamp.fromDate(new Date());
        batch.set(docRef, item);
      });

      await batch.commit();
      console.log('Data successfully written to Firebase!');
    } catch (error) {
      console.error('Error processing the CSV file or writing to Firebase:', error);
    }
  }

  private parseCsv(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => resolve(result.data),
        error: (error) => reject(error),
      });
    });
  }
}