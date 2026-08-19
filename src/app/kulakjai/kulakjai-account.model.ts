export type TransactionType = 'CREDIT' | 'DEBIT';

export type FarmCategory =
    | 'जनावर व्यवस्थापन'
    | 'कुक्कुटपालन'
    | 'पिके व बियाणे'
    | 'पायाभूत सुविधा व शेड'
    | 'मजुरी व कामे'
    | 'उपकरणे व देखभाल'
    | 'मालकाचे भांडवल'
    | 'इतर खर्च';

export interface FarmAccount {
    id: string;
    name: string; // e.g., "Dairy Cow Buy/Sale", "Tomato Crop 2026", "Shed Construction"
    category: FarmCategory;
    description?: string;
}

export interface FarmTransaction {
    id: string;
    accountId: string;
    date: string;
    title: string;
    type: TransactionType; // CREDIT = Income/Sale | DEBIT = Expense/Cost
    amount: number;
    notes?: string;
}

export interface AccountReport {
    accountName: string;
    category: FarmCategory;
    totalCredit: number; // Income
    totalDebit: number;  // Expense
    netBalance: number;  // Credit - Debit
}