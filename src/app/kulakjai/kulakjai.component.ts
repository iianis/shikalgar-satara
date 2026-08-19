import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FarmAccount, FarmTransaction, FarmCategory, AccountReport } from './kulakjai-account.model';

@Component({
  selector: 'app-kulakjai',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kulakjai.component.html',
  styleUrls: ['./kulakjai.component.css']
})
export class KulakjaiComponent {

  categories: FarmCategory[] = [
    'जनावर व्यवस्थापन',
    'कुक्कुटपालन',
    'पिके व बियाणे',
    'पायाभूत सुविधा व शेड',
    'मजुरी व कामे',
    'उपकरणे व देखभाल',
    'मालकाचे भांडवल',
    'इतर खर्च'
  ];

  // Pre-populated accounts in Marathi
  accounts = signal<FarmAccount[]>([
    { id: 'acc-equity', name: 'मालकाचे भांडवल जमा', category: 'मालकाचे भांडवल' },
    { id: 'acc-1', name: 'गाई-म्हशी खरेदी/विक्री व दूध', category: 'जनावर व्यवस्थापन' },
    { id: 'acc-2', name: 'कुक्कुटपालन (पोल्ट्री फॉर्म)', category: 'कुक्कुटपालन' },
    { id: 'acc-3', name: 'पिकं व लागवड खर्च', category: 'पिके व बियाणे' },
    { id: 'acc-4', name: 'गोठा / शेड बांधकाम', category: 'पायाभूत सुविधा व शेड' },
    { id: 'acc-5', name: 'शेतातील मजुरी खर्च', category: 'मजुरी व कामे' },
    { id: 'acc-6', name: 'कामगारांचा पगार', category: 'मजुरी व कामे' },
    { id: 'acc-7', name: 'विज बील', category: 'इतर खर्च' },
  ]);

  // Pre-populated sample transactions in Marathi
  transactions = signal<FarmTransaction[]>([
    //{ id: 'tx-1', accountId: 'acc-equity', date: '2026-08-01', title: 'मालकाचे भांडवल जमा', type: 'CREDIT', amount: 500000, notes: 'खात्यात जमा केलेले भांडवल' },
    //{ id: 'tx-2', accountId: 'acc-1', date: '2026-08-01', title: 'गाय विक्री', type: 'CREDIT', amount: 45000, notes: '१ एचएफ (HF) गाय विकली' },
    //{ id: 'tx-3', accountId: 'acc-4', date: '2026-08-03', title: 'सिमेंट आणि पत्रे खरेदी', type: 'DEBIT', amount: 18500, notes: 'गोठ्याच्या छतासाठी साहित्य' },
    //{ id: 'tx-4', accountId: 'acc-3', date: '2026-08-05', title: 'बियाणे व खते खरेदी', type: 'DEBIT', amount: 6200, notes: 'जैविक खते' },
    //{ id: 'tx-5', accountId: 'acc-2', date: '2026-08-07', title: 'पोल्ट्री बॅच विक्री', type: 'CREDIT', amount: 12000, notes: 'बॅच क्र. ४ ची विक्री' },
    //{ id: 'tx-6', accountId: 'acc-5', date: '2026-08-08', title: 'हप्त्याची मजुरी दिली', type: 'DEBIT', amount: 4500, notes: 'रान साफसफाई व पेरणीचे काम' },

    { id: 'tx-', accountId: 'acc-equity', date: '2026-08-01', amount: 150000, title: 'मालकाचे भांडवल जमा', type: 'CREDIT', notes: '2020' },
    { id: 'tx-', accountId: 'acc-equity', date: '2026-08-01', amount: 150000, title: 'मालकाचे भांडवल जमा', type: 'CREDIT', notes: '2021' },
    { id: 'tx-', accountId: 'acc-equity', date: '2026-08-01', amount: 150000, title: 'मालकाचे भांडवल जमा', type: 'CREDIT', notes: '2022' },
    { id: 'tx-', accountId: 'acc-equity', date: '2026-08-01', amount: 250000, title: 'मालकाचे भांडवल जमा', type: 'CREDIT', notes: '2023' },
    { id: 'tx-', accountId: 'acc-equity', date: '2026-08-01', amount: 250000, title: 'मालकाचे भांडवल जमा', type: 'CREDIT', notes: '2024' },
    { id: 'tx-', accountId: 'acc-equity', date: '2026-08-01', amount: 250000, title: 'मालकाचे भांडवल जमा', type: 'CREDIT', notes: '2025' },
    { id: 'tx-', accountId: 'acc-equity', date: '2026-08-01', amount: 250000, title: 'मालकाचे भांडवल जमा', type: 'CREDIT', notes: '2026' },

    // { id: 'tx-', accountId: 'acc-5', date: '2022-08-08', title: 'पगार', type: 'DEBIT', amount: 96000, notes: 'पगार 2022' },
    // { id: 'tx-', accountId: 'acc-5', date: '2023-08-08', title: 'पगार', type: 'DEBIT', amount: 96000, notes: 'पगार 2023' },
    // { id: 'tx-', accountId: 'acc-5', date: '2024-08-08', title: 'पगार', type: 'DEBIT', amount: 96000 - 30000, notes: 'पगार 2024' },
    // { id: 'tx-', accountId: 'acc-5', date: '2025-08-08', title: 'पगार', type: 'DEBIT', amount: 96000 - 50000, notes: 'पगार 2025' },
    // { id: 'tx-', accountId: 'acc-5', date: '2026-08-08', title: 'पगार', type: 'DEBIT', amount: 56000, notes: 'पगार 2026' },

    { id: 'tx-', accountId: 'acc-5', date: '2026-08-08', title: 'विजेचे बील', type: 'DEBIT', amount: 325 * 12 * 9, notes: 'Electricity Bill per month around 300-350, 9 yrs, 12 months' },

    { id: 'tx-', accountId: 'acc-1', date: '2021-09-21', title: 'गाय विक्री', type: 'CREDIT', amount: 10000, notes: 'गाय विक्री' },
    { id: 'tx-', accountId: 'acc-1', date: '2021-09-21', title: 'गाय विक्री', type: 'CREDIT', amount: 10000, notes: 'गाय विक्री' },
    { id: 'tx-', accountId: 'acc-1', date: '2021-09-21', title: 'गाय विक्री', type: 'CREDIT', amount: 10000, notes: 'गाय विक्री' },
    { id: 'tx-', accountId: 'acc-1', date: '2025-09-01', title: 'गाय विक्री', type: 'CREDIT', amount: 60000, notes: 'गाय विक्री' },
    { id: 'tx-', accountId: 'acc-1', date: '2025-09-01', title: 'गाय विक्री', type: 'CREDIT', amount: 25000, notes: 'गाय विक्री' },
    { id: 'tx-', accountId: 'acc-1', date: '2026-05-25', title: 'गाय विक्री', type: 'CREDIT', amount: 30000, notes: 'गाय विक्री' },

    { id: 'tx-', accountId: 'acc-1', date: '2026-05-25', title: 'गाय विक्री', type: 'CREDIT', amount: 145200, notes: 'गाय विक्री' },


    { id: 'tx-', accountId: 'acc-3', date: '2020-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2020-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 20000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2020-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 50000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2020-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 50000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2020-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 20000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2020-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 20000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2020-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 20000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2020-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 6000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 13000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },

    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 15000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 15000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 30000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 16600, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 15000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 30000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 35000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },

    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 50000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 30000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 25000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 30000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2021-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },

    { id: 'tx-', accountId: 'acc-3', date: '2022-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2022-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2022-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 8000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2022-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 7000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2022-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 20000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2022-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 8000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2022-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 20000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2022-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 25000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-5', date: '2022-08-08', title: 'पगार', type: 'DEBIT', amount: 50000, notes: 'LOAN ADV SALARY' },
    { id: 'tx-', accountId: 'acc-3', date: '2023-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },

    { id: 'tx-', accountId: 'acc-3', date: '2023-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 20000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2023-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 50000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2023-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 20000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2024-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 20000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2024-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 20000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2024-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2024-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 40000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2024-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 50000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2024-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: ' लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2024-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 25000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },

    { id: 'tx-', accountId: 'acc-5', date: '2024-08-08', title: 'पगार', type: 'DEBIT', amount: 22000, notes: 'पगार 2024' },
    { id: 'tx-', accountId: 'acc-3', date: '2024-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2024-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 20000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2024-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 20000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-5', date: '2024-08-08', title: 'पगार', type: 'DEBIT', amount: 24000, notes: 'पगार 2024' },
    { id: 'tx-', accountId: 'acc-5', date: '2024-08-08', title: 'पगार', type: 'DEBIT', amount: 24000, notes: 'पगार 2024' },
    { id: 'tx-', accountId: 'acc-3', date: '2024-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 50000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-5', date: '2025-08-08', title: 'पगार', type: 'DEBIT', amount: 24000, notes: 'पगार 2025' },
    { id: 'tx-', accountId: 'acc-3', date: '2025-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 20000, notes: 'MOTOR REPAIR ETC' },
    { id: 'tx-', accountId: 'acc-3', date: '2025-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'PEND' },

    { id: 'tx-', accountId: 'acc-3', date: '2025-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 50000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-5', date: '2025-08-08', title: 'पगार', type: 'DEBIT', amount: 16000, notes: 'पगार 2025 FEB MAR' },
    { id: 'tx-', accountId: 'acc-3', date: '2025-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2025-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-5', date: '2025-08-08', title: 'पगार', type: 'DEBIT', amount: 50000, notes: 'ADV SALARY' },
    { id: 'tx-', accountId: 'acc-3', date: '2025-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 25000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2025-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-3', date: '2025-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 60000, notes: 'COW' },
    { id: 'tx-', accountId: 'acc-3', date: '2025-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 25000, notes: 'COW' },
    { id: 'tx-', accountId: 'acc-3', date: '2025-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 70000, notes: 'COW' },


    { id: 'tx-', accountId: 'acc-3', date: '2025-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-5', date: '2025-08-08', title: 'पगार', type: 'DEBIT', amount: 20000, notes: 'पगार 2025 APR -DEC FROM ADV SALARY' },
    { id: 'tx-', accountId: 'acc-3', date: '2025-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 15000, notes: 'पिकं लागवड, जनावर, कुकुटपालन खर्च' },
    { id: 'tx-', accountId: 'acc-5', date: '2025-08-08', title: 'पगार', type: 'DEBIT', amount: 24000, notes: 'पगार 2026 JAN FEB MAR' },
    { id: 'tx-', accountId: 'acc-3', date: '2025-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10500, notes: 'PEND' },
    { id: 'tx-', accountId: 'acc-5', date: '2025-08-08', title: 'पगार', type: 'DEBIT', amount: 24000, notes: 'पगार 2026 APR MAY JUN' },
    { id: 'tx-', accountId: 'acc-5', date: '2025-08-08', title: 'पगार', type: 'DEBIT', amount: 8000, notes: 'पगार JUL' },
    { id: 'tx-', accountId: 'acc-3', date: '2025-08-08', title: 'पिकं व लागवड खर्च', type: 'DEBIT', amount: 10000, notes: 'PEND MEDICINE SHEVGA' },

  ]);

  /* paid to naseer, rubina etc

  10 9/25 pend
  ** 60 9/25 cow returned money received, some pending..
  **25 9/25 cow sale adv
  20 6/1/26 apr-dec
  15 15/2/26
  24 19/3/26 jan-feb-mar
  10.5 2/4/26 pend
  **30 25/5/26 cow sale
  24 24/6/26 apr-may-jun
  8 7/8/26 july
  10 10/8/26 pend

--------------------------------

  10 fish seed - 3/20
  20 fish seed - jcb 7/20
  50 vit valu - 8/20
  50 bakri shed - 9/20
  20 bakri shed - 9/20
  20 9/20
  20 10/20
  6 12/20
  13 thibak 1/21
  10 cctv pipe, clening seed 2/21

  15 ghevda, pipe, thibak 3/21
  15 mix khat, water connection 3/21
  10 new connection, jcb ghevda, khat 5/21
  30 to naseer 5/21
  10 pokeland 5/21
  16.6 pokeland 5/21
  15 jcb soil for trees 6/21
  30 jcb tractor 6/21
  35 jcb tractor 6/21
  10 mango khat 6/21

  10 to naseer 7/21
  10 to naseer 9/21
  **10+10+10 cash received 9/21**
  50 goat, cow 10/21
  30 to naseer loan 10/21
  10 to naseer 10/21
  25 mango thibak 11/21
  30 to naseer 11/21
  10 maka, cleaning 12/21
  10 to naseer 12/21
  10 to naseer 12/21

  10 to naseer 1/22
  10 to naseer 1/22
  8 to naseer 2/22
  7 2/22
  20 3/22
  8 3/22
  8 4/22
  20 6/22
  25 11/22
  50 12/22
  20 tar , ganna, pole 1/23

  20 3/23
  50 personal 8/23
  20 9/23
  20 11/23
  20 1/24 water tank, cowfeed, machine repair
  10 3/24 misc work, pend
  40 3/24 personal
  50 3/24 borewell, pipe, cable etc
  10 borewell motor, spares etc 3/24
  25 4/24 boreweel rework

  22 72-50 salary aug23-apr24
  10 khet work 5/24
  20 khat n seed 6/24
  20 7/24 vatana perani etc
  24 7/24 may-jun-jul
  24 8/24 adv aug-sep-oct
  50 11/24 shed repair and pend
  24 1/25 nov=dec=jan
  20 1/25 12.5 motor repair, medicine,shed net, sufala etc
  10 3/25 pend

  50 3/25 2 cow 75k, 25 adv
  16 3/25 feb-mar
  10 3/25 gahu, motor repair 3.7, etc
  10 4/25 pend
  50 4/25 adv salary - hand injury -
  25 6/25 old exp, maka perni
  10 7/25
  60 8/25 cattle shed new and repair
  25 8/25 cattle shed
  70 4/9/25 cow buy rubina acct

  */

  // Form State - Add Account
  newAccountName = '';
  newAccountCategory: FarmCategory = 'जनावर व्यवस्थापन';

  // Form State - Add Transaction
  newTxAccountId = '';
  newTxDate = new Date().toISOString().split('T')[0];
  newTxTitle = '';
  newTxType: 'CREDIT' | 'DEBIT' = 'DEBIT';
  newTxAmount: number | null = null;
  newTxNotes = '';

  // Filter State
  selectedCategoryFilter = signal<string>('ALL');

  // --- COMPUTED REPORTS ---

  totalCredit = computed(() =>
    this.transactions()
      .filter(t => t.type === 'CREDIT')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  // 1. Total Capital Introduced by Owner (Equity)
  ownerCapitalInjected = computed(() => {
    return this.transactions()
      .filter(t => {
        const account = this.accounts().find(a => a.id === t.accountId);
        return account?.category === 'मालकाचे भांडवल';
      })
      .reduce((sum, t) => sum + (t.type === 'CREDIT' ? t.amount : -t.amount), 0);
  });

  // 2. Pure Farm Operating Revenue (Excludes Owner Capital)
  totalOperatingRevenue = computed(() => {
    return this.transactions()
      .filter(t => {
        if (t.type !== 'CREDIT') return false;
        const account = this.accounts().find(a => a.id === t.accountId);
        return account?.category !== 'मालकाचे भांडवल';
      })
      .reduce((sum, t) => sum + t.amount, 0);
  });

  // 3. Total Operating Expenses (All Debits excluding drawings)
  totalDebit = computed(() => {
    return this.transactions()
      .filter(t => t.type === 'DEBIT')
      .reduce((sum, t) => sum + t.amount, 0);
  });

  // 4. True Farm Profit / Loss (Revenue minus Expenses)
  netOperatingProfit = computed(() => {
    return this.totalOperatingRevenue() - this.totalDebit();
  });

  // 5. Total Available Liquidity / Net Bank Balance (Profit + Owner Capital)
  totalCashOnHand = computed(() => {
    return this.netOperatingProfit() + this.ownerCapitalInjected();
  });

  netBalance = computed(() => this.totalCredit() - this.totalDebit());

  // Report broken down by each account
  accountReports = computed<AccountReport[]>(() => {
    return this.accounts().map(account => {
      const accTxs = this.transactions().filter(t => t.accountId === account.id);
      const totalCredit = accTxs.filter(t => t.type === 'CREDIT').reduce((s, t) => s + t.amount, 0);
      const totalDebit = accTxs.filter(t => t.type === 'DEBIT').reduce((s, t) => s + t.amount, 0);
      return {
        accountName: account.name,
        category: account.category,
        totalCredit,
        totalDebit,
        netBalance: totalCredit - totalDebit
      };
    });
  });

  filteredTransactions = computed(() => {
    const filter = this.selectedCategoryFilter();
    if (filter === 'ALL') return this.transactions();

    const accountIdsInCategory = this.accounts()
      .filter(a => a.category === filter)
      .map(a => a.id);

    return this.transactions().filter(t => accountIdsInCategory.includes(t.accountId));
  });

  // --- ACTIONS ---

  addAccount() {
    if (!this.newAccountName.trim()) return;
    const account: FarmAccount = {
      id: 'acc-' + Date.now(),
      name: this.newAccountName.trim(),
      category: this.newAccountCategory
    };
    this.accounts.update(list => [...list, account]);
    this.newAccountName = '';
  }

  addTransaction() {
    if (!this.newTxAccountId || !this.newTxTitle || !this.newTxAmount) return;
    const tx: FarmTransaction = {
      id: 'tx-' + Date.now(),
      accountId: this.newTxAccountId,
      date: this.newTxDate,
      title: this.newTxTitle,
      type: this.newTxType,
      amount: Number(this.newTxAmount),
      notes: this.newTxNotes
    };
    this.transactions.update(list => [tx, ...list]);

    // Reset Form
    this.newTxTitle = '';
    this.newTxAmount = null;
    this.newTxNotes = '';
  }

  getAccountName(accountId: string): string {
    return this.accounts().find(a => a.id === accountId)?.name || 'अज्ञात खाते';
  }

  // 1. Operational Income (Excludes Owner Capital)
  operationalCredit = computed(() => {
    const equityAccId = this.accounts().find(a => a.category === 'मालकाचे भांडवल')?.id;
    return this.transactions()
      .filter(t => t.type === 'CREDIT' && t.accountId !== equityAccId)
      .reduce((sum, t) => sum + t.amount, 0);
  });
}