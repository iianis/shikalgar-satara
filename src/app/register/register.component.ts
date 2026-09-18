import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../app/services/firebase.service';
import { AuthService } from '../../app/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HeaderComponent, CommonModule,
    FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  router = inject(Router);
  firebaseService = inject(FirebaseService);
  authService = inject(AuthService);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  registrationData = {
    phone: '',
    password: '',
    confirmPassword: '',
    fname: '',
    lname: 'शिकलगार',
    taluka: 'सातारा',
    village: 'नागठाणे'
  };

  async onRegister() {
    const cleanPhone = this.registrationData.phone.trim();

    // 1. Validation Checks
    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      this.errorMessage = 'कृपया योग्य १० अंकी मोबाईल नंबर प्रविष्ट करा.';
      return;
    }

    if (!this.registrationData.password || this.registrationData.password.length < 6) {
      this.errorMessage = 'पासवर्ड किमान ६ अंकांचा असावा.';
      return;
    }

    if (this.registrationData.password !== this.registrationData.confirmPassword) {
      this.errorMessage = 'पासवर्ड जुळत नाही!';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      // 2. Check if member record already exists in Firestore
      const existingMembers = await firstValueFrom(
        this.firebaseService.getMemberByPhone(cleanPhone)
      );

      // 3. Register user credentials in Firebase Authentication
      await firstValueFrom(
        this.authService.registerWithPhoneAndPassword(cleanPhone, this.registrationData.password)
      );

      // 4. Create Firestore profile record if this is a completely new member
      if (!existingMembers || existingMembers.length === 0) {
        await this.firebaseService.addMember({
          fname: this.registrationData.fname,
          lname: this.registrationData.lname,
          phone: cleanPhone,
          taluka: this.registrationData.taluka,
          village: this.registrationData.village,
          designation: 'सभासद',
          active: true,
          alive: true
        });
      }

      this.successMessage = 'नोंदणी यशस्वी झाली! आता लॉगिन करा.';
      setTimeout(() => this.router.navigateByUrl('login'), 2000);

    } catch (error: any) {
      console.error('Registration Error:', error);
      if (error.code === 'auth/email-already-in-use') {
        this.errorMessage = 'या मोबाईल नंबरवर आधीच खाते नोंदणीकृत आहे. कृपया लॉगिन करा.';
      } else {
        this.errorMessage = 'नोंदणी करताना त्रुटी आली. पुन्हा प्रयत्न करा.';
      }
    } finally {
      this.isLoading = false;
    }
  }

  onBack() {
    this.router.navigateByUrl('login');
  }
}