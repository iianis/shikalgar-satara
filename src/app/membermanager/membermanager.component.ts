import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { taluka, talukas, village, villages } from '../../data/areas';
import { FirebaseService } from '../services/firebase.service';
import { Donation, FamilyMember, HelpReceived, Member, RecommendationLetter } from '../interfaces/interfaces';
import { HeaderComponent } from '../shared/header/header.component';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-membermanager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent
  ],
  templateUrl: './membermanager.component.html',
  styleUrl: './membermanager.component.css'
})
export class MembermanagerComponent implements OnInit {

  firebaseService = inject(FirebaseService);
  private location = inject(Location);

  // Search Control & Found Members
  searchPhoneControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]);
  foundMembers: Member[] = [];

  authService = inject(AuthService);
  loggedInPhone: string | null = null;
  isAdminUser = false;
  canEditOtherSections = false;

  // Form Group
  memberForm!: FormGroup;

  // Master Lists
  talukaList: taluka[] = talukas;
  allVillages: village[] = villages;
  filteredVillages: village[] = [];

  userTalukaSelection = localStorage.getItem("mytaluka") || "सातारा";
  userVillageSelection = localStorage.getItem("myvillage") || "नागठाणे";
  step: 'search' | 'results' | 'not-found' | 'form' = 'search';
  isEditMode = false;
  isReadOnly = false;

  // Inline Feedback Banners
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Section visibility flags
  showPersonalSection = true;
  showDonationsSection = true;
  showRecommendationsSection = true;
  showHelpReceivedSection = true;

  clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }

  /**
   * Opens member details in Read-Only Mode (All sections visible, inputs disabled)
   */
  viewMemberDetails(member: Member): void {
    this.clearMessages();
    this.isReadOnly = true;
    this.isEditMode = true;

    // Enable visibility for all sections during view mode
    this.canEditOtherSections = true;

    this.initForm(member);
    this.memberForm.disable(); // Fully disables all form fields/controls

    this.applySectionPermissions(); // Ensures all section flags remain true
    this.step = 'form';
  }

  /**
   * Applies section visibility & edit permissions
   */
  applySectionPermissions(): void {
    if (this.isReadOnly) {
      this.showPersonalSection = true;
      this.showDonationsSection = true;
      this.showRecommendationsSection = true;
      this.showHelpReceivedSection = true;
      return;
    }

    const isOwnRecord = this.loggedInPhone === this.memberForm.get('phone')?.value;
    this.showPersonalSection = true; // Always visible
    this.showDonationsSection = this.isAdminUser || isOwnRecord;
    this.showRecommendationsSection = this.isAdminUser || isOwnRecord;
    this.showHelpReceivedSection = this.isAdminUser || isOwnRecord;
  }

  /**
   * Opens member details in Edit Mode
   */
  selectMemberToEdit(member: any): void {
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

    // Keep designation control disabled in edit mode
    this.memberForm.get('designation')?.disable();

    this.applySectionPermissions();
    this.step = 'form';
  }

  constructor(
    private fb: FormBuilder, private router: Router
  ) { }

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
    }

    const stateMember = history.state?.memberToEdit as Member | undefined;
    if (stateMember) {
      this.selectMemberToEdit(stateMember);
    }
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

  isLoading = false;
  editingMemberId: string | null = null;

  initForm(member?: Member): void {
    this.activeSection = 'personal';

    if (member?.id) {
      this.editingMemberId = member.id;
      this.isEditMode = true;
    } else if (!this.editingMemberId) {
      this.isEditMode = false;
    }

    const initialTaluka = member?.taluka || this.userTalukaSelection;
    const initialVillage = member?.village || this.userVillageSelection;

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
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.min(1),
          Validators.max(99)
        ]
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
      localStorage.setItem("mytaluka", selectedTaluka);
      if (!this.filteredVillages.some(v => v.name === currentVillage)) {
        this.memberForm.get('village')?.setValue('');
      }
    });
  }

  async onSubmit(): Promise<void> {
    this.clearMessages();

    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      this.errorMessage = 'कृपया सर्व आवश्यक माहिती योग्य प्रकारे भरा.';
      return;
    }

    const { id: formId, ...memberData } = this.memberForm.getRawValue();
    this.isLoading = true;

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
        this.successMessage = 'सभासद माहिती यशस्वीरित्या अद्ययावत केली!';
      } else {
        await this.firebaseService.addMember(memberData);
        this.successMessage = 'नवीन सभासद यशस्वीरित्या जतन केला!';
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
        this.resetSearch();
      }
    } catch (error) {
      this.isLoading = false;
      console.error('Error saving/updating member:', error);
      this.errorMessage = 'माहिती जतन करताना त्रुटी आली.';
    }
  }

  filterVillages(talukaName: string): void {
    if (talukaName) {
      this.filteredVillages = this.allVillages.filter(v => v.taluka === talukaName);
    } else {
      this.filteredVillages = [...this.allVillages];
    }
  }

  get familyMembers(): FormArray { return this.memberForm.get('familyMembers') as FormArray; }
  get donations(): FormArray { return this.memberForm.get('donations') as FormArray; }
  get helpReceived(): FormArray { return this.memberForm.get('helpReceived') as FormArray; }
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

  searchQueryControl = new FormControl('', [Validators.required, Validators.minLength(2)]);

  searchMember(): void {
    this.clearMessages();
    if (this.searchQueryControl.invalid) {
      this.searchQueryControl.markAsTouched();
      return;
    }

    const query = this.searchQueryControl.value!.trim();
    this.isLoading = true;

    const isPhone = /^[0-9]{10}$/.test(query);
    const search$ = isPhone
      ? this.firebaseService.getMemberByPhone(query)
      : this.firebaseService.getMembersByFnamePattern(query);

    search$.subscribe({
      next: (members) => {
        this.isLoading = false;
        if (members && members.length > 0) {
          this.foundMembers = members as Member[];
          this.step = 'results';
        } else {
          this.foundMembers = [];
          this.step = 'not-found';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching members:', err);
        this.errorMessage = 'सभासद शोधताना त्रुटी आली.';
      }
    });
  }

  startNewMemberCreation(): void {
    this.clearMessages();
    const query = (this.searchQueryControl.value || '').trim();
    const isPhone = /^[0-9]{10}$/.test(query);

    const initialData: Partial<Member> = {
      phone: isPhone ? query : '',
      fname: !isPhone ? query : ''
    };

    this.prepareNewMember(initialData);
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

  editingFamilyIndexes: Set<number> = new Set<number>();
  editingDonationIndexes: Set<number> = new Set<number>();
  editingHelpIndexes: Set<number> = new Set<number>();

  isEditingFamily(index: number): boolean { return this.editingFamilyIndexes.has(index); }
  toggleEditFamily(index: number): void {
    if (this.editingFamilyIndexes.has(index)) {
      this.editingFamilyIndexes.delete(index);
    } else {
      this.editingFamilyIndexes.add(index);
    }
  }

  isEditingDonation(index: number): boolean { return this.editingDonationIndexes.has(index); }
  toggleEditDonation(index: number): void {
    if (this.editingDonationIndexes.has(index)) {
      this.editingDonationIndexes.delete(index);
    } else {
      this.editingDonationIndexes.add(index);
    }
  }

  isEditingHelp(index: number): boolean { return this.editingHelpIndexes.has(index); }
  toggleEditHelp(index: number): void {
    if (this.editingHelpIndexes.has(index)) {
      this.editingHelpIndexes.delete(index);
    } else {
      this.editingHelpIndexes.add(index);
    }
  }

  removeFamilyMember(i: number): void {
    this.familyMembers.removeAt(i);
    this.editingFamilyIndexes.delete(i);
  }

  removeDonation(i: number): void {
    this.donations.removeAt(i);
    this.editingDonationIndexes.delete(i);
  }

  removeHelp(i: number): void {
    this.helpReceived.removeAt(i);
    this.editingHelpIndexes.delete(i);
  }

  newFamilyIndexes: Set<number> = new Set<number>();
  newDonationIndexes: Set<number> = new Set<number>();
  newHelpIndexes: Set<number> = new Set<number>();

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

  private shiftIndexesOnInsert(indexSet: Set<number>): void {
    const updated = Array.from(indexSet).map(idx => idx + 1);
    indexSet.clear();
    updated.forEach(idx => indexSet.add(idx));
  }

  get recommendationLetters(): FormArray { return this.memberForm.get('recommendationLetters') as FormArray; }

  createRecommendationGroup(data?: RecommendationLetter): FormGroup {
    return this.fb.group({
      date: [data?.date || new Date().toISOString().substring(0, 10)],
      name: [data?.name || '', Validators.required],
      description: [data?.description || '']
    });
  }

  editingRecommendationIndexes: Set<number> = new Set<number>();
  newRecommendationIndexes: Set<number> = new Set<number>();

  isEditingRecommendation(index: number): boolean { return this.editingRecommendationIndexes.has(index); }

  toggleEditRecommendation(index: number): void {
    if (this.editingRecommendationIndexes.has(index)) {
      this.editingRecommendationIndexes.delete(index);
    } else {
      this.editingRecommendationIndexes.add(index);
    }
  }

  removeRecommendation(i: number): void {
    this.recommendationLetters.removeAt(i);
    this.editingRecommendationIndexes.delete(i);
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

  resetSearch(): void {
    this.clearMessages();
    if (history.state?.memberToEdit) {
      history.state.memberToEdit = null;
    }

    this.isEditMode = false;
    this.editingMemberId = null;
    this.editingFamilyIndexes.clear();
    this.editingDonationIndexes.clear();
    this.editingHelpIndexes.clear();
    this.editingRecommendationIndexes.clear();
    this.newFamilyIndexes.clear();
    this.newDonationIndexes.clear();
    this.newHelpIndexes.clear();
    this.newRecommendationIndexes.clear();
    this.searchQueryControl.reset();
    this.foundMembers = [];
    this.step = 'search';
  }

  activeSection: string | null = 'personal';

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

  // Add helper getter or boolean property
  get isAdminOrReadOnly(): boolean {
    return this.isAdminUser || this.isReadOnly;
  }
  areAllExpanded: boolean = false;

  /**
   * Toggles expand/collapse state for all accordion sections
   */
  toggleAllSections(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.areAllExpanded = isChecked;

    if (isChecked) {
      this.expandAllSections();
    } else {
      this.collapseAllSections();
    }
  }
}