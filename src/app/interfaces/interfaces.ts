import { Timestamp } from '@angular/fire/firestore'; // Import Firestore's Timestamp type

export interface IMember {
    fname: string,
    mname: string,
    lname: string,
    village: string,
    taluka: string,
    dist: string,
    phone: string,
    designation?: string,
    createdBy?: string | undefined,
    timestamp?: Timestamp | null,
    verificationCode?: string | undefined,
    verificationId?: string | undefined
}

export interface IUser {
    phoneNumber: string,
    verificationCode?: string,
    verificationId?: string
}

export interface IEvent {
    title: string,
    name: string,
    desc: string,
    village: string,
    eventBy: string,
    eventOn: string,
    createdBy: string,
    createdOn: string,
}