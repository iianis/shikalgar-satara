import { Timestamp } from '@angular/fire/firestore'; // Import Firestore's Timestamp type

/**
 * Utility function to check if the app is currently running in test mode.
 * Returns 'tmp' prefix for Firestore collection isolation if test mode is enabled,
 * otherwise returns an empty string.
 */
export function checkIfWeAreTesting(): string {
    return localStorage.getItem('isTesting') === 'true' ? 'tmp' : '';
}

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


export interface FamilyMember {
    relation?: 'आई' | 'वडील' | 'मुलगा' | 'मुलगी' | string;
    name: string;
    education?: string;
    age?: number;
    gender?: string;
    occupation?: string;
}

export interface Donation {
    date: string;
    amount: number;
    contributionType: 'सभासद वर्गणी' | 'जकात' | 'सदका' | 'फित्रा' | 'शैक्षणिक निधी' | 'इतर निधी';
    description?: string;
}

export interface HelpReceived {
    date: string;
    amount: number;
    helpType: 'शैक्षणिक' | 'वैद्यकिय' | 'लघुउदयोग' | 'आर्थिक ' | 'इतर';
    description?: string;
}

export interface RecommendationLetter {
    date: string;
    name: string;
    description?: string;
}

export interface Member {
    id?: string;
    initial?: string;
    fname: string;
    lname: string;
    address?: string;
    village: string;
    taluka: string;
    district: string;
    phone: string;
    age?: number;
    designation: string;
    joinedOn: string;
    alive?: boolean;
    active?: boolean;
    familyMembers?: FamilyMember[];
    donations?: Donation[];
    helpReceived?: HelpReceived[];
    recommendationLetters?: RecommendationLetter[]; // Added
    timestamp?: Date;
}