import React, { useState, useEffect } from 'react';
import { MilkEntry, DairySettings, NumeralSystem, SavedBill } from './types';
import {
  DEFAULT_SETTINGS,
  calculateBillingSummary,
  generateDatesList,
  appendTenDays,
  generateDemoEntries,
  generateSmartAutoFillEntries,
  formatDateISO,
} from './utils/calculations';
import {
  saveDraft,
  loadDraft,
  getSavedBills,
  saveBillToHistory,
  deleteSavedBill,
  exportToCSV,
  exportBackupJSON,
} from './utils/storage';
import { Header } from './components/Header';
import { BillingSummary } from './components/BillingSummary';
import { MilkEntryTable } from './components/MilkEntryTable';
import { SettingsModal } from './components/SettingsModal';
import { ReceiptPreviewModal } from './components/ReceiptPreviewModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { OfficialReceipt } from './components/OfficialReceipt';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertCircle, Info, Heart } from 'lucide-react';

export const App: React.FC = () => {
  // Initialize state from LocalStorage or defaults
  const [settings, setSettings] = useState<DairySettings>(() => {
    const draft = loadDraft();
    if (draft.settings) {
      const s = { ...draft.settings };
      if (s.ownerName === 'श्री. उमाकांत हिम्मतराव जाधव') {
        s.ownerName = 'श्री. चंद्रकांत जिजाबराव पाटील';
      }
      if (s.farmerName === 'श्री. रमेश तुकाराम पाटील') {
        s.farmerName = 'श्री. उमाकांत हिम्मतराव जाधव';
      }
      if (s.dairyName === 'शिवकृपा दूध संकलन ग्रुप नांदगांव') {
        s.dairyName = 'शिवकृपा दूध संकलन ग्रुप';
      }
      return s;
    }
    return DEFAULT_SETTINGS;
  });

  const [numeralSystem, setNumeralSystem] = useState<NumeralSystem>(() => {
    const draft = loadDraft();
    return draft.numeralSystem || 'mr';
  });

  const [entries, setEntries] = useState<MilkEntry[]>(() => {
    const draft = loadDraft();
    if (draft.entries && draft.entries.length > 0) {
      return draft.entries;
    }
    return generateDatesList(DEFAULT_SETTINGS.fromDate, 10);
  });

  const [savedBills, setSavedBills] = useState<SavedBill[]>(() => getSavedBills());

  // Modals & Drawers state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isBillSaved, setIsBillSaved] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Real-time calculation summary
  const summary = calculateBillingSummary(entries, settings.milkRate);

  // Auto-save draft to LocalStorage whenever changes happen
  useEffect(() => {
    saveDraft(settings, entries, numeralSystem);
    setIsBillSaved(false);
  }, [settings, entries, numeralSystem]);

  // Numeral toggle handler
  const handleToggleNumerals = () => {
    setNumeralSystem(prev => {
      const next = prev === 'mr' ? 'en' : 'mr';
      showToast(
        next === 'mr' ? 'मराठी अंक (०-९) सक्रिय केले' : 'English Numbers (0-9) activated',
        'info'
      );
      return next;
    });
  };

  // Entry Update Handler
  const handleUpdateEntry = (id: string, field: 'morningMilk' | 'afternoonMilk' | 'date', val: any) => {
    setEntries(prev =>
      prev.map(item => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: val };
        // Recalculate row total with safe parsing
        const parseVal = (v: any): number => {
          if (typeof v === 'number') return v;
          const parsed = parseFloat(String(v));
          return isNaN(parsed) ? 0 : parsed;
        };
        const m = parseVal(updated.morningMilk);
        const a = parseVal(updated.afternoonMilk);
        updated.totalMilk = Math.round((m + a) * 100) / 100;
        return updated;
      })
    );
  };

  // Delete Row
  const handleDeleteRow = (id: string) => {
    setEntries(prev => {
      const filtered = prev.filter(e => e.id !== id);
      return filtered.map((e, idx) => ({ ...e, srNo: idx + 1 }));
    });
    showToast('नोंद यशस्वीरित्या हटवली.', 'info');
  };

  // Clear Row
  const handleClearRow = (id: string) => {
    setEntries(prev =>
      prev.map(e => {
        if (e.id !== id) return e;
        return {
          ...e,
          morningMilk: '',
          afternoonMilk: '',
          totalMilk: 0,
        };
      })
    );
    showToast('नोंद साफ केली.', 'info');
  };

  // Add 10 Days
  const handleAddTenDays = () => {
    setEntries(prev => appendTenDays(prev));
    showToast('पुढील १० दिवस जोडले!', 'success');
  };

  // Add Single Row
  const handleAddSingleRow = () => {
    setEntries(prev => {
      let nextDate = new Date();
      if (prev.length > 0) {
        const last = new Date(prev[prev.length - 1].date);
        last.setDate(last.getDate() + 1);
        nextDate = last;
      }
      const newEntry: MilkEntry = {
        id: `entry-${formatDateISO(nextDate)}-${Math.random().toString(36).substring(2, 6)}`,
        srNo: prev.length + 1,
        date: formatDateISO(nextDate),
        morningMilk: '',
        afternoonMilk: '',
        totalMilk: 0,
      };
      return [...prev, newEntry];
    });
    showToast('१ नवीन दिवस जोडला.', 'success');
  };

  // Clear All Entries
  const handleClearAll = () => {
    if (window.confirm('तुम्हाला खरोखर सर्व चालू नोंदी साफ करायच्या आहेत का?')) {
      const resetEntries = generateDatesList(settings.fromDate, 10);
      setEntries(resetEntries);
      showToast('सर्व नोंदी रिकाम्या केल्या.', 'warn');
    }
  };

  // Smart Dynamic Auto-Fill Handler (Unique variations on each click)
  const handleAutoFill = () => {
    const fresh = generateSmartAutoFillEntries(settings.fromDate, entries);
    setEntries(fresh);
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
    });
    showToast('१० दिवस वास्तववादी डेटाने ऑटो-फिल केले! (तुम्ही संख्या सहज बदलू शकता)', 'success');
  };

  // Apply new date range from settings
  const handleApplyDateRange = (from: string, _to: string) => {
    setEntries(prev => generateDatesList(from, 10, prev));
  };

  // Save current bill to history
  const handleSaveBill = () => {
    const newBill: SavedBill = {
      id: `bill-${Date.now()}`,
      savedAt: new Date().toISOString(),
      receiptNo: settings.receiptNo,
      fromDate: settings.fromDate,
      toDate: settings.toDate,
      settings: { ...settings },
      entries: [...entries],
      summary: { ...summary },
      farmerName: settings.farmerName,
    };

    const updated = saveBillToHistory(newBill);
    setSavedBills(updated);
    setIsBillSaved(true);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.5 },
    });

    showToast(`बिल ${settings.receiptNo} इतिहासामध्ये सुरक्षित सेव्ह केले!`, 'success');
  };

  // Delete saved bill from history
  const handleDeleteSavedBill = (id: string) => {
    const updated = deleteSavedBill(id);
    setSavedBills(updated);
    showToast('बिल इतिहासामधून हटवले.', 'info');
  };

  // Load historical bill into current draft
  const handleLoadSavedBill = (bill: SavedBill) => {
    if (
      window.confirm(
        `पावती क्र. ${bill.receiptNo} डॅशबोर्डवर लोड करायची आहे का? (चालू असणारे बदल बदलले जातील)`
      )
    ) {
      setSettings(bill.settings);
      setEntries(bill.entries);
      showToast(`पावती ${bill.receiptNo} डॅशबोर्डवर लोड केली.`, 'success');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    exportToCSV(entries, settings, summary);
    showToast('CSV फाईल डाउनलोड झाली!', 'success');
  };

  // Export JSON Backup
  const handleExportJSONBackup = () => {
    exportBackupJSON(settings, entries, savedBills);
    showToast('संपूर्ण JSON बॅकअप डाउनलोड झाला!', 'success');
  };

  // Import JSON Backup
  const handleImportBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.settings) setSettings(json.settings);
        if (json.entries) setEntries(json.entries);
        if (json.history) {
          localStorage.setItem('shivkrupa_dairy_history', JSON.stringify(json.history));
          setSavedBills(json.history);
        }
        showToast('बॅकअप यशस्वीरित्या रिस्टोर झाला!', 'success');
      } catch (err) {
        console.error('Backup import error:', err);
        showToast('अवैध बॅकअप फाईल. कृपया तपासा.', 'warn');
      }
    };
    reader.readAsText(file);
  };

  // Clear all history
  const handleClearAllHistory = () => {
    if (window.confirm('तुम्हाला खरोखर सर्व जुनी सेव्ह केलेली बिले कायमची हटवायची आहेत का?')) {
      localStorage.removeItem('shivkrupa_dairy_history');
      setSavedBills([]);
      showToast('इतिहास पूर्णपणे साफ केला.', 'warn');
    }
  };

  return (
    <div className="min-h-screen bg-dairy-cream-100 flex flex-col selection:bg-dairy-gold-200">
      {/* Toast Notification Container */}
      {toast && (
        <div className="no-print fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold transition-all animate-bounce">
          {toast.type === 'success' && (
            <div className="flex items-center gap-2 bg-emerald-900 text-white border-emerald-500 px-4 py-2 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{toast.message}</span>
            </div>
          )}
          {toast.type === 'info' && (
            <div className="flex items-center gap-2 bg-slate-900 text-white border-cyan-500 px-4 py-2 rounded-xl">
              <Info className="w-5 h-5 text-cyan-400" />
              <span>{toast.message}</span>
            </div>
          )}
          {toast.type === 'warn' && (
            <div className="flex items-center gap-2 bg-amber-900 text-white border-amber-500 px-4 py-2 rounded-xl">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span>{toast.message}</span>
            </div>
          )}
        </div>
      )}

      {/* Branded Official Header */}
      <Header
        settings={settings}
        numeralSystem={numeralSystem}
        onToggleNumerals={handleToggleNumerals}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onLoadDemo={handleAutoFill}
        onOpenPreview={() => setIsPreviewOpen(true)}
        historyCount={savedBills.length}
      />

      {/* Main Content Area */}
      <main className="app-main flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Real-time Calculation Summary Cards */}
        <BillingSummary
          summary={summary}
          numeralSystem={numeralSystem}
          onOpenReceipt={() => setIsPreviewOpen(true)}
          onSaveBill={handleSaveBill}
          isSaved={isBillSaved}
        />

        {/* Daily Milk Collection Entry Table */}
        <MilkEntryTable
          entries={entries}
          numeralSystem={numeralSystem}
          farmerName={settings.farmerName}
          onUpdateFarmerName={(name) => setSettings(prev => ({ ...prev, farmerName: name }))}
          onUpdateEntry={handleUpdateEntry}
          onDeleteRow={handleDeleteRow}
          onClearRow={handleClearRow}
          onAddTenDays={handleAddTenDays}
          onAddSingleRow={handleAddSingleRow}
          onClearAll={handleClearAll}
          onLoadDemo={handleAutoFill}
          onAutoFill={handleAutoFill}
        />
      </main>

      {/* Modals & Drawers */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentSettings={settings}
        onSave={(newSettings) => {
          setSettings(newSettings);
          showToast('डेअरी व बिलिंग सेटिंग्ज अद्ययावत केल्या!', 'success');
        }}
        onApplyDateRange={handleApplyDateRange}
      />

      <ReceiptPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        settings={settings}
        entries={entries}
        summary={summary}
        numeralSystem={numeralSystem}
        onToggleNumerals={handleToggleNumerals}
        onSaveBill={handleSaveBill}
        isSaved={isBillSaved}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedBills={savedBills}
        numeralSystem={numeralSystem}
        onLoadBill={handleLoadSavedBill}
        onDeleteBill={handleDeleteSavedBill}
        onExportCSV={handleExportCSV}
        onExportJSONBackup={handleExportJSONBackup}
        onImportBackup={handleImportBackup}
        onClearAllHistory={handleClearAllHistory}
      />

      {/* Footer */}
      <footer className="app-footer bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">
              {settings.dairyName}
            </span>
            <span>•</span>
            <span>{settings.location}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>स्मार्ट दूध संकलन व स्वयंचलित बिलिंग प्रणाली</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-dairy-gold-400 font-medium">
              महाराष्ट्र <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
