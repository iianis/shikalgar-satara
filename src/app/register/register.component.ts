import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  route = inject(ActivatedRoute);
  firebaseService = inject(FirebaseService);
  authService = inject(AuthService);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Auth & Mode Controls
  isLoggedIn = false;
  isAdmin = false;
  isPhoneReadOnly = false;
  isResetModeFromLogin = false;
  foundMemberByPhone: any = null;
  foundMemberByNameAndVillage: any = null;

  // Pending Reset Requests State (Admin View)
  pendingResetRequests: any[] = [];
  isLoadingRequests = false;
  activeAdminTab: 'register' | 'resetRequests' = 'register';

  // Toggle for Profile Fields / Reset View
  showProfileFields = false;
  showPassword = false;
  showConfirmPassword = false;

  talukaList: taluka[] = talukas;
  allVillages: village[] = villages;
  filteredVillages: village[] = [];

  // Expanded registration model to capture required personal attributes
  registrationData = {
    phone: '',
    password: '',
    confirmPassword: '',
    initial: 'ज.',
    fname: '',
    lname: 'शिकलगार',
    age: 25,
    joinedOn: new Date().toISOString().substring(0, 10), // Default to today YYYY-MM-DD
    education: '',
    occupation: '',
    designation: 'सभासद',
    address: '',
    district: 'सातारा',
    taluka: 'सातारा',
    village: 'नागठाणे'
  };

  async ngOnInit(): Promise<void> {
    this.filterVillages(this.registrationData.taluka);

    // Read Query Parameters
    this.route.queryParams.subscribe(async params => {
      const mode = params['mode'];
      const phone = params['phone'];

      if (mode === 'reset' && phone) {
        // Validate that this phone number is ACTUALLY approved for reset
        const status = await this.firebaseService.checkResetStatus(phone);
        if (!status.approved) {
          this.errorMessage = 'आपली पासवर्ड रिसेट विनंती अजून मंजूर झालेली नाही किंवा अमान्य आहे.';
          setTimeout(() => this.router.navigateByUrl('login'), 3000);
          return;
        }

        this.registrationData.phone = phone;
        this.isResetModeFromLogin = true;
        this.showProfileFields = false; // Directly show password view
        this.isPhoneReadOnly = true;    // Phone remains strictly read-only
        await this.checkExistingMemberByPhone(phone);
      } else {
        await this.evaluateUserPermissions();
      }
    });
  }

  async evaluateUserPermissions(): Promise<void> {
    const authUser = await firstValueFrom(this.firebaseService.getCurrentUser());
    if (authUser) {
      this.isLoggedIn = true;
      const cleanPhone = await firstValueFrom(this.authService.getLoggedInPhone());

      if (cleanPhone) {
        const members = await firstValueFrom(this.firebaseService.getMemberByPhone(cleanPhone));
        const loggedInMember = members && members.length > 0 ? members[0] : null;

        if (loggedInMember && this.authService.isAdminDesignation(loggedInMember.designation)) {
          this.isAdmin = true;
          this.isPhoneReadOnly = false; // Admin can change phone to manage others
          await this.loadPendingResetRequests(); // Fetch pending requests for Admin
        } else {
          this.isAdmin = false;
          this.isPhoneReadOnly = true;  // Standard user phone locked
          this.registrationData.phone = cleanPhone;
        }
      }
    } else {
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.isPhoneReadOnly = false;
    }
  }

  // Load all pending reset requests for Admin Panel
  async loadPendingResetRequests(): Promise<void> {
    this.isLoadingRequests = true;
    try {
      this.pendingResetRequests = await firstValueFrom(
        this.firebaseService.getPendingResetRequests()
      );
    } catch (err) {
      console.error('Error loading pending reset requests:', err);
    } finally {
      this.isLoadingRequests = false;
    }
  }

  // Admin approves reset request
  async approveReset(phone: string): Promise<void> {
    try {
      await this.firebaseService.approvePasswordReset(phone);
      this.successMessage = `मोबाईल ${phone} साठी पासवर्ड रिसेट विनंती मंजूर करण्यात आली आहे.`;
      await this.loadPendingResetRequests();
    } catch (err) {
      console.error('Approval Error:', err);
      this.errorMessage = 'विनंती मंजूर करताना त्रुटी आली.';
    }
  }

  // Admin rejects / clears reset request
  async rejectReset(phone: string): Promise<void> {
    try {
      await this.firebaseService.clearResetFlags(phone);
      this.successMessage = `मोबाईल ${phone} साठी पासवर्ड रिसेट विनंती रद्द करण्यात आली आहे.`;
      await this.loadPendingResetRequests();
    } catch (err) {
      console.error('Rejection Error:', err);
      this.errorMessage = 'विनंती रद्द करताना त्रुटी आली.';
    }
  }

  // Fast-fill phone number into form from request list
  selectPhoneForReset(phone: string): void {
    this.registrationData.phone = phone;
    this.activeAdminTab = 'register';
    this.showProfileFields = false;
    this.onPhoneChange();
  }

  async onPhoneChange(): Promise<void> {
    const cleanPhone = this.registrationData.phone.trim();
    if (cleanPhone.length === 10) {
      await this.checkExistingMemberByPhone(cleanPhone);
    } else {
      this.foundMemberByPhone = null;
    }
  }

  async onNameOrVillageChange(): Promise<void> {
    if (this.showProfileFields && this.registrationData.fname && this.registrationData.village) {
      this.foundMemberByNameAndVillage = await this.firebaseService.findMemberByNameAndVillage(
        this.registrationData.fname.trim(),
        this.registrationData.lname.trim(),
        this.registrationData.village
      );
    } else {
      this.foundMemberByNameAndVillage = null;
    }
  }

  async checkExistingMemberByPhone(phone: string): Promise<void> {
    try {
      const existingMembers = await firstValueFrom(
        this.firebaseService.getMemberByPhone(phone)
      );
      this.foundMemberByPhone = (existingMembers && existingMembers.length > 0) ? existingMembers[0] : null;
    } catch (err) {
      console.error('Error fetching member:', err);
      this.foundMemberByPhone = null;
    }
  }

  filterVillages(talukaName: string): void {
    if (talukaName) {
      this.filteredVillages = this.allVillages.filter(v => v.taluka === talukaName);
    } else {
      this.filteredVillages = [...this.allVillages];
    }
    this.onNameOrVillageChange();
  }

  async onRegister(): Promise<void> {
    const cleanPhone = this.registrationData.phone.trim();

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
      // 1. Update Authentication Credentials
      await firstValueFrom(
        this.authService.registerWithPhoneAndPassword(cleanPhone, this.registrationData.password)
      );

      // 2. Add New Member Profile including all detailed personal fields
      if (this.showProfileFields && !this.foundMemberByPhone) {
        await this.firebaseService.addMember({
          initial: this.registrationData.initial,
          fname: this.registrationData.fname,
          lname: this.registrationData.lname,
          phone: cleanPhone,
          age: Number(this.registrationData.age),
          joinedOn: this.registrationData.joinedOn,
          education: this.registrationData.education,
          occupation: this.registrationData.occupation,
          designation: this.registrationData.designation,
          address: this.registrationData.address,
          district: this.registrationData.district,
          taluka: this.registrationData.taluka,
          village: this.registrationData.village,
          active: true,
          alive: true,
          passwordResetRequested: false,
          passwordResetApproved: false
        });
      }

      // 3. Clear reset flags upon successful update
      await this.firebaseService.clearResetFlags(cleanPhone);

      this.successMessage = 'नोंदणी / पासवर्ड अपडेट यशस्वी झाला! आता लॉगिन करा.';
      setTimeout(() => this.router.navigateByUrl('login'), 2000);

    } catch (error: any) {
      console.error('Registration Error:', error);
      this.errorMessage = 'त्रुटी आली. कृपया नोंदणी माहिती तपासा आणि पुन्हा प्रयत्न करा.';
    } finally {
      this.isLoading = false;
    }
  }

  onBack(): void {
    this.router.navigateByUrl('login');
  }
}