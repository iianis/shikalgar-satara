import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../app/services/firebase.service';
import { AuthService } from '../../app/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { taluka, talukas, village, villages } from '../../data/areas';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  router = inject(Router);
  firebaseService = inject(FirebaseService);
  authService = inject(AuthService);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Mode Toggle & Password Visibility
  showProfileFields = false; // Default: false (Password Change Screen)
  showPassword = false;
  showConfirmPassword = false;

  // Master Lists
  talukaList: taluka[] = talukas;
  allVillages: village[] = villages;
  filteredVillages: village[] = [];

  registrationData = {
    phone: '',
    password: '',
    confirmPassword: '',
    initial: 'ज.',
    fname: '',
    lname: 'शिकलगार',
    age: 21,
    designation: 'सभासद',
    address: '',
    district: 'सातारा',
    taluka: 'सातारा',
    village: 'नागठाणे'
  };

  ngOnInit(): void {
    this.filterVillages(this.registrationData.taluka);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onTalukaChange(selectedTaluka: string): void {
    this.filterVillages(selectedTaluka);
    if (!this.filteredVillages.some(v => v.name === this.registrationData.village)) {
      this.registrationData.village = '';
    }
  }

  filterVillages(talukaName: string): void {
    if (talukaName) {
      this.filteredVillages = this.allVillages.filter(v => v.taluka === talukaName);
    } else {
      this.filteredVillages = [...this.allVillages];
    }
  }

  async onRegister() {
    const cleanPhone = this.registrationData.phone.trim();

    // 1. Core Password & Phone Validations (Always Executed)
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

    // 2. Personal Information Validations (Executed ONLY if toggle is active)
    if (this.showProfileFields) {
      if (!this.registrationData.fname.trim()) {
        this.errorMessage = 'कृपया नाव प्रविष्ट करा.';
        return;
      }

      if (!this.registrationData.lname.trim()) {
        this.errorMessage = 'कृपया आडनाव प्रविष्ट करा.';
        return;
      }

      if (!this.registrationData.age || this.registrationData.age < 1 || this.registrationData.age > 99) {
        this.errorMessage = 'कृपया योग्य वय (१ ते ९९) नमूद करा.';
        return;
      }

      if (!this.registrationData.taluka || !this.registrationData.village) {
        this.errorMessage = 'कृपया तालुका आणि गाव निवडा.';
        return;
      }
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      // 3. Check if member record exists in Firestore
      const existingMembers = await firstValueFrom(
        this.firebaseService.getMemberByPhone(cleanPhone)
      );

      // 4. Register or Update credentials in Firebase Authentication
      await firstValueFrom(
        this.authService.registerWithPhoneAndPassword(cleanPhone, this.registrationData.password)
      );

      // 5. Add new member profile to Firestore ONLY if member does not exist AND personal info toggle is enabled
      if (this.showProfileFields && (!existingMembers || existingMembers.length === 0)) {
        await this.firebaseService.addMember({
          initial: this.registrationData.initial,
          fname: this.registrationData.fname,
          lname: this.registrationData.lname,
          phone: cleanPhone,
          age: Number(this.registrationData.age),
          designation: this.registrationData.designation,
          address: this.registrationData.address,
          district: this.registrationData.district,
          taluka: this.registrationData.taluka,
          village: this.registrationData.village,
          joinedOn: new Date().toISOString().substring(0, 10),
          active: true,
          alive: true
        });
      }

      this.successMessage = 'नोंदणी / पासवर्ड अपडेट यशस्वी झाली! आता लॉगिन करा.';
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