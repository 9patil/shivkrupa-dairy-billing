export interface MilkEntry {
  id: string;
  srNo: number;
  date: string; // YYYY-MM-DD
  morningMilk: number | '' | string;
  afternoonMilk: number | '' | string;
  totalMilk: number;
}

export interface DairySettings {
  headerShloka: string;
  dairyName: string;
  location: string;
  ownerName: string;
  milkRate: number;
  fromDate: string;
  toDate: string;
  receiptNo: string;
  farmerName?: string;
  farmerCode?: string;
  notes?: string;
}

export interface BillingSummaryData {
  totalMorningMilk: number;
  totalAfternoonMilk: number;
  grandTotalMilk: number;
  milkRate: number;
  totalPayableAmount: number;
  amountInWords: string;
}

export interface SavedBill {
  id: string;
  savedAt: string; // ISO string
  receiptNo: string;
  fromDate: string;
  toDate: string;
  settings: DairySettings;
  entries: MilkEntry[];
  summary: BillingSummaryData;
  farmerName?: string;
}

export type NumeralSystem = 'mr' | 'en'; // Marathi (०-९) or English (0-9)
