import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, switchMap, Observable, of, from } from 'rxjs';
import firebase from 'firebase/compat/app';
import { IEvent, IMember } from '../interfaces/interfaces';
import { Timestamp } from '@angular/fire/firestore';
//import { format, parse } from 'date-fns';
import { firstValueFrom } from 'rxjs';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  authService = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  isUserAuthenticated = false;

  checkIfWeAreTesting() {
    //console.log("localStorage.getItem(\"isTesting\"): " + localStorage.getItem("isTesting"))
    return localStorage.getItem("isTesting") == "true" ? "tmp" : "";
  }

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
    return this.firestore.collection('members' + this.checkIfWeAreTesting()).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id; return { id, ...data };
      })));
  }

  async addMasterData(collectionName: string, item: any): Promise<void> {
    const id = this.firestore.createId();
    item.timestamp = Timestamp.now();
    return await this.firestore.collection(collectionName + this.checkIfWeAreTesting()).doc(id).set(item);
  };

  getMasterData(collectionName: string): Observable<any[]> {
    return this.firestore.collection(collectionName + this.checkIfWeAreTesting()).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id; return { id, ...data };
      })));
  }

  getCollectionCount(collectionName: string): Observable<number> {
    return from(this.firestore.collection(collectionName + this.checkIfWeAreTesting()).get()).pipe(
      map(snapshot => snapshot.size)
    );
  }

  getMasterDataOrderByField(collectionName: string, fieldName: string): Observable<any[]> {
    return this.firestore.collection(collectionName + this.checkIfWeAreTesting(),
      ref => ref.orderBy(fieldName))
      .valueChanges();
  }

  getMasterDataOrderByFieldDesc(collectionName: string, fieldName: string): Observable<any[]> {
    return this.firestore.collection(collectionName + this.checkIfWeAreTesting(),
      ref => ref.orderBy(fieldName, 'desc'))
      .valueChanges();
  }

  getMasterDataOrderByTimestamp(collectionName: string, fieldName: string): Observable<any[]> {
    return this.firestore.collection(collectionName + this.checkIfWeAreTesting(),
      ref => ref.orderBy(fieldName, 'desc'))
      .valueChanges();
  }

  getSettingById(id: string): Observable<any> {
    return this.firestore.collection('settings' + this.checkIfWeAreTesting()).doc(id).valueChanges();
  }

  getMemberByPhone(phone: string): Observable<any[]> {
    return this.firestore.collection('members' + this.checkIfWeAreTesting(), ref => ref.where('phone', '==', phone)).valueChanges();
  }

  async getMemberByPhonev2(phone: string): Promise<Observable<any[]>> {
    return await this.firestore.collection('members' + this.checkIfWeAreTesting(), ref => ref.where('phone', '==', phone)).valueChanges();
  }

  registerUser(phone: string, verificationId: string, verificationCode: string): Promise<void | null> {
    const id = this.firestore.createId();
    const userData = { uid: id, phone: phone, createdAt: firebase.firestore.FieldValue.serverTimestamp() };
    return this.firestore.collection('users' + this.checkIfWeAreTesting()).doc(id).set(userData);
  }

  registerEvent(eventData: IEvent): Promise<void | null> {
    const id = this.firestore.createId();
    return this.firestore.collection('events' + this.checkIfWeAreTesting()).doc(id).set(eventData);
  }

  async addMember(memberData: IMember): Promise<void> {
    const collectionName = "members" + this.checkIfWeAreTesting();
    const id = this.firestore.createId();
    memberData.timestamp = Timestamp.now();
    return this.firestore.collection('members' + this.checkIfWeAreTesting()).doc(id).set(memberData);
  };

  async addUserIssues(issue: string): Promise<void> {
    const id = this.firestore.createId();
    let item = {
      issue: issue,
      timestamp: Timestamp.now(),
    }
    return this.firestore.collection('memberrequests' + this.checkIfWeAreTesting()).doc(id).set(item);
  };

  loginUser(phoneNumber: string, verificationId: string, verificationCode: string): Observable<any> {
    const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
    return from(this.authService.signInWithCredential(credential).then(userCredential => {
      const user = userCredential.user;
      if (user) {
        return this.firestore.collection('users' + this.checkIfWeAreTesting()).doc(user.uid).get().toPromise().then(doc => {
          if (doc!.exists) {
            return user;
          } else {
            throw new Error('User not found in Firestore');
          }
        });
      } throw new Error('Authentication failed');
    }));
  }

  // Function to read Firebase collection and write to CSV
  async exportCollectionToCsv(collectionName: string): Promise<void> {
    try {
      // Fetch data from Firebase collection
      const snapshot = await firstValueFrom(this.firestore.collection(collectionName).get());

      // Map the data into an array of objects
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();

        // Merge id and docData into a single object
        const fullData: Record<string, any> = docData ? { id: doc.id, ...docData } : { id: doc.id };

        // Create a new object excluding unwanted fields
        const cleanedData: Record<string, any> = {};
        for (const key in fullData) {
          if (!['id', 'createdAt', 'updatedAt', 'timestamp'].includes(key)) {
            cleanedData[key] = fullData[key];
          }
        }

        return cleanedData;
      });

      // ✅ Sort data by 'taluka' first, then by 'village' (both alphabetically, case-insensitive)
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

      // Convert the data to CSV format using papaparse
      const csv = Papa.unparse(data);

      // Trigger the download of the CSV file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${collectionName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('CSV file downloaded successfully!');
    } catch (error) {
      console.error('Error exporting collection to CSV:', error);
    }
  }

  async readCsvAndWriteToDatabase(file: File, collectionName: string): Promise<void> {
    try {
      // Parse the CSV file
      const csvData = await this.parseCsv(file);

      // Write each entry to the Firebase collection
      const batch = this.firestore.firestore.batch(); // Use batch for efficient writes

      csvData.forEach((item: any) => {
        const docRef = this.firestore.collection(collectionName).doc().ref;
        if (item.hasOwnProperty('order')) {
          item.order = Number(item.order);
        }
        if (item.hasOwnProperty('timestamp')) {
          // Ensure you have imported firebase from 'firebase/app'
          // Alternatively, if you prefer a JavaScript Date object, you can simply use: item.timestamp = new Date(item.timestamp);
          //item.timestamp = firebase.firestore.Timestamp.fromDate(new Date(item.timestamp));
        } else {
          item.timestamp = firebase.firestore.Timestamp.fromDate(new Date());
        }
        batch.set(docRef, item); // Add each item as a document
      });

      // Commit the batch
      await batch.commit();
      console.log('Data successfully written to Firebase!');
    } catch (error) {
      console.error('Error processing the CSV file or writing to Firebase:', error);
    }
  }

  private parseCsv(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true, // Parse the first row as headers
        skipEmptyLines: true,
        complete: (result) => resolve(result.data),
        error: (error) => reject(error),
      });
    });
  }
}
