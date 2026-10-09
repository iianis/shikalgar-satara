import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom, take } from 'rxjs';

import { taluka, talukas, village, villages } from '../../data/areas';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { MemberFormService } from '../services/member-form.service';
import { HeaderComponent } from '../shared/header/header.component';
import { AlertBannerComponent } from '../shared/alert-banner/alert-banner.component';
import { Member } from '../interfaces/interfaces';
import { PersonalInfoSectionComponent } from './personal-info-section/personal-info-section.component';
import { FamilyMembersSectionComponent } from './family-members-section/family-members-section.component';
import { DonationsSectionComponent } from './donations-section/donations-section.component';
import { HelpReceivedSectionComponent } from './help-received-section/help-received-section.component';
import { RecommendationsSectionComponent } from './recommendations-section/recommendations-section.component';

@Component({
  selector: 'app-membermanager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    AlertBannerComponent,
    PersonalInfoSectionComponent,
    FamilyMembersSectionComponent,
    DonationsSectionComponent,
    HelpReceivedSectionComponent,
    RecommendationsSectionComponent
  ],
  templateUrl: './membermanager.component.html'
})
export class MembermanagerComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private formService = inject(MemberFormService);
  private location = inject(Location);
  private router = inject(Router);

  loggedInPhone: string | null = null;
  loggedInUserFName: string | null = null;
  isAdminUser = false;
  isLoading = false;

  step: 'search' | 'results' | 'not-found' | 'form' = 'search';
  isEditMode = false;
  isReadOnly = false;
  editingMemberId: string | null = null;

  allMembers: Member[] = [];
  foundMembers: Member[] = [];
  isDataLoaded = false;
  hasSearched = false;
  searchTerm: string = '';

  talukaList: taluka[] = talukas;
  allVillages: village[] = villages;
  filteredSearchVillages: village[] = [];
  filteredVillages: village[] = [];
  selectedTaluka: string = localStorage.getItem("mytaluka") || "none";
  selectedVillage: string = localStorage.getItem("myvillage") || "none";

  memberForm!: FormGroup;

  activeSection: string | null = 'personal';
  areAllExpanded = false;

  isAdmin = false;
  isSelf = false;

  // Permissions helper getters
  get canEditPersonalInfo(): boolean {
    return this.isAdmin || this.isSelf;
  }

  get canEditFamilyMembers(): boolean {
    return this.isAdmin || this.isSelf;
  }

  get canEditAdminSections(): boolean {
    return this.isAdmin;
  }

  private applyFormSectionPermissions(): void {
    if (!this.canEditAdminSections) {
      // Disable administrative form arrays for non-admin users
      this.memberForm.get('donations')?.disable();
      this.memberForm.get('helpReceived')?.disable();
      this.memberForm.get('recommendationLetters')?.disable();
    } else {
      // Enable administrative form arrays for admins
      this.memberForm.get('donations')?.enable();
      this.memberForm.get('helpReceived')?.enable();
      this.memberForm.get('recommendationLetters')?.enable();
    }
  }

  async ngOnInit(): Promise<void> {
    this.loggedInPhone = await firstValueFrom(this.authService.getLoggedInPhone());
    if (!this.loggedInPhone) {
      this.router.navigateByUrl('login');
      return;
    }

    const matchingSnapshot = await firstValueFrom(this.firebaseService.getMemberByPhone(this.loggedInPhone));
    if (matchingSnapshot && matchingSnapshot.length > 0) {
      const currentMemberData = matchingSnapshot[0];
      this.isAdminUser = this.authService.isAdminDesignation(currentMemberData.designation);
      this.loggedInUserFName = currentMemberData.fname || null;
    }

    this.updateSearchVillages();

    const stateMember = history.state?.memberToEdit as Member | undefined;
    if (stateMember) {
      this.selectMemberToEdit(stateMember);
    }

    this.authService.getLoggedInPhone().pipe(take(1)).subscribe(phone => {
      if (phone && !sessionStorage.getItem('personal_info_logged')) {
        this.firebaseService.logPersonalAccess(phone);
        sessionStorage.setItem('personal_info_logged', 'true');
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  goBackFromForm(): void {
    if (history.state?.memberToEdit || (this.foundMembers.length === 0 && this.step === 'form')) {
      this.location.back();
      return;
    }
    this.step = this.foundMembers.length > 0 ? 'results' : 'search';
  }

  initForm(member?: Member): void {
    this.activeSection = 'personal';
    if (member?.id) {
      this.editingMemberId = member.id;
      this.isEditMode = true;
    } else if (!this.editingMemberId) {
      this.isEditMode = false;
    }

    this.memberForm = this.formService.buildMemberForm(member, this.selectedTaluka, this.selectedVillage);

    const initialTaluka = this.memberForm.get('taluka')?.value;
    this.filterVillages(initialTaluka);

    this.memberForm.get('taluka')?.valueChanges.subscribe((selectedTaluka: string) => {
      this.filterVillages(selectedTaluka);
      const currentVillage = this.memberForm.get('village')?.value;
      if (!this.filteredVillages.some(v => v.name === currentVillage)) {
        this.memberForm.get('village')?.setValue('');
      }
    });
  }

  selectMemberToEdit(member: Member): void {
    // Check if logged-in user holds an ADMIN_DESIGNATIONS title
    this.isAdmin = this.isAdminUser;
    this.isSelf = this.loggedInPhone === member.phone;

    const isOwnRecord = this.isSelf;
    if (!isOwnRecord && !this.isAdminUser) {
      this.alertService.showError('तुम्हाला फक्त स्वतःची माहिती अपडेट करण्याची परवानगी आहे.');
      return;
    }

    this.isReadOnly = false;
    this.isEditMode = true;
    this.initForm(member);

    this.memberForm.enable();

    // Apply permissions: Non-admins can edit personal/family details,
    // but administrative controls (donations, help, recommendations) remain disabled.
    this.applyFormSectionPermissions();

    this.memberForm.get('designation')?.disable();
    this.step = 'form';
  }

  viewMemberDetails(member: Member): void {
    this.isSelf = this.loggedInPhone === member.phone;
    this.isAdmin = this.isAdminUser;

    this.isReadOnly = true;
    this.isEditMode = true;
    this.initForm(member);
    this.memberForm.disable();
    this.step = 'form';
  }

  startNewMemberCreation(): void {
    const query = this.searchTerm.trim();
    const isPhone = /^[0-9]+$/.test(query);

    this.isSelf = true; // Creating a new record allows editing personal info
    this.isAdmin = this.isAdminUser;

    this.editingMemberId = null;
    this.isEditMode = false;
    this.isReadOnly = false;

    this.initForm({
      fname: isPhone ? '' : query,
      phone: isPhone ? query : '',
      taluka: this.selectedTaluka !== 'none' ? this.selectedTaluka : '',
      village: this.selectedVillage !== 'none' ? this.selectedVillage : ''
    } as Member);

    this.memberForm.enable();
    this.applyFormSectionPermissions();

    this.memberForm.get('designation')?.setValue('सभासद');
    this.memberForm.get('designation')?.disable();
    this.step = 'form';
  }

  async onSubmit(): Promise<void> {
    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      this.alertService.showError('कृपया सर्व आवश्यक माहिती योग्य प्रकारे भरा.');
      return;
    }

    const { id: formId, ...memberData } = this.memberForm.getRawValue();
    this.isLoading = true;

    const modifierIdentifier = this.loggedInUserFName || this.loggedInPhone;
    if (modifierIdentifier) {
      memberData.modifiedBy = modifierIdentifier;
      memberData.modifiedAt = new Date();
    }

    try {
      const currentMemberId = this.isEditMode ? (this.editingMemberId || formId) : null;
      const isDuplicate = await this.firebaseService.checkDuplicatePhone(memberData.phone, currentMemberId);

      if (isDuplicate) {
        this.isLoading = false;
        this.alertService.showError(`त्रुटी: '${memberData.phone}' हा मोबाईल नंबर दुसऱ्या सभासदासाठी आधीच नोंदणीकृत आहे!`);
        return;
      }

      if (this.isEditMode && currentMemberId) {
        await this.firebaseService.updateMember(currentMemberId, memberData);
        this.alertService.showSuccess('सभासद माहिती यशस्वीरित्या अद्ययावत केली!');
      } else {
        await this.firebaseService.addMember(memberData);
        this.alertService.showSuccess('नवीन सभासद यशस्वीरित्या जतन केला!');
      }

      this.isLoading = false;
      this.isEditMode = false;
      this.isReadOnly = false;
      this.editingMemberId = null;

      this.initForm();
      this.step = this.foundMembers.length > 0 ? 'results' : 'search';
    } catch (error) {
      this.isLoading = false;
      console.error('Error saving member:', error);
      this.alertService.showError('माहिती जतन करताना त्रुटी आली.');
    }
  }

  async searchMember(): Promise<void> {
    this.hasSearched = true;
    if (!this.isDataLoaded) {
      this.isLoading = true;
      try {
        const data = await firstValueFrom(this.firebaseService.getMembers());
        this.allMembers = (data || []) as Member[];
        this.isDataLoaded = true;
      } catch (err) {
        this.alertService.showError('सभासद माहिती लोड करताना त्रुटी आली.');
        this.isLoading = false;
        return;
      } finally {
        this.isLoading = false;
      }
    }
    this.applySearchFilters();
  }

  applySearchFilters(): void {
    const query = this.searchTerm.trim().toLowerCase();
    this.foundMembers = this.allMembers.filter(m => {
      const matchesSearch = !query || m.fname?.toLowerCase().includes(query) || m.phone?.includes(query);
      const matchesTaluka = this.selectedTaluka === 'none' || m.taluka === this.selectedTaluka;
      const matchesVillage = this.selectedVillage === 'none' || m.village === this.selectedVillage;
      return matchesSearch && matchesTaluka && matchesVillage;
    });
    this.step = this.foundMembers.length > 0 ? 'results' : 'not-found';
  }

  resetSearch(): void {
    this.isEditMode = false;
    this.editingMemberId = null;
    this.searchTerm = '';
    this.foundMembers = [];
    this.hasSearched = false;
    this.selectedTaluka = localStorage.getItem("mytaluka") || "none";
    this.selectedVillage = localStorage.getItem("myvillage") || "none";
    this.updateSearchVillages();
    this.step = 'search';
  }

  onTalukaChange(event: Event): void {
    localStorage.setItem('mytaluka', this.selectedTaluka);
    this.updateSearchVillages();
    if (!this.filteredSearchVillages.some(v => v.name === this.selectedVillage)) {
      this.selectedVillage = 'none';
      localStorage.setItem('myvillage', 'none');
    }
    if (this.hasSearched) this.applySearchFilters();
  }

  onVillageChange(event: Event): void {
    localStorage.setItem('myvillage', this.selectedVillage);
    if (this.hasSearched) this.applySearchFilters();
  }

  updateSearchVillages(): void {
    this.filteredSearchVillages = (this.selectedTaluka && this.selectedTaluka !== 'none')
      ? this.allVillages.filter(v => v.taluka === this.selectedTaluka)
      : [];
  }

  filterVillages(talukaName: string): void {
    this.filteredVillages = talukaName
      ? this.allVillages.filter(v => v.taluka === talukaName)
      : [...this.allVillages];
  }

  get familyMembers(): FormArray { return this.memberForm.get('familyMembers') as FormArray; }
  get donations(): FormArray { return this.memberForm.get('donations') as FormArray; }
  get helpReceived(): FormArray { return this.memberForm.get('helpReceived') as FormArray; }
  get recommendationLetters(): FormArray { return this.memberForm.get('recommendationLetters') as FormArray; }

  toggleSection(sectionKey: string): void {
    if (this.activeSection === 'all') {
      this.activeSection = sectionKey;
    } else {
      this.activeSection = this.activeSection === sectionKey ? null : sectionKey;
    }
    // Sync flag if all sections are manually interacted with
    this.areAllExpanded = false;
  }

  isSectionOpen(sectionKey: string): boolean {
    return this.activeSection === 'all' || this.activeSection === sectionKey;
  }

  toggleAllSections(): void {
    this.areAllExpanded = !this.areAllExpanded;
    this.activeSection = this.areAllExpanded ? 'all' : null;
  }
}