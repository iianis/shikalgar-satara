import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { taluka, talukas, village, villages } from '../../data/areas';
import { FirebaseService } from '../services/firebase.service';
import { Donation, FamilyMember, HelpReceived, Member, RecommendationLetter } from '../interfaces/interfaces';
import { HeaderComponent } from '../shared/header/header.component';

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

  // Form Group
  memberForm!: FormGroup;

  // Master Lists
  talukaList: taluka[] = talukas;
  allVillages: village[] = villages;
  filteredVillages: village[] = [];

  userTalukaSelection = '';
  userVillageSelection = '';

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    // Form initialized when entering the form step
  }
  goBack(): void {
    this.location.back();
  }

  selectMemberToEdit(member: Member): void {
    this.isEditMode = true;
    this.initForm(member);
    this.step = 'form';
  }

  // Navigation & State flags
  step: 'search' | 'not-found' | 'results' | 'form' = 'search';
  isEditMode = false;
  isLoading = false;

  // Dedicated property to hold the active document ID when editing
  editingMemberId: string | null = null;

  initForm(member?: Member): void {

    this.activeSection = 'personal';

    // Retain edit mode if explicit editing ID exists or passed member has an ID
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
      phone: [member?.phone || '', [Validators.required, Validators.pattern('^[0-9]{10}$')]], age: [
        member?.age ?? 21,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.min(1),
          Validators.max(99)
        ]
      ],
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

  async onSubmit(): Promise<void> {
    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      return;
    }

    // Extract raw form values
    const { id: formId, ...memberData } = this.memberForm.getRawValue();
    this.isLoading = true;

    try {
      // Rely explicitly on editingMemberId when editing, falling back to form control id
      const currentMemberId = this.isEditMode ? (this.editingMemberId || formId) : null;

      // Check duplicate phone excluding current member ID if updating
      const isDuplicate = await this.firebaseService.checkDuplicatePhone(
        memberData.phone,
        currentMemberId
      );

      if (isDuplicate) {
        this.isLoading = false;
        alert(`त्रुटी: '${memberData.phone}' हा मोबाईल नंबर दुसऱ्या सभासदासाठी आधीच नोंदणीकृत आहे!`);
        return;
      }

      if (this.isEditMode && currentMemberId) {
        // Perform Update (excluding the 'id' field from document payload)
        await this.firebaseService.updateMember(currentMemberId, memberData);
      } else {
        // Perform Insert
        await this.firebaseService.addMember(memberData);
      }

      this.isLoading = false;
      this.resetSearch();
    } catch (error) {
      this.isLoading = false;
      console.error('Error saving/updating member:', error);
      alert('माहिती जतन करताना त्रुटी आली.');
    }
  }

  filterVillages(talukaName: string): void {
    if (talukaName) {
      this.filteredVillages = this.allVillages.filter(v => v.taluka === talukaName);
    } else {
      this.filteredVillages = [...this.allVillages];
    }
  }

  // FormArray Getters
  get familyMembers(): FormArray { return this.memberForm.get('familyMembers') as FormArray; }
  get donations(): FormArray { return this.memberForm.get('donations') as FormArray; }
  get helpReceived(): FormArray { return this.memberForm.get('helpReceived') as FormArray; }
  get ageControl() {
    return this.memberForm.get('age');
  }

  // Dynamic Array Creators
  createFamilyGroup(data?: FamilyMember): FormGroup {
    return this.fb.group({
      relation: [data?.relation || ''],
      name: [data?.name || '', Validators.required],
      education: [data?.education || ''],
      age: [data?.age || null],
      gender: [data?.gender || ''],
      occupation: [data?.occupation || '']
    });
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

  // Update Search Control to accept either 10 digits OR text (fname)
  searchQueryControl = new FormControl('', [Validators.required, Validators.minLength(2)]);

  // --- Search Logic ---
  searchMember(): void {
    if (this.searchQueryControl.invalid) {
      this.searchQueryControl.markAsTouched();
      return;
    }

    const query = this.searchQueryControl.value!.trim();
    this.isLoading = true;

    // Check if query is 10-digit phone or partial text pattern
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
      }
    });
  }

  startNewMemberCreation(): void {
    const query = this.searchQueryControl.value || '';
    const isPhone = /^[0-9]{10}$/.test(query);

    // Auto-fill phone if input was numeric, otherwise auto-fill fname
    this.initForm({
      phone: isPhone ? query : '',
      fname: !isPhone ? query : ''
    } as Member);

    this.step = 'form';
  }

  // Track open edit rows by FormArray index
  editingFamilyIndexes: Set<number> = new Set<number>();
  editingDonationIndexes: Set<number> = new Set<number>();
  editingHelpIndexes: Set<number> = new Set<number>();

  // Helper methods to check edit state (New items default to open edit mode)
  isEditingFamily(index: number): boolean {
    return this.editingFamilyIndexes.has(index);
  }
  toggleEditFamily(index: number): void {
    if (this.editingFamilyIndexes.has(index)) {
      this.editingFamilyIndexes.delete(index);
    } else {
      this.editingFamilyIndexes.add(index);
    }
  }

  isEditingDonation(index: number): boolean {
    return this.editingDonationIndexes.has(index);
  }
  toggleEditDonation(index: number): void {
    if (this.editingDonationIndexes.has(index)) {
      this.editingDonationIndexes.delete(index);
    } else {
      this.editingDonationIndexes.add(index);
    }
  }

  isEditingHelp(index: number): boolean {
    return this.editingHelpIndexes.has(index);
  }
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

  // Track newly created unsaved rows
  newFamilyIndexes: Set<number> = new Set<number>();
  newDonationIndexes: Set<number> = new Set<number>();
  newHelpIndexes: Set<number> = new Set<number>();

  // --- FAMILY MEMBERS ---
  addFamilyMember(): void {
    this.familyMembers.insert(0, this.createFamilyGroup());
    this.shiftIndexesOnInsert(this.editingFamilyIndexes);
    this.shiftIndexesOnInsert(this.newFamilyIndexes);

    this.editingFamilyIndexes.add(0);
    this.newFamilyIndexes.add(0); // Mark index 0 as new
  }

  finishEditFamily(index: number): void {
    this.editingFamilyIndexes.delete(index);
    this.newFamilyIndexes.delete(index);
    this.memberForm.markAsDirty(); // Explicitly set form as dirty
    this.memberForm.updateValueAndValidity();
  }
  cancelNewFamilyMember(index: number): void {
    this.familyMembers.removeAt(index);
    this.editingFamilyIndexes.delete(index);
    this.newFamilyIndexes.delete(index);
  }

  // --- DONATIONS ---
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

  // --- HELP RECEIVED ---
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

  // Helper method to shift indices when prepending item at index 0
  private shiftIndexesOnInsert(indexSet: Set<number>): void {
    const updated = Array.from(indexSet).map(idx => idx + 1);
    indexSet.clear();
    updated.forEach(idx => indexSet.add(idx));
  }

  // 3. Add getter
  get recommendationLetters(): FormArray { return this.memberForm.get('recommendationLetters') as FormArray; }

  // 4. Add Group Creator
  createRecommendationGroup(data?: RecommendationLetter): FormGroup {
    return this.fb.group({
      date: [data?.date || new Date().toISOString().substring(0, 10)],
      name: [data?.name || '', Validators.required],
      description: [data?.description || '']
    });
  }

  // 5. Add Index Tracking Sets
  editingRecommendationIndexes: Set<number> = new Set<number>();
  newRecommendationIndexes: Set<number> = new Set<number>();

  // 6. Add Helper Methods & Handlers
  isEditingRecommendation(index: number): boolean {
    return this.editingRecommendationIndexes.has(index);
  }

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

  // 7. Update resetSearch()
  resetSearch(): void {
    this.isEditMode = false;
    this.editingMemberId = null;
    this.editingFamilyIndexes.clear();
    this.editingDonationIndexes.clear();
    this.editingHelpIndexes.clear();
    this.editingRecommendationIndexes.clear(); // Added
    this.newFamilyIndexes.clear();
    this.newDonationIndexes.clear();
    this.newHelpIndexes.clear();
    this.newRecommendationIndexes.clear(); // Added
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
}