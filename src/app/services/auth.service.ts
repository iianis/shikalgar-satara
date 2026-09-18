import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, Observable, from } from 'rxjs';

export const ADMIN_DESIGNATIONS = [
  //'अध्यक्ष',
  'उपाध्यक्ष',
  'सचिव',
  'खजीनदार',
  'कार्यकारणी सदस्य'
];

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private afAuth = inject(AngularFireAuth);

  // App-specific internal domain suffix to convert 10-digit phone into Firebase auth string
  private readonly PHONE_AUTH_DOMAIN = '@app.local';

  /**
   * Transforms a 10-digit phone number into an internal auth string
   */
  formatPhoneToAuthUser(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '').trim();
    return `${cleanPhone}${this.PHONE_AUTH_DOMAIN}`;
  }

  /**
   * Log in user with phone number and custom password
   */
  loginWithPhoneAndPassword(phone: string, pass: string): Observable<any> {
    const authUser = this.formatPhoneToAuthUser(phone);
    return from(this.afAuth.signInWithEmailAndPassword(authUser, pass));
  }

  /**
   * Register a new member with phone number and password
   */
  registerWithPhoneAndPassword(phone: string, pass: string): Observable<any> {
    const authUser = this.formatPhoneToAuthUser(phone);
    return from(this.afAuth.createUserWithEmailAndPassword(authUser, pass));
  }

  /**
   * Get clean 10-digit phone number from current logged-in user
   */
  getLoggedInPhone(): Observable<string | null> {
    return this.afAuth.authState.pipe(
      map(user => {
        if (!user || !user.email) return null;
        return user.email.replace(this.PHONE_AUTH_DOMAIN, '').trim();
      })
    );
  }

  /**
   * Check if a member holds an Admin designation
   */
  isAdminDesignation(designation: string): boolean {
    if (!designation) return false;
    return ADMIN_DESIGNATIONS.includes(designation.trim());
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }
}