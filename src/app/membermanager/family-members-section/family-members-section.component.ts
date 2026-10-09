import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { MemberFormService } from '../../services/member-form.service';

@Component({
  selector: 'app-family-members-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./family-members-section.component.html"
})
export class FamilyMembersSectionComponent {
  @Input({ required: true }) familyMembers!: FormArray;
  @Input() isReadOnly = false;
  @Input() canEdit = true; // Declared here to accept parent binding [canEdit]

  private formService = inject(MemberFormService);

  editingIndexes = new Set<number>();
  newIndexes = new Set<number>();

  isEditing(index: number): boolean { return this.editingIndexes.has(index); }

  toggleEdit(index: number): void {
    this.editingIndexes.has(index) ? this.editingIndexes.delete(index) : this.editingIndexes.add(index);
  }

  addFamilyMember(): void {
    this.familyMembers.insert(0, this.formService.createFamilyGroup());
    this.shiftIndexes();
    this.editingIndexes.add(0);
    this.newIndexes.add(0);
  }

  finishEdit(index: number): void {
    this.editingIndexes.delete(index);
    this.newIndexes.delete(index);
  }

  cancelNew(index: number): void {
    this.familyMembers.removeAt(index);
    this.editingIndexes.delete(index);
    this.newIndexes.delete(index);
  }

  removeFamilyMember(i: number): void {
    this.familyMembers.removeAt(i);
    this.editingIndexes.delete(i);
  }

  private shiftIndexes(): void {
    const updatedEdit = Array.from(this.editingIndexes).map(idx => idx + 1);
    const updatedNew = Array.from(this.newIndexes).map(idx => idx + 1);
    this.editingIndexes = new Set(updatedEdit);
    this.newIndexes = new Set(updatedNew);
  }
}