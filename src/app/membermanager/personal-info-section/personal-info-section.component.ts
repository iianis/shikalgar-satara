import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { taluka, village } from '../../../data/areas';

@Component({
  selector: 'app-personal-info-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./personal-info-section.component.html"
})
export class PersonalInfoSectionComponent {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) talukaList: taluka[] = [];
  @Input({ required: true }) filteredVillages: village[] = [];

  get ageControl() {
    return this.formGroup.get('age');
  }
}