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
  private location = inject(Location)

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

    // Form for Adding / Editing Box Information
    this.boxForm = this.fb.group({
      memberName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      dateOfIssue: [today, Validators.required],
      boxNumber: ['', Validators.required],
      taluka: ['', Validators.required],
      village: ['', Validators.required],
      description: ['']
    });

    // Form for Recording a New "Box Opened" Entry
    this.openBoxForm = this.fb.group({
      date: [today, Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      openedBy: ['', Validators.required],
      witness: ['', Validators.required],
      remarks: ['']
    });
  }

  private setupAreaListeners(): void {
    this.boxForm.get('taluka')?.valueChanges.subscribe((selectedTaluka: string) => {
      this.filterVillages(selectedTaluka);
      const currentVillage = this.boxForm.get('village')?.value;
      if (!this.filteredVillages.some(v => v.name === currentVillage)) {
        this.boxForm.get('village')?.setValue('');
      }
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

          const selectedTaluka = memberData.taluka || '';
          this.filterVillages(selectedTaluka);
          this.boxForm.patchValue({
            taluka: selectedTaluka,
            village: memberData.village || ''
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

  async loadDonationBoxes(): Promise<void> {
    try {
      if (this.firebaseService.getDonationBoxes) {
        this.donationBoxes = await this.firebaseService.getDonationBoxes();
      }
    } catch (err) {
      console.error('Error loading donation boxes:', err);
    }
  }

  openNewBoxForm(): void {
    this.editingBoxId = null;
    this.selectedBoxForOpening = null;
    this.boxForm.reset({
      dateOfIssue: new Date().toISOString().split('T')[0],
      taluka: this.boxForm.get('taluka')?.value,
      village: this.boxForm.get('village')?.value
    });
    this.showAddBoxForm = true;
  }

  cancelBoxForm(): void {
    this.showAddBoxForm = false;
    this.editingBoxId = null;
  }

  /**
   * Calculates total collection accumulated across all opened instances
   */
  getTotalAmount(box: DonationBox): number {
    if (!box.boxOpenedHistory || box.boxOpenedHistory.length === 0) return 0;
    return box.boxOpenedHistory.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
  }

  /**
   * Retrieves details of the most recent opening event
   */
  getLastOpenedEntry(box: DonationBox): BoxOpenedEntry | null {
    if (!box.boxOpenedHistory || box.boxOpenedHistory.length === 0) return null;
    return box.boxOpenedHistory[box.boxOpenedHistory.length - 1];
  }

  /**
   * Open modal/section to record box opening history
   */
  startOpeningRecord(box: DonationBox): void {
    this.selectedBoxForOpening = box;
    this.openBoxForm.reset({
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      openedBy: this.loggedInDirectorName,
      witness: ''
    });
  }

  cancelOpeningRecord(): void {
    this.selectedBoxForOpening = null;
  }

  /**
   * Save new box registration or updates
   */
  async onSubmitBox(): Promise<void> {
    this.clearMessages();

    if (this.boxForm.invalid) {
      this.boxForm.markAllAsTouched();
      this.errorMessage = 'कृपया सर्व आवश्यक माहिती योग्यरीतीने भरा.';
      return;
    }

    this.isSubmitting = true;
    const formData = this.boxForm.value;

    const payload: DonationBox = {
      ...formData,
      directorName: this.loggedInDirectorName,
      boxOpenedHistory: this.editingBoxId ? undefined : []
    };

    try {
      if (this.editingBoxId) {
        await this.firebaseService.updateDonationBox(this.editingBoxId, payload);
        this.successMessage = 'दानपेटी माहिती यशस्वीपणे अद्ययावत झाली!';
      } else {
        await this.firebaseService.addDonationBox(payload);
        this.successMessage = 'नवीन दानपेटी यशस्वीपणे नोंदवली गेली!';
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

  /**
   * Save a new box opening record entry into boxOpenedHistory array
   */
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
}