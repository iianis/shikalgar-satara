import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AlertMessage {
  type: 'success' | 'danger' | 'info' | 'warning';
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<AlertMessage | null>(null);
  alert$ = this.alertSubject.asObservable();
  private timeoutId: any = null;

  showSuccess(text: string, durationMs: number = 4000): void {
    this.showAlert({ type: 'success', text }, durationMs);
  }

  showError(text: string, durationMs: number = 5000): void {
    this.showAlert({ type: 'danger', text }, durationMs);
  }

  showAlert(alert: AlertMessage, durationMs: number = 4000): void {
    this.clear();
    this.alertSubject.next(alert);
    if (durationMs > 0) {
      this.timeoutId = setTimeout(() => this.clear(), durationMs);
    }
  }

  clear(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.alertSubject.next(null);
  }
}