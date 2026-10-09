import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location, NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { taluka, talukas, village, villages } from '../../data/areas';
import { firstValueFrom } from 'rxjs';

export interface DirectorVisit {
  id?: string;
  directorName: string;
  phone: string;
  village: string;
  taluka: string;
  visitType: 'भेट (Visit)' | 'बैठक (Meeting)' | 'कार्यक्रम (Event)' | 'इतर (Other)';
  placeName: string;
  totalMembersVisited: number;
  visitDate: string;
  purpose: string;
  remarks?: string;
  createdAt?: any;
}

@Component({
  selector: 'app-director-visit',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, ReactiveFormsModule, FormsModule],
  templateUrl: './director-visit.component.html'
})
export class DirectorVisitComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private firebaseService = inject(FirebaseService);
  private location = inject(Location);

  visitForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  showForm = false; // Controls visibility of the entry form
  editingId: string | null = null; // Track if editing existing entry
  successMessage = '';
  errorMessage = '';

  talukaList: taluka[] = talukas;
  allVillages: village[] = villages;
  filteredVillages: village[] = [];

  visitLogs: DirectorVisit[] = [];

  visitTypes = [
    'भेट (Visit)',
    'बैठक (Meeting)',
    'कार्यक्रम (Event)',
    'इतर (Other)'
  ];

  async ngOnInit(): Promise<void> {
    const phone = await firstValueFrom(this.authService.getLoggedInPhone());

    if (!phone) {
      this.errorMessage = 'कृपया प्रथम लॉगिन करा.';
      this.isLoading = false;
      return;
    }

    this.initForm();
    this.setupAreaListeners();
    this.loadLoggedInUserData();
  }

  private initForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.visitForm = this.fb.group({
      directorName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      taluka: ['', Validators.required],
      village: ['', Validators.required],
      visitType: ['भेट (Visit)', Validators.required],
      placeName: ['', Validators.required],
      totalMembersVisited: [1, [Validators.required, Validators.min(1)]],
      visitDate: [today, Validators.required],
      purpose: ['', [Validators.required, Validators.minLength(5)]],
      remarks: ['']
    });
  }

  private setupAreaListeners(): void {
    this.visitForm.get('taluka')?.valueChanges.subscribe((selectedTaluka: string) => {
      this.filterVillages(selectedTaluka);
      const currentVillage = this.visitForm.get('village')?.value;
      if (!this.filteredVillages.some(v => v.name === currentVillage)) {
        this.visitForm.get('village')?.setValue('');
      }
    });
  }

  filterVillages(talukaName: string): void {
    this.filteredVillages = talukaName
      ? this.allVillages.filter(v => v.taluka === talukaName)
      : [...this.allVillages];
  }

  async loadLoggedInUserData(): Promise<void> {
    this.isLoading = true;
    try {
      const phone = await firstValueFrom(this.authService.getLoggedInPhone());

      if (phone) {
        this.visitForm.patchValue({ phone });

        if (this.firebaseService.getMemberByPhone) {
          const matchingSnapshot = await firstValueFrom(this.firebaseService.getMemberByPhone(phone));

          if (matchingSnapshot && matchingSnapshot.length > 0) {
            const memberData = matchingSnapshot[0];
            const name = [memberData.fname, memberData.lname].filter(Boolean).join(' ');

            const selectedTaluka = memberData.taluka || '';
            this.filterVillages(selectedTaluka);

            this.visitForm.patchValue({
              directorName: name,
              taluka: selectedTaluka,
              village: memberData.village || ''
            });
          }
        }

        await this.loadVisitHistory(phone);
      }
    } catch (err) {
      console.error('Error loading logged-in director info:', err);
    } finally {
      this.isLoading = false;
    }
  }

  async loadVisitHistory(phone: string): Promise<void> {
    try {
      if (this.firebaseService.getDirectorVisitsByPhone) {
        this.visitLogs = await this.firebaseService.getDirectorVisitsByPhone(phone);
      }
    } catch (err) {
      console.error('Error loading visit history:', err);
    }
  }

  /**
   * Open the form to add a new visit entry
   */
  openNewVisitForm(): void {
    this.cancelEdit();
    this.showForm = true;
  }

  /**
   * Load existing visit data into the form for editing
   */
  editVisit(log: DirectorVisit): void {
    if (!log.id) return;
    this.editingId = log.id;
    this.showForm = true;

    this.filterVillages(log.taluka);

    this.visitForm.patchValue({
      directorName: log.directorName,
      phone: log.phone,
      taluka: log.taluka,
      village: log.village,
      visitType: log.visitType,
      placeName: log.placeName,
      totalMembersVisited: log.totalMembersVisited,
      visitDate: log.visitDate,
      purpose: log.purpose,
      remarks: log.remarks || ''
    });
  }

  /**
   * Cancel edit/entry mode and reset form state
   */
  cancelEdit(): void {
    this.editingId = null;
    this.showForm = false;
    this.visitForm.reset({
      directorName: this.visitForm.get('directorName')?.value,
      phone: this.visitForm.get('phone')?.value,
      taluka: this.visitForm.get('taluka')?.value,
      village: this.visitForm.get('village')?.value,
      visitType: 'भेट (Visit)',
      totalMembersVisited: 1,
      visitDate: new Date().toISOString().split('T')[0]
    });
  }

  /**
   * Delete entry with confirmation
   */
  async deleteVisit(id: string): Promise<void> {
    if (!confirm('तुम्हाला ही नोंद खरोखर हटवायची आहे का? (Are you sure you want to delete this entry?)')) {
      return;
    }

    try {
      await this.firebaseService.deleteDirectorVisit(id);
      this.successMessage = 'नोंद यशस्वीपणे हटवण्यात आली!';
      const currentPhone = this.visitForm.get('phone')?.value;
      if (currentPhone) {
        await this.loadVisitHistory(currentPhone);
      }
    } catch (err) {
      console.error('Error deleting visit:', err);
      this.errorMessage = 'नोंद हटवताना त्रुटी आली.';
    }
  }

  /**
   * Submit (Creates new entry OR Updates existing)
   */
  async onSubmit(): Promise<void> {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.visitForm.invalid) {
      this.visitForm.markAllAsTouched();
      this.errorMessage = 'कृपया सर्व आवश्यक माहिती योग्यरीतीने भरा.';
      return;
    }

    this.isSubmitting = true;
    const formData = this.visitForm.value;

    try {
      if (this.editingId) {
        // Update Mode
        await this.firebaseService.updateDirectorVisit(this.editingId, formData);
        this.successMessage = 'अहवाल यशस्वीपणे अद्ययावत (Update) झाला आहे!';
      } else {
        // Create Mode
        await this.firebaseService.addDirectorVisit(formData);
        this.successMessage = 'संचालक भेट नोंद यशस्वीपणे जतन झाली आहे!';
      }

      const currentPhone = this.visitForm.get('phone')?.value;
      const currentName = this.visitForm.get('directorName')?.value;
      const currentTaluka = this.visitForm.get('taluka')?.value;
      const currentVillage = this.visitForm.get('village')?.value;

      this.cancelEdit();

      if (currentPhone) {
        await this.loadVisitHistory(currentPhone);
      }
    } catch (err) {
      console.error('Error submitting visit:', err);
      this.errorMessage = 'माहिती जतन करताना त्रुटी आली. कृपया नंतर प्रयत्न करा.';
    } finally {
      this.isSubmitting = false;
    }
  }

  goBack(): void {
    if (this.showForm) {
      this.cancelEdit();
    } else {
      this.location.back();
    }
  }
}