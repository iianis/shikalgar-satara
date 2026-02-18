import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-audits',
  imports: [],
  templateUrl: './audits.component.html',
  styleUrl: './audits.component.css'
})
export class AuditsComponent {

  location = inject(Location);
  goBack(): void {
    this.location.back();
  }
}
