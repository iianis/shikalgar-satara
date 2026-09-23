import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom, take } from 'rxjs';

import { taluka, talukas, village, villages } from '../../data/areas';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { HeaderComponent } from '../shared/header/header.component';
import { Donation, FamilyMember, HelpReceived, Member, RecommendationLetter } from '../interfaces/interfaces';

@Component({
  selector: 'app-membermanager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent
  ],
  templateUrl: './membermanager.component.html',
  styleUrl: './membermanager.component.css'
})
export class MembermanagerComponent implements OnInit {

  // Dependency Injections
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);
  private location = inject(Location);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Application & Auth State
  loggedInPhone: string | null = null;
  loggedInUserFName: string | null = null;
  isAdminUser = false;
  canEditOtherSections = false;
  isLoading = false;

  // Navigation / View State
  step: 'search' | 'results' | 'not-found' | 'form' = 'search';
  isEditMode = false;
  isReadOnly = false;
  editingMemberId: string | null = null;

  // Master Data & Search State
  allMembers: Member[] = [];
  foundMembers: Member[] = [];
  isDataLoaded = false;
  hasSearched = false;
  searchTerm: string = '';

  // Dropdown Lists & Filters
  talukaList: taluka[] = talukas;
  allVillages: village[] = villages;
  filteredSearchVillages: village[] = [];
  filteredVillages: village[] = [];
  selectedTaluka: string = localStorage.getItem("mytaluka") || "none";
  selectedVillage: string = localStorage.getItem("myvillage") || "none";

  // Form Group
  memberForm!: FormGroup;

  // Accordion & Section Controls
  activeSection: string | null = 'personal';
  areAllExpanded = false;
  showPersonalSection = true;
  showDonationsSection = true;
  showRecommendationsSection = true;
  showHelpReceivedSection = true;

  // Inline Feedback Messages
  errorMessage: string | null = null;
  successMessage: string | null = null;
  private successTimeout: any = null;

  // Form Sub-item Editing Indexes
  editingFamilyIndexes = new Set<number>();
  editingDonationIndexes = new Set<number>();
  editingHelpIndexes = new Set<number>();
  editingRecommendationIndexes = new Set<number>();

  newFamilyIndexes = new Set<number>();
  newDonationIndexes = new Set<number>();
  newHelpIndexes = new Set<number>();
  newRecommendationIndexes = new Set<number>();

  // -------------------------------------------------------------------
  // LIFECYCLE HOOKS
  // -------------------------------------------------------------------
  async ngOnInit(): Promise<void> {
    this.loggedInPhone = await firstValueFrom(this.authService.getLoggedInPhone());

    if (!this.loggedInPhone) {
      this.router.navigateByUrl('login');
      return;
    }

    const matchingMemberSnapshot = await firstValueFrom(
      this.firebaseService.getMemberByPhone(this.loggedInPhone)
    );

    if (matchingMemberSnapshot && matchingMemberSnapshot.length > 0) {
      const currentMemberData = matchingMemberSnapshot[0];
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

  // -------------------------------------------------------------------
  // NAVIGATION & MESSAGES
  // -------------------------------------------------------------------
  clearMessages(): void {
    this.errorMessage = null;
    this.clearSuccessMessage();
  }

  setSuccessMessage(msg: string, durationMs: number = 4000): void {
    this.clearSuccessMessage();
    this.successMessage = msg;
    this.successTimeout = setTimeout(() => {
      this.successMessage = null;
    }, durationMs);
  }

  clearSuccessMessage(): void {
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
      this.successTimeout = null;
    }
    this.successMessage = null;
  }

  goBack(): void {
    this.clearMessages();
    this.location.back();
  }

  goBackFromForm(): void {
    this.clearMessages();
    if (history.state?.memberToEdit || (this.foundMembers.length === 0 && this.step === 'form')) {
      this.location.back();
      return;
    }

    if (this.foundMembers.length > 0) {
      this.step = 'results';
      return;
    }

    this.resetSearch();
  }

  // -------------------------------------------------------------------
  // FORM INITIALIZATION & SETUP
  // -------------------------------------------------------------------
  initForm(member?: Member): void {
    this.activeSection = 'personal';

    const initialTaluka = member?.taluka || (this.selectedTaluka !== 'none' ? this.selectedTaluka : '');
    const initialVillage = member?.village || (this.selectedVillage !== 'none' ? this.selectedVillage : '');

    if (member?.id) {
      this.editingMemberId = member.id;
      this.isEditMode = true;
    } else if (!this.editingMemberId) {
      this.isEditMode = false;
    }

    const defaultJoinedOn = member?.joinedOn || new Date().toISOString().substring(0, 10);
    const defaultAlive = (member?.alive ?? '') === '' ? true : Boolean(member?.alive);

    this.memberForm = this.fb.group({
      id: [member?.id || this.editingMemberId || null],
      initial: [member?.initial || 'ज.'],
      fname: [member?.fname || '', Validators.required],
      lname: [member?.lname || 'शिकलगार', Validators.required],
      address: [member?.address || ''],
      district: [member?.district || 'सातारा', Validators.required],
      taluka: [initialTaluka, Validators.required],
      village: [initialVillage, Validators.required],
      phone: [member?.phone || '', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      age: [
        member?.age ?? 21,
        [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(99)]
      ],
      education: [member?.education || ''],
      occupation: [member?.occupation || ''],
      designation: [{ value: member?.designation || 'सभासद', disabled: true }, Validators.required],
      joinedOn: [defaultJoinedOn, Validators.required],
      alive: [defaultAlive],
      active: [member?.active ?? true],
      familyMembers: this.fb.array(
        member?.familyMembers ? member.familyMembers.map(m => this.createFamilyGroup(m)) : []
      ),
      donations: this.fb.array(
        member?.donations ? member.donations.map(d => this.createDonationGroup(d)) : []
      ),
      helpReceived: this.fb.array(
        member?.helpReceived ? member.helpReceived.map(h => this.createHelpGroup(h)) : []
      ),
      recommendationLetters: this.fb.array(
        member?.recommendationLetters ? member.recommendationLetters.map(r => this.createRecommendationGroup(r)) : []
      )
    });

    if (initialTaluka) {
      this.filterVillages(initialTaluka);
    } else {
      this.filteredVillages = [...this.allVillages];
    }

    this.memberForm.get('taluka')?.valueChanges.subscribe((selectedTaluka: string) => {
      this.filterVillages(selectedTaluka);
      const currentVillage = this.memberForm.get('village')?.value;
      if (!this.filteredVillages.some(v => v.name === currentVillage)) {
        this.memberForm.get('village')?.setValue('');
      }
    });
  }

  // -------------------------------------------------------------------
  // MEMBER VIEW & EDIT MODES
  // -------------------------------------------------------------------
  viewMemberDetails(member: Member): void {
    this.clearMessages();
    this.isReadOnly = true;
    this.isEditMode = true;
    this.canEditOtherSections = true;

    this.initForm(member);
    this.memberForm.disable();

    this.applySectionPermissions();
    this.step = 'form';
  }

  selectMemberToEdit(member: Member): void {
    this.clearMessages();
    const isOwnRecord = this.loggedInPhone === member.phone;

    if (!isOwnRecord && !this.isAdminUser) {
      this.errorMessage = 'तुम्हाला फक्त स्वतःची माहिती अपडेट करण्याची परवानगी आहे.';
      return;
    }

    this.isReadOnly = false;
    this.isEditMode = true;

    this.initForm(member);
    this.memberForm.enable();
    this.memberForm.get('designation')?.disable();

    this.applySectionPermissions();
    this.step = 'form';
  }

  prepareNewMember(initialData: Partial<Member> = {}): void {
    this.editingMemberId = null;
    this.isEditMode = false;
    this.isReadOnly = false;

    this.initForm(initialData as Member);

    this.memberForm.enable();
    this.memberForm.get('designation')?.setValue('सभासद');
    this.memberForm.get('designation')?.disable();

    this.step = 'form';
  }

  applySectionPermissions(): void {
    if (this.isReadOnly) {
      this.showPersonalSection = true;
      this.showDonationsSection = true;
      this.showRecommendationsSection = true;
      this.showHelpReceivedSection = true;
      return;
    }

    const isOwnRecord = this.loggedInPhone === this.memberForm.get('phone')?.value;
    this.showPersonalSection = true;
    this.showDonationsSection = this.isAdminUser || isOwnRecord;
    this.showRecommendationsSection = this.isAdminUser || isOwnRecord;
    this.showHelpReceivedSection = this.isAdminUser || isOwnRecord;
  }

  // -------------------------------------------------------------------
  // FORM SUBMISSION & PERSISTENCE
  // -------------------------------------------------------------------
  async onSubmit(): Promise<void> {
    this.errorMessage = null;

    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      this.errorMessage = 'कृपया सर्व आवश्यक माहिती योग्य प्रकारे भरा.';
      return;
    }

    const { id: formId, ...memberData } = this.memberForm.getRawValue();
    this.isLoading = true;

    // Attach modification metadata
    const modifierIdentifier = this.loggedInUserFName || this.loggedInPhone;
    if (modifierIdentifier) {
      memberData.modifiedBy = modifierIdentifier;
      memberData.modifiedAt = new Date();
    }

    try {
      const currentMemberId = this.isEditMode ? (this.editingMemberId || formId) : null;

      const isDuplicate = await this.firebaseService.checkDuplicatePhone(
        memberData.phone,
        currentMemberId
      );

      if (isDuplicate) {
        this.isLoading = false;
        this.errorMessage = `त्रुटी: '${memberData.phone}' हा मोबाईल नंबर दुसऱ्या सभासदासाठी आधीच नोंदणीकृत आहे!`;
        return;
      }

      if (this.isEditMode && currentMemberId) {
        await this.firebaseService.updateMember(currentMemberId, memberData);
        this.setSuccessMessage('सभासद माहिती यशस्वीरित्या अद्ययावत केली!');
      } else {
        await this.firebaseService.addMember(memberData);
        this.setSuccessMessage('नवीन सभासद यशस्वीरित्या जतन केला!');
      }

      this.isLoading = false;
      this.isEditMode = false;
      this.isReadOnly = false;
      this.editingMemberId = null;
      this.memberForm.enable();

      this.memberForm.get('designation')?.setValue('सभासद');
      this.memberForm.get('designation')?.disable();

      this.initForm();

      if (this.foundMembers.length > 0) {
        this.step = 'results';
      } else {
        this.resetSearch(false);
      }
    } catch (error) {
      this.isLoading = false;
      console.error('Error saving/updating member:', error);
      this.errorMessage = 'माहिती जतन करताना त्रुटी आली.';
    }
  }

  // -------------------------------------------------------------------
  // SEARCH & FILTERING
  // -------------------------------------------------------------------
  async searchMember(): Promise<void> {
    this.clearMessages();
    this.hasSearched = true;

    if (!this.isDataLoaded) {
      this.isLoading = true;
      try {
        const data = await firstValueFrom(this.firebaseService.getMembers());
        this.allMembers = (data || []) as Member[];
        this.isDataLoaded = true;
      } catch (err) {
        console.error('Error fetching members:', err);
        this.errorMessage = 'सभासद माहिती लोड करताना त्रुटी आली.';
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
      const matchesSearch = !query ||
        m.fname?.toLowerCase().includes(query) ||
        m.phone?.includes(query);

      const matchesTaluka = this.selectedTaluka === 'none' || m.taluka === this.selectedTaluka;
      const matchesVillage = this.selectedVillage === 'none' || m.village === this.selectedVillage;

      return matchesSearch && matchesTaluka && matchesVillage;
    });

    this.step = this.foundMembers.length > 0 ? 'results' : 'not-found';
  }

  startNewMemberCreation(): void {
    this.clearMessages();
    const query = this.searchTerm.trim();
    const isPhone = /^[0-9]+$/.test(query);

    const initialData: Partial<Member> = {
      fname: isPhone ? '' : query,
      phone: isPhone ? query : '',
      taluka: this.selectedTaluka !== 'none' ? this.selectedTaluka : '',
      village: this.selectedVillage !== 'none' ? this.selectedVillage : ''
    };

    this.prepareNewMember(initialData);
    this.step = 'form';
  }

  resetSearch(clearAlerts: boolean = true): void {
    if (clearAlerts) {
      this.clearMessages();
    }

    if (history.state?.memberToEdit) {
      history.state.memberToEdit = null;
    }

    this.isEditMode = false;
    this.editingMemberId = null;
    this.clearSubArrayIndexes();

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

    const villageExists = this.filteredSearchVillages.some(v => v.name === this.selectedVillage);
    if (!villageExists) {
      this.selectedVillage = 'none';
      localStorage.setItem('myvillage', 'none');
    }

    if (this.hasSearched) {
      this.applySearchFilters();
    }
  }

  onVillageChange(event: Event): void {
    localStorage.setItem('myvillage', this.selectedVillage);

    if (this.hasSearched) {
      this.applySearchFilters();
    }
  }

  updateSearchVillages(): void {
    if (this.selectedTaluka && this.selectedTaluka !== 'none') {
      this.filteredSearchVillages = this.allVillages.filter(v => v.taluka === this.selectedTaluka);
    } else {
      this.filteredSearchVillages = [];
    }
  }

  filterVillages(talukaName: string): void {
    if (talukaName) {
      this.filteredVillages = this.allVillages.filter(v => v.taluka === talukaName);
    } else {
      this.filteredVillages = [...this.allVillages];
    }
  }

  // -------------------------------------------------------------------
  // FORM GETTERS & CREATORS FOR SUB-GROUPS
  // -------------------------------------------------------------------
  get familyMembers(): FormArray { return this.memberForm.get('familyMembers') as FormArray; }
  get donations(): FormArray { return this.memberForm.get('donations') as FormArray; }
  get helpReceived(): FormArray { return this.memberForm.get('helpReceived') as FormArray; }
  get recommendationLetters(): FormArray { return this.memberForm.get('recommendationLetters') as FormArray; }
  get ageControl() { return this.memberForm.get('age'); }

  createFamilyGroup(data?: FamilyMember): FormGroup {
    const group = this.fb.group({
      relation: [data?.relation || ''],
      name: [data?.name || '', Validators.required],
      education: [data?.education || ''],
      age: [data?.age || null],
      gender: [data?.gender || ''],
      occupation: [data?.occupation || '']
    });

    group.get('relation')?.valueChanges.subscribe((selectedRelation: string | null) => {
      if (!selectedRelation) return;

      if (['मुलगी', 'पत्नी', 'आई'].includes(selectedRelation)) {
        group.get('gender')?.setValue('स्त्री');
      } else if (['मुलगा', 'वडील', 'पति'].includes(selectedRelation)) {
        group.get('gender')?.setValue('पुरुष');
      }
    });

    return group;
  }

  createDonationGroup(data?: Donation): FormGroup {
    return this.fb.group({
      date: [data?.date || new Date().toISOString().substring(0, 10)],
      amount: [data?.amount || null, [Validators.min(0)]],
      contributionType: [data?.contributionType || 'सभासद वर्गणी'],
      description: [data?.description || '']
    });
  }

  createHelpGroup(data?: HelpReceived): FormGroup {
    return this.fb.group({
      date: [data?.date || new Date().toISOString().substring(0, 10)],
      amount: [data?.amount || null, [Validators.min(0)]],
      helpType: [data?.helpType || 'आर्थिक'],
      description: [data?.description || '']
    });
  }

  createRecommendationGroup(data?: RecommendationLetter): FormGroup {
    return this.fb.group({
      date: [data?.date || new Date().toISOString().substring(0, 10)],
      name: [data?.name || '', Validators.required],
      description: [data?.description || '']
    });
  }

  // -------------------------------------------------------------------
  // SUB-ARRAY MANAGEMENT: FAMILY MEMBERS
  // -------------------------------------------------------------------
  isEditingFamily(index: number): boolean { return this.editingFamilyIndexes.has(index); }

  toggleEditFamily(index: number): void {
    this.toggleIndex(this.editingFamilyIndexes, index);
  }

  addFamilyMember(): void {
    this.familyMembers.insert(0, this.createFamilyGroup());
    this.shiftIndexesOnInsert(this.editingFamilyIndexes);
    this.shiftIndexesOnInsert(this.newFamilyIndexes);
    this.editingFamilyIndexes.add(0);
    this.newFamilyIndexes.add(0);
  }

  finishEditFamily(index: number): void {
    this.editingFamilyIndexes.delete(index);
    this.newFamilyIndexes.delete(index);
    this.memberForm.markAsDirty();
    this.memberForm.updateValueAndValidity();
  }

  cancelNewFamilyMember(index: number): void {
    this.familyMembers.removeAt(index);
    this.editingFamilyIndexes.delete(index);
    this.newFamilyIndexes.delete(index);
  }

  removeFamilyMember(i: number): void {
    this.familyMembers.removeAt(i);
    this.editingFamilyIndexes.delete(i);
  }

  // -------------------------------------------------------------------
  // SUB-ARRAY MANAGEMENT: DONATIONS
  // -------------------------------------------------------------------
  isEditingDonation(index: number): boolean { return this.editingDonationIndexes.has(index); }

  toggleEditDonation(index: number): void {
    this.toggleIndex(this.editingDonationIndexes, index);
  }

  addDonation(): void {
    this.donations.insert(0, this.createDonationGroup());
    this.shiftIndexesOnInsert(this.editingDonationIndexes);
    this.shiftIndexesOnInsert(this.newDonationIndexes);
    this.editingDonationIndexes.add(0);
    this.newDonationIndexes.add(0);
  }

  finishEditDonation(index: number): void {
    this.editingDonationIndexes.delete(index);
    this.newDonationIndexes.delete(index);
    this.memberForm.markAsDirty();
    this.memberForm.updateValueAndValidity();
  }

  cancelNewDonation(index: number): void {
    this.donations.removeAt(index);
    this.editingDonationIndexes.delete(index);
    this.newDonationIndexes.delete(index);
  }

  removeDonation(i: number): void {
    this.donations.removeAt(i);
    this.editingDonationIndexes.delete(i);
  }

  // -------------------------------------------------------------------
  // SUB-ARRAY MANAGEMENT: HELP RECEIVED
  // -------------------------------------------------------------------
  isEditingHelp(index: number): boolean { return this.editingHelpIndexes.has(index); }

  toggleEditHelp(index: number): void {
    this.toggleIndex(this.editingHelpIndexes, index);
  }

  addHelp(): void {
    this.helpReceived.insert(0, this.createHelpGroup());
    this.shiftIndexesOnInsert(this.editingHelpIndexes);
    this.shiftIndexesOnInsert(this.newHelpIndexes);
    this.editingHelpIndexes.add(0);
    this.newHelpIndexes.add(0);
  }

  finishEditHelp(index: number): void {
    this.editingHelpIndexes.delete(index);
    this.newHelpIndexes.delete(index);
    this.memberForm.markAsDirty();
    this.memberForm.updateValueAndValidity();
  }

  cancelNewHelp(index: number): void {
    this.helpReceived.removeAt(index);
    this.editingHelpIndexes.delete(index);
    this.newHelpIndexes.delete(index);
  }

  removeHelp(i: number): void {
    this.helpReceived.removeAt(i);
    this.editingHelpIndexes.delete(i);
  }

  // -------------------------------------------------------------------
  // SUB-ARRAY MANAGEMENT: RECOMMENDATIONS
  // -------------------------------------------------------------------
  isEditingRecommendation(index: number): boolean { return this.editingRecommendationIndexes.has(index); }

  toggleEditRecommendation(index: number): void {
    this.toggleIndex(this.editingRecommendationIndexes, index);
  }

  addRecommendation(): void {
    this.recommendationLetters.insert(0, this.createRecommendationGroup());
    this.shiftIndexesOnInsert(this.editingRecommendationIndexes);
    this.shiftIndexesOnInsert(this.newRecommendationIndexes);
    this.editingRecommendationIndexes.add(0);
    this.newRecommendationIndexes.add(0);
  }

  finishEditRecommendation(index: number): void {
    this.editingRecommendationIndexes.delete(index);
    this.newRecommendationIndexes.delete(index);
    this.memberForm.markAsDirty();
    this.memberForm.updateValueAndValidity();
  }

  cancelNewRecommendation(index: number): void {
    this.recommendationLetters.removeAt(index);
    this.editingRecommendationIndexes.delete(index);
    this.newRecommendationIndexes.delete(index);
  }

  removeRecommendation(i: number): void {
    this.recommendationLetters.removeAt(i);
    this.editingRecommendationIndexes.delete(i);
  }

  // Helper methods for sub-array index management
  private toggleIndex(set: Set<number>, index: number): void {
    if (set.has(index)) {
      set.delete(index);
    } else {
      set.add(index);
    }
  }

  private shiftIndexesOnInsert(indexSet: Set<number>): void {
    const updated = Array.from(indexSet).map(idx => idx + 1);
    indexSet.clear();
    updated.forEach(idx => indexSet.add(idx));
  }

  private clearSubArrayIndexes(): void {
    this.editingFamilyIndexes.clear();
    this.editingDonationIndexes.clear();
    this.editingHelpIndexes.clear();
    this.editingRecommendationIndexes.clear();
    this.newFamilyIndexes.clear();
    this.newDonationIndexes.clear();
    this.newHelpIndexes.clear();
    this.newRecommendationIndexes.clear();
  }

  // -------------------------------------------------------------------
  // ACCORDION / SECTION TOGGLES
  // -------------------------------------------------------------------
  toggleSection(sectionKey: string): void {
    this.activeSection = this.activeSection === sectionKey ? null : sectionKey;
  }

  expandAllSections(): void {
    this.activeSection = 'all';
  }

  collapseAllSections(): void {
    this.activeSection = null;
  }

  isSectionOpen(sectionKey: string): boolean {
    return this.activeSection === sectionKey || this.activeSection === 'all';
  }

  toggleAllSections(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.areAllExpanded = isChecked;

    if (isChecked) {
      this.expandAllSections();
    } else {
      this.collapseAllSections();
    }
  }

  get isAdminOrReadOnly(): boolean {
    return this.isAdminUser || this.isReadOnly;
  }
}