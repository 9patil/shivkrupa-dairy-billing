import { MilkEntry, DairySettings, SavedBill, BillingSummaryData, NumeralSystem } from '../types';

const SETTINGS_KEY = 'shivkrupa_dairy_settings';
const ENTRIES_KEY = 'shivkrupa_dairy_entries';
const HISTORY_KEY = 'shivkrupa_dairy_history';
const NUMERAL_KEY = 'shivkrupa_dairy_numeral';

/**
 * Saves current draft to LocalStorage
 */
export function saveDraft(settings: DairySettings, entries: MilkEntry[], numeralSystem: NumeralSystem): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
    localStorage.setItem(NUMERAL_KEY, numeralSystem);
  } catch (err) {
    console.error('Failed to save draft to LocalStorage:', err);
  }
}

/**
 * Loads current draft from LocalStorage
 */
export function loadDraft(): {
  settings: DairySettings | null;
  entries: MilkEntry[] | null;
  numeralSystem: NumeralSystem;
} {
  try {
    const settingsStr = localStorage.getItem(SETTINGS_KEY);
    const entriesStr = localStorage.getItem(ENTRIES_KEY);
    const numeral = (localStorage.getItem(NUMERAL_KEY) as NumeralSystem) || 'mr';

    return {
      settings: settingsStr ? JSON.parse(settingsStr) : null,
      entries: entriesStr ? JSON.parse(entriesStr) : null,
      numeralSystem: numeral === 'en' ? 'en' : 'mr',
    };
  } catch (err) {
    console.error('Failed to load draft from LocalStorage:', err);
    return { settings: null, entries: null, numeralSystem: 'mr' };
  }
}

/**
 * Retrieves all saved historical bills
 */
export function getSavedBills(): SavedBill[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read history from LocalStorage:', err);
    return [];
  }
}

/**
 * Saves a completed bill to history
 */
export function saveBillToHistory(bill: SavedBill): SavedBill[] {
  try {
    const history = getSavedBills();
    // Prepend new bill
    const updated = [bill, ...history.filter(b => b.id !== bill.id)];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save bill to history:', err);
    return getSavedBills();
  }
}

/**
 * Deletes a bill from history
 */
export function deleteSavedBill(id: string): SavedBill[] {
  try {
    const history = getSavedBills();
    const updated = history.filter(b => b.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete saved bill:', err);
    return getSavedBills();
  }
}

/**
 * Clears current draft from LocalStorage
 */
export function clearDraftStorage(): void {
  try {
    localStorage.removeItem(ENTRIES_KEY);
  } catch (err) {
    console.error('Failed to clear draft storage:', err);
  }
}

/**
 * Exports milk collection entries and summary to a CSV file
 */
export function exportToCSV(
  entries: MilkEntry[],
  settings: DairySettings,
  summary: BillingSummaryData
): void {
  const lines: string[] = [];

  // Header info
  lines.push(`"${settings.dairyName}"`);
  lines.push(`"${settings.location}"`);
  lines.push(`"संकलक: ${settings.ownerName}"`);
  lines.push(`"पावती क्र: ${settings.receiptNo}","कालावधी: ${settings.fromDate} ते ${settings.toDate}"`);
  lines.push(`"दूध उत्पादक: ${settings.farmerName || ''}"`);
  lines.push('');

  // Table header
  lines.push('"क्र.","दिनांक","सकाळ (लिटर)","दुपार (लिटर)","एकूण दूध (लिटर)"');

  // Entries
  entries.forEach((e) => {
    const morning = e.morningMilk === '' ? '0' : e.morningMilk;
    const afternoon = e.afternoonMilk === '' ? '0' : e.afternoonMilk;
    lines.push(`"${e.srNo}","${e.date}","${morning}","${afternoon}","${e.totalMilk}"`);
  });

  lines.push('');
  // Summary
  lines.push(`"सकाळ एकूण","","","","${summary.totalMorningMilk} लिटर"`);
  lines.push(`"दुपार एकूण","","","","${summary.totalAfternoonMilk} लिटर"`);
  lines.push(`"एकूण दूध (Grand Total)","","","","${summary.grandTotalMilk} लिटर"`);
  lines.push(`"दूध दर प्रति लिटर","","","","₹ ${summary.milkRate}"`);
  lines.push(`"एकूण रक्कम","","","","₹ ${summary.totalPayableAmount}"`);
  lines.push(`"अक्षरी रक्कम","${summary.amountInWords}"`);

  const csvContent = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `दूध_बिल_${settings.receiptNo}_${settings.fromDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports complete backup JSON
 */
export function exportBackupJSON(
  settings: DairySettings,
  entries: MilkEntry[],
  history: SavedBill[]
): void {
  const data = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    settings,
    entries,
    history,
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `शिवकृपा_दूध_बॅकअप_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
