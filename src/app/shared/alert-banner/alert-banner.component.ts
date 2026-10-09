import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="alert$ | async as alert"
         class="alert alert-dismissible fade show mb-4 shadow-sm"
         [ngClass]="'alert-' + alert.type" role="alert">
      <i class="bi me-2" [ngClass]="{
        'bi-check-circle-fill': alert.type === 'success',
        'bi-exclamation-triangle-fill': alert.type === 'danger',
        'bi-info-circle-fill': alert.type === 'info'
      }"></i>
      {{ alert.text }}
      <button type="button" class="btn-close" (click)="clear()" aria-label="Close"></button>
    </div>
  `
})
export class AlertBannerComponent {
  private alertService = inject(AlertService);
  alert$ = this.alertService.alert$;

  clear(): void {
    this.alertService.clear();
  }
}