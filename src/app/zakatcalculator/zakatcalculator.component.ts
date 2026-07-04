import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-zakat-calculator',
  templateUrl: './zakatcalculator.component.html',
  imports: [CommonModule, FormsModule]
})
export class ZakatcalculatorComponent implements OnInit {
  // Rates (can be fetched from an API in a real app)
  goldRate: number = 15582;
  silverRate: number = 285;

  // User Inputs
  goldGrams: number = 0;
  silverGrams: number = 0;
  cashInHand: number = 0;
  businessStock: number = 0;
  loanAmount: number = 0;

  constructor() { }
  location = inject(Location);
  goBack(): void {
    this.location.back();
  }
  ngOnInit(): void { }

  // Item 1: Gold Amount
  get goldTotal(): number { return this.goldRate * this.goldGrams; }

  // Item 2: Silver Amount
  get silverTotal(): number { return this.silverRate * this.silverGrams; }

  // Item 5: Gross Total
  get grossTotal(): number {
    return this.goldTotal + this.silverTotal + this.cashInHand + this.businessStock;
  }

  // Item 7: Final Amount (Net Assets)
  get netAssets(): number {
    return Math.max(0, this.grossTotal - this.loanAmount);
  }

  // Item 8: Nisab Threshold (Based on Silver)
  get nisabThreshold(): number {
    return this.silverRate * 612.360;
  }

  // Item 9: Eligibility Check
  get isEligible(): boolean {
    return this.netAssets >= this.nisabThreshold;
  }

  // Item 10: Zakat Payable
  get zakatPayable(): number {
    return this.isEligible ? (this.netAssets / 40) : 0;
  }
}