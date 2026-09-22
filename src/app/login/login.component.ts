import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  router = inject(Router);
  firebaseService = inject(FirebaseService);
  authService = inject(AuthService);

  // Login Credentials & UI State
  credentials = {
    phone: '',
    password: ''
  };
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  // Password Reset Section States
  showResetSection = false;
  resetPhone = '';
  resetMessage = '';
  resetError = '';
  isApprovedForReset = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Primary User Login Action
   */
  async onLogin(): Promise<void> {
    const cleanPhone = this.credentials.phone.trim();

    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      this.errorMessage = 'कृपया योग्य १० अंकी मोबाईल नंबर प्रविष्ट करा.';
      return;
    }

    if (!this.credentials.password) {
      this.errorMessage = 'कृपया पासवर्ड प्रविष्ट करा.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await firstValueFrom(
        this.authService.loginWithPhoneAndPassword(cleanPhone, this.credentials.password)
      );
      this.router.navigateByUrl('home');
    } catch (error: any) {
      console.error('Login Error:', error);
      this.errorMessage = 'मोबाईल नंबर किंवा पासवर्ड चुकला आहे. कृपया पुन्हा प्रयत्न करा.';
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Triggers Password Reset Request for Regular User
   */
  async onRequestReset(): Promise<void> {
    this.resetError = '';
    this.resetMessage = '';
    this.isApprovedForReset = false;

    const cleanPhone = this.resetPhone.trim();

    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      this.resetError = 'कृपया योग्य १० अंकी मोबाईल नंबर प्रविष्ट करा.';
      return;
    }

    this.isLoading = true;
    try {
      const result = await this.firebaseService.requestPasswordReset(cleanPhone);
      if (result.success) {
        this.resetMessage = result.message;
      } else {
        this.resetError = result.message;
      }
    } catch (err) {
      console.error('Reset Request Error:', err);
      this.resetError = 'विनंती पाठवताना त्रुटी आली. कृपया नंतर प्रयत्न करा.';
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Checks if the Admin has approved the Password Reset Request
   */
  async onCheckResetStatus(): Promise<void> {
    this.resetError = '';
    this.resetMessage = '';
    this.isApprovedForReset = false;

    const cleanPhone = this.resetPhone.trim();

    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      this.resetError = 'कृपया योग्य १० अंकी मोबाईल नंबर प्रविष्ट करा.';
      return;
    }

    this.isLoading = true;
    try {
      const status = await this.firebaseService.checkResetStatus(cleanPhone);
      if (status.approved) {
        this.isApprovedForReset = true;
        this.resetMessage = 'आपली पासवर्ड रिसेट विनंती मंजूर झाली आहे!';
      } else if (status.requested) {
        this.resetMessage = 'आपली पासवर्ड रिSET विनंती प्रलंबित (Pending) आहे. ॲडमिन मंजुरीची वाट पहा.';
      } else {
        this.resetError = 'या नंबरसाठी कोणतीही रिसेट विनंती आढळली नाही.';
      }
    } catch (err) {
      console.error('Check Status Error:', err);
      this.resetError = 'स्थिती तपासताना त्रुटी आली.';
    } finally {
      this.isLoading = false;
    }
  }

  // Inside LoginComponent class in login.component.ts

  /**
   * Triggered automatically on phone input change.
   * Checks reset status as soon as a 10-digit valid number is entered.
   */
  async onPhoneInputChange(): Promise<void> {
    const cleanPhone = this.resetPhone.trim();

    // Reset internal states if user edits number
    this.resetError = '';
    this.resetMessage = '';
    this.isApprovedForReset = false;

    // Only check if phone number is exactly 10 digits
    if (/^[0-9]{10}$/.test(cleanPhone)) {
      await this.checkPhoneStatus(cleanPhone);
    }
  }

  /**
   * Reusable helper method to check pending reset status
   */
  private async checkPhoneStatus(phone: string): Promise<void> {
    this.isLoading = true;
    try {
      const status = await this.firebaseService.checkResetStatus(phone);

      if (status.approved) {
        this.isApprovedForReset = true;
        this.resetMessage = 'आपली पासवर्ड रिसेट विनंती मंजूर झाली आहे!';
      } else if (status.requested) {
        this.resetMessage = 'आपली पासवर्ड रिसेट विनंती प्रलंबित (Pending) आहे. ॲडमिन मंजुरीची वाट पहा.';
      } else {
        // No active request exists; keep resetMessage clean so the user can send a new request
        this.resetMessage = '';
      }
    } catch (err) {
      console.error('Check Status Error:', err);
      this.resetError = 'स्थिती तपासताना त्रुटी आली.';
    } finally {
      this.isLoading = false;
    }
  }

  /**
 * Toggle between Login view and Reset Password view.
 * Resets state messages when navigating back.
 */
  toggleResetView(show: boolean): void {
    this.showResetSection = show;
    this.resetError = '';
    this.resetMessage = '';
    this.isApprovedForReset = false;
    this.resetPhone = '';
  }

  /**
   * Navigates approved user to Register Component in Reset Mode
   */
  navigateToResetPage(): void {
    const cleanPhone = this.resetPhone.trim();
    this.router.navigate(['/register'], {
      queryParams: { mode: 'reset', phone: cleanPhone }
    });
  }

  /**
   * Navigates new visitor to Register Component for initial sign-up
   */
  onRegister(): void {
    this.router.navigateByUrl('register');
  }

  onBack(): void {
    this.router.navigateByUrl('');
  }
}