import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { MemberFormService } from '../../services/member-form.service';

@Component({
  selector: 'app-donations-section',
  standalone: true,
  templateUrl: './donations-section.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class DonationsSectionComponent {
  @Input({ required: true }) donations!: FormArray;
  @Input() isReadOnly = false;
  @Input() canEdit = true; // Declared here to accept parent binding [canEdit]

  private formService = inject(MemberFormService);

  editingIndexes = new Set<number>();
  newIndexes = new Set<number>();

  isEditing(index: number): boolean { return this.editingIndexes.has(index); }

  toggleEdit(index: number): void {
    this.editingIndexes.has(index) ? this.editingIndexes.delete(index) : this.editingIndexes.add(index);
  }

  addDonation(): void {
    this.donations.insert(0, this.formService.createDonationGroup());
    this.shiftIndexes();
    this.editingIndexes.add(0);
    this.newIndexes.add(0);
  }

  finishEdit(index: number): void {
    this.editingIndexes.delete(index);
    this.newIndexes.delete(index);
  }

  cancelNew(index: number): void {
    this.donations.removeAt(index);
    this.editingIndexes.delete(index);
    this.newIndexes.delete(index);
  }

  removeDonation(i: number): void {
    this.donations.removeAt(i);
    this.editingIndexes.delete(i);
  }

  private shiftIndexes(): void {
    const updatedEdit = Array.from(this.editingIndexes).map(idx => idx + 1);
    const updatedNew = Array.from(this.newIndexes).map(idx => idx + 1);
    this.editingIndexes = new Set(updatedEdit);
    this.newIndexes = new Set(updatedNew);
  }
}