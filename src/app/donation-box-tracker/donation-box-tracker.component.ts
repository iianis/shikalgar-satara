import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location, NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { taluka, talukas, village, villages } from '../../data/areas';
import { firstValueFrom } from 'rxjs';

export interface BoxOpenedEntry {
  date: string;
  amount: number;
  openedBy: string;
  witness: string;
  remarks?: string;
}

export interface DonationBox {
  id?: string;
  memberName: string;
  phone: string;
  dateOfIssue: string;
  boxNumber: string;
  description?: string;
  taluka: string;
  village: string;
  directorName: string;
  boxOpenedHistory: BoxOpenedEntry[];
  createdAt?: any;
}

@Component({
  selector: 'app-donation-box-tracker',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, ReactiveFormsModule, FormsModule],
  templateUrl: './donation-box-tracker.component.html'
})
export class DonationBoxTrackerComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private firebaseService = inject(FirebaseService);
  private location = inject(Location);

  private readonly TALUKA_STORAGE_KEY = 'mytaluka';
  private readonly VILLAGE_STORAGE_KEY = 'myvillage';

  boxForm!: FormGroup;
  openBoxForm!: FormGroup;

  isLoading = false;
  isSubmitting = false;
  showAddBoxForm = false;
  selectedBoxForOpening: DonationBox | null = null;
  editingBoxId: string | null = null;

  successMessage = '';
  errorMessage = '';

  talukaList: taluka[] = talukas;
  allVillages: village[] = villages;
  filteredVillages: village[] = [];

  donationBoxes: DonationBox[] = [];
  loggedInDirectorName = '';
  searchTerm = '';
  isSeeding = false;

  async ngOnInit(): Promise<void> {
    const phone = await firstValueFrom(this.authService.getLoggedInPhone());

    if (!phone) {
      this.errorMessage = 'कृपया प्रथम लॉगिन करा.';
      this.isLoading = false;
      return;
    }

    this.initForms();
    this.setupAreaListeners();
    this.loadLoggedInDirectorAndBoxes();
  }

  private initForms(): void {
    const today = new Date().toISOString().split('T')[0];

    this.boxForm = this.fb.group({
      memberName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      dateOfIssue: [today, Validators.required],
      boxNumber: ['', Validators.required],
      taluka: ['', Validators.required],
      village: ['', Validators.required],
      description: ['']
    });

    this.openBoxForm = this.fb.group({
      date: [today, Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      openedBy: ['', Validators.required],
      witness: ['', Validators.required],
      remarks: ['']
    });
  }

  filterVillages(talukaName: string): void {
    this.filteredVillages = talukaName
      ? this.allVillages.filter(v => v.taluka === talukaName)
      : [...this.allVillages];
  }

  async loadLoggedInDirectorAndBoxes(): Promise<void> {
    this.isLoading = true;
    try {
      const phone = await firstValueFrom(this.authService.getLoggedInPhone());

      if (phone && this.firebaseService.getMemberByPhone) {
        const matchingSnapshot = await firstValueFrom(this.firebaseService.getMemberByPhone(phone));
        if (matchingSnapshot && matchingSnapshot.length > 0) {
          const memberData = matchingSnapshot[0];
          this.loggedInDirectorName = [memberData.fname, memberData.lname].filter(Boolean).join(' ');

          const savedTaluka = localStorage.getItem(this.TALUKA_STORAGE_KEY) || memberData.taluka || '';
          const savedVillage = localStorage.getItem(this.VILLAGE_STORAGE_KEY) || memberData.village || '';

          if (savedTaluka) {
            this.filterVillages(savedTaluka);
          }

          this.boxForm.patchValue({
            taluka: savedTaluka,
            village: savedVillage
          });
        }
      }

      await this.loadDonationBoxes();
    } catch (err) {
      console.error('Error loading director info or donation boxes:', err);
    } finally {
      this.isLoading = false;
    }
  }

  private setupAreaListeners(): void {
    this.boxForm.get('taluka')?.valueChanges.subscribe((selectedTaluka: string) => {
      if (selectedTaluka) {
        localStorage.setItem(this.TALUKA_STORAGE_KEY, selectedTaluka);
      }
      this.filterVillages(selectedTaluka);
      const currentVillage = this.boxForm.get('village')?.value;
      if (!this.filteredVillages.some(v => v.name === currentVillage)) {
        this.boxForm.get('village')?.setValue('');
      }
    });

    this.boxForm.get('village')?.valueChanges.subscribe((selectedVillage: string) => {
      if (selectedVillage) {
        localStorage.setItem(this.VILLAGE_STORAGE_KEY, selectedVillage);
      }
    });
  }

  async loadDonationBoxes(): Promise<void> {
    try {
      if (this.firebaseService.getDonationBoxes) {
        this.donationBoxes = await this.firebaseService.getDonationBoxes();

        this.donationBoxes.sort((a, b) => {
          const numA = parseInt(String(a.boxNumber).replace(/\D/g, ''), 10) || 0;
          const numB = parseInt(String(b.boxNumber).replace(/\D/g, ''), 10) || 0;
          return numA - numB;
        });
      }
    } catch (err) {
      console.error('Error loading donation boxes:', err);
    }
  }

  openNewBoxForm(): void {
    this.editingBoxId = null;
    this.selectedBoxForOpening = null;
    const today = new Date().toISOString().split('T')[0];

    const talukaToUse = localStorage.getItem(this.TALUKA_STORAGE_KEY) || this.boxForm.get('taluka')?.value || '';
    const villageToUse = localStorage.getItem(this.VILLAGE_STORAGE_KEY) || this.boxForm.get('village')?.value || '';

    if (talukaToUse) {
      this.filterVillages(talukaToUse);
    }

    this.boxForm.reset({
      dateOfIssue: today,
      taluka: talukaToUse,
      village: villageToUse,
      boxNumber: '',
      memberName: '',
      phone: '',
      description: ''
    });

    this.showAddBoxForm = true;
  }

  startEditBox(box: DonationBox): void {
    if (!box.id) {
      console.error('Box ID is missing, cannot edit!');
      return;
    }

    this.editingBoxId = box.id;
    this.selectedBoxForOpening = null;
    this.showAddBoxForm = true;

    if (box.taluka) {
      this.filterVillages(box.taluka);
    } else {
      this.filteredVillages = [...this.allVillages];
    }

    this.boxForm.patchValue({
      memberName: box.memberName || '',
      phone: box.phone || '',
      dateOfIssue: box.dateOfIssue || '',
      boxNumber: box.boxNumber || '',
      taluka: box.taluka || '',
      village: box.village || '',
      description: box.description || ''
    });

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollTop, behavior: 'smooth' });
    }, 100);
  }

  cancelBoxForm(): void {
    this.showAddBoxForm = false;
    this.editingBoxId = null;
    this.clearMessages(); // Clear alerts when cancelling
  }

  cancelOpeningRecord(): void {
    this.selectedBoxForOpening = null;
    this.clearMessages(); // Clear alerts when cancelling
  }

  getTotalAmount(box: DonationBox): number {
    if (!box.boxOpenedHistory || box.boxOpenedHistory.length === 0) return 0;
    return box.boxOpenedHistory.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
  }

  getLastOpenedEntry(box: DonationBox): BoxOpenedEntry | null {
    if (!box.boxOpenedHistory || box.boxOpenedHistory.length === 0) return null;
    return box.boxOpenedHistory[box.boxOpenedHistory.length - 1];
  }

  startOpeningRecord(box: DonationBox): void {
    this.selectedBoxForOpening = box;
    this.openBoxForm.reset({
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      openedBy: this.loggedInDirectorName,
      witness: ''
    });

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollTop, behavior: 'smooth' });
    }, 100);
  }

  async onSubmitBox(): Promise<void> {
    this.clearMessages();

    if (this.boxForm.invalid) {
      this.boxForm.markAllAsTouched();
      this.errorMessage = 'कृपया सर्व आवश्यक माहिती योग्यरीतीने भरा.';
      return;
    }

    this.isSubmitting = true;
    const formData = this.boxForm.getRawValue();

    if (formData.taluka) {
      localStorage.setItem(this.TALUKA_STORAGE_KEY, formData.taluka);
    }
    if (formData.village) {
      localStorage.setItem(this.VILLAGE_STORAGE_KEY, formData.village);
    }

    try {
      if (this.editingBoxId) {
        const updatePayload = {
          memberName: formData.memberName,
          phone: formData.phone,
          dateOfIssue: formData.dateOfIssue,
          boxNumber: formData.boxNumber,
          taluka: formData.taluka,
          village: formData.village,
          description: formData.description || ''
        };

        await this.firebaseService.updateDonationBox(this.editingBoxId, updatePayload);
        this.successMessage = 'दानपेटी माहिती यशस्वीपणे अद्ययावत झाली!';
      } else {
        const createPayload: DonationBox = {
          ...formData,
          directorName: this.loggedInDirectorName,
          boxOpenedHistory: []
        };

        await this.firebaseService.addDonationBox(createPayload);
        this.successMessage = 'नवीन सदका डब्बा नोंदवली गेली!';
      }

      this.cancelBoxForm();
      await this.loadDonationBoxes();
    } catch (err) {
      console.error('Error saving donation box:', err);
      this.errorMessage = 'दानपेटी माहिती जतन करताना त्रुटी आली.';
    } finally {
      this.isSubmitting = false;
    }
  }

  async onSubmitOpeningRecord(): Promise<void> {
    this.clearMessages();

    if (!this.selectedBoxForOpening || !this.selectedBoxForOpening.id) return;

    if (this.openBoxForm.invalid) {
      this.openBoxForm.markAllAsTouched();
      this.errorMessage = 'कृपया जमा रक्कमेचा तपशील अचूक भरा.';
      return;
    }

    this.isSubmitting = true;
    const newRecord: BoxOpenedEntry = this.openBoxForm.value;

    const updatedHistory = [
      ...(this.selectedBoxForOpening.boxOpenedHistory || []),
      newRecord
    ];

    try {
      await this.firebaseService.updateDonationBox(this.selectedBoxForOpening.id, {
        boxOpenedHistory: updatedHistory
      });

      this.successMessage = `पेटी क्र. ${this.selectedBoxForOpening.boxNumber} ची जमा नोंद जतन झाली!`;
      this.selectedBoxForOpening = null;
      await this.loadDonationBoxes();
    } catch (err) {
      console.error('Error updating box opening history:', err);
      this.errorMessage = 'नोंद जतन करताना त्रुटी आली.';
    } finally {
      this.isSubmitting = false;
    }
  }

  async deleteBox(id: string): Promise<void> {
    if (!confirm('तुम्हाला ही दानपेटी नोंद खरोखर हटवायची आहे का?')) return;

    try {
      await this.firebaseService.deleteDonationBox(id);
      this.successMessage = 'दानपेटी नोंद हटवली गेली!';
      await this.loadDonationBoxes();
    } catch (err) {
      console.error('Error deleting box:', err);
      this.errorMessage = 'नोंद हटवताना त्रुटी आली.';
    }
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  goBack(): void {
    if (this.showAddBoxForm) {
      this.cancelBoxForm();
    } else if (this.selectedBoxForOpening) {
      this.cancelOpeningRecord();
    } else {
      this.location.back();
    }
  }

  get filteredDonationBoxes(): DonationBox[] {
    if (!this.searchTerm.trim()) return this.donationBoxes;
    const term = this.searchTerm.toLowerCase();
    return this.donationBoxes.filter(box =>
      box.boxNumber.toLowerCase().includes(term) ||
      box.memberName.toLowerCase().includes(term) ||
      box.village.toLowerCase().includes(term) ||
      box.phone.includes(term)
    );
  }
}