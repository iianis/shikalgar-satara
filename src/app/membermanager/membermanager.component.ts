import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { taluka, talukas, village, villages } from '../../data/areas';
import { FirebaseService } from '../services/firebase.service';

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
}

export interface HelpReceived {
  date: string;
  amount: number;
  helpType: 'शैक्षणिक' | 'वैद्यकिय' | 'लघुउदयोग' | 'आर्थिक ' | 'इतर';
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
  designation: string;
  joinedOn: string;
  alive?: boolean;
  active?: boolean;
  familyMembers?: FamilyMember[];
  donations?: Donation[];
  helpReceived?: HelpReceived[];
}

@Component({
  selector: 'app-membermanager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './membermanager.component.html',
  styleUrl: './membermanager.component.css'
})
export class MembermanagerComponent implements OnInit {


  firebaseService = inject(FirebaseService);
  private location = inject(Location);

  // Navigation & State flags
  step: 'search' | 'not-found' | 'results' | 'form' = 'search';
  isEditMode = false;
  isLoading = false;

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
  // --- Search Logic ---
  searchMember(): void {
    if (this.searchPhoneControl.invalid) {
      this.searchPhoneControl.markAsTouched();
      return;
    }

    const phone = this.searchPhoneControl.value!;
    this.isLoading = true;

    this.firebaseService.getMemberByPhone(phone).subscribe({
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
        console.error('Error fetching member by phone:', err);
      }
    });
  }

  selectMemberToEdit(member: Member): void {
    this.initForm(member);
    this.step = 'form';
  }

  startNewMemberCreation(): void {
    const searchedPhone = this.searchPhoneControl.value || '';
    this.initForm({ phone: searchedPhone } as Member);
    this.step = 'form';
  }

  resetSearch(): void {
    this.searchPhoneControl.reset();
    this.foundMembers = [];
    this.step = 'search';
  }

  // --- Form Logic ---
  initForm(member?: Member): void {
    this.isEditMode = !!(member && member.fname);

    const initialTaluka = member?.taluka || this.userTalukaSelection;
    const initialVillage = member?.village || this.userVillageSelection;

    // Fallback to today's date if joinedOn is missing or empty
    const defaultJoinedOn = member?.joinedOn || new Date().toISOString().substring(0, 10);

    // Fallback to true if alive is null or undefined
    const defaultAlive = (member?.alive ?? '') === '' ? true : Boolean(member?.alive);

    this.memberForm = this.fb.group({
      id: [member?.id || null],
      initial: [member?.initial || 'ज.'],
      fname: [member?.fname || '', Validators.required],
      lname: [member?.lname || 'शिकलगार', Validators.required],
      address: [member?.address || ''],
      district: [member?.district || 'सातारा', Validators.required],
      taluka: [initialTaluka, Validators.required],
      village: [initialVillage, Validators.required],
      phone: [member?.phone || '', [Validators.required, Validators.pattern('^[0-9]{10}$')]],

      // Set default to 'सभासद' and set disabled: true to make it read-only
      designation: [{ value: member?.designation || 'सभासद', disabled: false }, Validators.required],

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
      contributionType: [data?.contributionType || 'सभासद वर्गणी']
    });
  }

  createHelpGroup(data?: HelpReceived): FormGroup {
    return this.fb.group({
      date: [data?.date || new Date().toISOString().substring(0, 10)],
      amount: [data?.amount || null, [Validators.min(0)]],
      helpType: [data?.helpType || 'आर्थिक']
    });
  }

  addFamilyMember(): void { this.familyMembers.push(this.createFamilyGroup()); }
  removeFamilyMember(i: number): void { this.familyMembers.removeAt(i); }

  addDonation(): void { this.donations.push(this.createDonationGroup()); }
  removeDonation(i: number): void { this.donations.removeAt(i); }

  addHelp(): void { this.helpReceived.push(this.createHelpGroup()); }
  removeHelp(i: number): void { this.helpReceived.removeAt(i); }

  async onSubmit(): Promise<void> {
    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    // Includes values from disabled controls like 'designation'
    const memberData = this.memberForm.getRawValue();

    try {
      if (this.isEditMode && memberData.id) {
        // Update existing document instead of creating a new one
        await this.firebaseService.updateMember(memberData.id, memberData);
        alert('माहिती यशस्वीरित्या अद्ययावत केली!'); // Successfully updated!
      } else {
        // Create new document
        await this.firebaseService.addMember(memberData); //[cite: 4]
        alert('माहिती यशस्वीरित्या जतन केली!'); // Successfully saved!
      }

      this.isLoading = false;
      this.resetSearch();
    } catch (error) {
      this.isLoading = false;
      console.error('Error saving/updating member:', error);
      alert('माहिती जतन करताना त्रुटी आली.');
    }
  }
}