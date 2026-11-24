import { MilkEntry, BillingSummaryData, DairySettings } from '../types';
import { amountToMarathiWords } from './marathiNumerals';

export const MORNING_RANGE = { min: 35, max: 49 };
export const AFTERNOON_RANGE = { min: 38, max: 45 };

/**
 * Checks if a given morning milk quantity is within standard suggested range.
 */
export function checkMorningRange(val: number | ''): { isOutOfRange: boolean; message?: string; type?: 'low' | 'high' } {
  if (val === '' || isNaN(Number(val))) return { isOutOfRange: false };
  const num = Number(val);
  if (num < MORNING_RANGE.min) {
    return { isOutOfRange: true, message: `सकाळचे दूध सरासरीपेक्षा कमी आहे (${MORNING_RANGE.min}-${MORNING_RANGE.max} लि.)`, type: 'low' };
  }
  if (num > MORNING_RANGE.max) {
    return { isOutOfRange: true, message: `सकाळचे दूध सरासरीपेक्षा जास्त आहे (${MORNING_RANGE.min}-${MORNING_RANGE.max} लि.)`, type: 'high' };
  }
  return { isOutOfRange: false };
}

/**
 * Checks if a given afternoon milk quantity is within standard suggested range.
 */
export function checkAfternoonRange(val: number | ''): { isOutOfRange: boolean; message?: string; type?: 'low' | 'high' } {
  if (val === '' || isNaN(Number(val))) return { isOutOfRange: false };
  const num = Number(val);
  if (num < AFTERNOON_RANGE.min) {
    return { isOutOfRange: true, message: `दुपारचे दूध सरासरीपेक्षा कमी आहे (${AFTERNOON_RANGE.min}-${AFTERNOON_RANGE.max} लि.)`, type: 'low' };
  }
  if (num > AFTERNOON_RANGE.max) {
    return { isOutOfRange: true, message: `दुपारचे दूध सरासरीपेक्षा जास्त आहे (${AFTERNOON_RANGE.min}-${AFTERNOON_RANGE.max} लि.)`, type: 'high' };
  }
  return { isOutOfRange: false };
}

/**
 * Calculates sum of morning, afternoon, grand total, and payable amount.
 */
export function calculateBillingSummary(entries: MilkEntry[], milkRate: number): BillingSummaryData {
  let totalMorning = 0;
  let totalAfternoon = 0;

  const parseVal = (v: any): number => {
    if (typeof v === 'number') return v;
    const parsed = parseFloat(String(v));
    return isNaN(parsed) ? 0 : parsed;
  };

  entries.forEach((entry) => {
    totalMorning += parseVal(entry.morningMilk);
    totalAfternoon += parseVal(entry.afternoonMilk);
  });

  // Precision rounding to 2 decimals
  totalMorning = Math.round(totalMorning * 100) / 100;
  totalAfternoon = Math.round(totalAfternoon * 100) / 100;
  const grandTotal = Math.round((totalMorning + totalAfternoon) * 100) / 100;
  const payable = Math.round(grandTotal * milkRate * 100) / 100;

  return {
    totalMorningMilk: totalMorning,
    totalAfternoonMilk: totalAfternoon,
    grandTotalMilk: grandTotal,
    milkRate,
    totalPayableAmount: payable,
    amountInWords: amountToMarathiWords(payable),
  };
}

/**
 * Formats a Date object to YYYY-MM-DD
 */
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Generates an array of 10 consecutive date entries starting from a given date.
 */
export function generateDatesList(fromDateStr: string, count = 10, existingEntries: MilkEntry[] = []): MilkEntry[] {
  const startDate = fromDateStr ? new Date(fromDateStr) : new Date();
  const existingMap = new Map<string, MilkEntry>();
  existingEntries.forEach(e => existingMap.set(e.date, e));

  const result: MilkEntry[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = formatDateISO(d);

    const existing = existingMap.get(dateStr);
    if (existing) {
      result.push({
        ...existing,
        srNo: i + 1,
      });
    } else {
      result.push({
        id: `entry-${dateStr}-${Math.random().toString(36).substring(2, 7)}`,
        srNo: i + 1,
        date: dateStr,
        morningMilk: '',
        afternoonMilk: '',
        totalMilk: 0,
      });
    }
  }
  return result;
}

/**
 * Adds next 10 days to the existing entries.
 */
export function appendTenDays(currentEntries: MilkEntry[]): MilkEntry[] {
  let startDate = new Date();
  if (currentEntries.length > 0) {
    const lastDateStr = currentEntries[currentEntries.length - 1].date;
    const lastDate = new Date(lastDateStr);
    lastDate.setDate(lastDate.getDate() + 1);
    startDate = lastDate;
  }

  const existingDates = new Set(currentEntries.map(e => e.date));
  const newEntries: MilkEntry[] = [...currentEntries];

  for (let i = 0; i < 10; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = formatDateISO(d);

    if (!existingDates.has(dateStr)) {
      existingDates.add(dateStr);
      newEntries.push({
        id: `entry-${dateStr}-${Math.random().toString(36).substring(2, 7)}`,
        srNo: newEntries.length + 1,
        date: dateStr,
        morningMilk: '',
        afternoonMilk: '',
        totalMilk: 0,
      });
    }
  }

  return newEntries.map((e, idx) => ({ ...e, srNo: idx + 1 }));
}

/**
 * Generates a realistic random milk quantity in a given range.
 * Natural dairy variations with decimals like .00, .50 (and occasionally .25, .75).
 */
export function generateRandomMilk(min: number, max: number, baseline?: number): number {
  // If baseline is provided, drift around baseline (+/- 2.5) while staying within [min, max]
  const target = baseline !== undefined
    ? Math.max(min, Math.min(max, baseline + (Math.random() * 5.0 - 2.5)))
    : min + Math.random() * (max - min);

  // Pick realistic dairy fraction: .00, .50, .25, .75
  const rand = Math.random();
  let fraction = 0;
  if (rand < 0.45) {
    fraction = 0.0;
  } else if (rand < 0.90) {
    fraction = 0.5;
  } else {
    fraction = Math.random() < 0.5 ? 0.25 : 0.75;
  }

  let val = Math.floor(target) + fraction;
  // Keep strictly within boundaries
  if (val < min) val = Math.ceil(min);
  if (val > max) val = Math.floor(max) + (max % 1 >= 0.5 ? 0.5 : 0.0);

  return Math.round(val * 100) / 100;
}

/**
 * Smart Auto-Fill: Generates natural, dynamic variations on each click (never static or repeated values).
 * - Morning (सकाळ): dynamic random values between ~35.00 and ~48.50 with varied decimals (.00, .50)
 * - Afternoon (दुपार): dynamic random values between ~38.00 and ~45.00
 * Populates current entries (or generates 10 entries if empty).
 */
export function generateSmartAutoFillEntries(
  fromDateStr: string,
  existingEntries: MilkEntry[] = []
): MilkEntry[] {
  const count = existingEntries.length > 0 ? existingEntries.length : 10;
  const startDate = fromDateStr ? new Date(fromDateStr) : new Date();

  // Fresh herd baselines randomized on each invocation
  const morningBaseline = 37.0 + Math.random() * 8.5; // ~37.0 to ~45.5
  const afternoonBaseline = 39.0 + Math.random() * 4.5; // ~39.0 to ~43.5

  const result: MilkEntry[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = existingEntries[i]?.date || formatDateISO(d);
    const id = existingEntries[i]?.id || `entry-${dateStr}-${Math.random().toString(36).substring(2, 7)}`;

    const morning = generateRandomMilk(35.0, 48.5, morningBaseline);
    const afternoon = generateRandomMilk(38.0, 45.0, afternoonBaseline);
    const total = Math.round((morning + afternoon) * 100) / 100;

    result.push({
      id,
      srNo: i + 1,
      date: dateStr,
      morningMilk: morning,
      afternoonMilk: afternoon,
      totalMilk: total,
    });
  }

  return result;
}

/**
 * Backward compatibility: generateDemoEntries calls dynamic generateSmartAutoFillEntries.
 */
export function generateDemoEntries(fromDateStr: string, existingEntries: MilkEntry[] = []): MilkEntry[] {
  return generateSmartAutoFillEntries(fromDateStr, existingEntries);
}

/**
 * Calculates default 10-day date range starting from 1st or 11th or 21st of current month, or past 10 days
 */
export function getDefaultBillingPeriod(): { fromDate: string; toDate: string } {
  const now = new Date();
  const day = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth();

  let startDay = 1;
  let endDay = 10;

  if (day > 20) {
    startDay = 21;
    // End of month
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    endDay = lastDayOfMonth;
  } else if (day > 10) {
    startDay = 11;
    endDay = 20;
  }

  const from = new Date(year, month, startDay);
  const to = new Date(year, month, endDay);

  return {
    fromDate: formatDateISO(from),
    toDate: formatDateISO(to),
  };
}

export const DEFAULT_SETTINGS: DairySettings = {
  headerShloka: '॥ श्री गणेशाय नमः ॥',
  dairyName: 'शिवकृपा दूध संकलन ग्रुप',
  location: 'नांदगांव, ता. जि. जळगांव',
  ownerName: 'श्री. चंद्रकांत जिजाबराव पाटील',
  milkRate: 60,
  fromDate: getDefaultBillingPeriod().fromDate,
  toDate: getDefaultBillingPeriod().toDate,
  receiptNo: `SK-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-001`,
  farmerName: 'श्री. उमाकांत हिम्मतराव जाधव',
  farmerCode: '१४२',
  notes: 'दूध संकलन वेळेवर व दर्जेदार आणल्याबद्दल धन्यवाद!',
};
