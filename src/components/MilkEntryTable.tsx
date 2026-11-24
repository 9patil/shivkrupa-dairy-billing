import React from 'react';
import { MilkEntry, NumeralSystem } from '../types';
import { formatDisplayNumber, formatDisplayDate } from '../utils/marathiNumerals';
import { Plus, Trash2, Eraser, CalendarPlus, RotateCcw, Sparkles } from 'lucide-react';

interface MilkEntryTableProps {
  entries: MilkEntry[];
  numeralSystem: NumeralSystem;
  farmerName?: string;
  onUpdateFarmerName?: (name: string) => void;
  onUpdateEntry: (id: string, field: 'morningMilk' | 'afternoonMilk' | 'date', val: any) => void;
  onDeleteRow: (id: string) => void;
  onClearRow: (id: string) => void;
  onAddTenDays: () => void;
  onAddSingleRow: () => void;
  onClearAll: () => void;
  onLoadDemo: () => void;
  onAutoFill?: () => void;
}

export const MilkEntryTable: React.FC<MilkEntryTableProps> = ({
  entries,
  numeralSystem,
  farmerName,
  onUpdateFarmerName,
  onUpdateEntry,
  onDeleteRow,
  onClearRow,
  onAddTenDays,
  onAddSingleRow,
  onClearAll,
  onLoadDemo,
  onAutoFill,
}) => {
  const triggerAutoFill = onAutoFill || onLoadDemo;

  const handleInputChange = (
    id: string,
    field: 'morningMilk' | 'afternoonMilk',
    rawValue: string
  ) => {
    // If empty string, reset to empty
    if (rawValue === '') {
      onUpdateEntry(id, field, '');
      return;
    }

    // Allow numbers and decimals freely without locking
    if (/^[0-9]*\.?[0-9]*$/.test(rawValue)) {
      onUpdateEntry(id, field, rawValue);
    }
  };

  const handleInputBlur = (
    id: string,
    field: 'morningMilk' | 'afternoonMilk'
  ) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    const val = entry[field];
    if (typeof val === 'string' && val !== '') {
      const parsed = parseFloat(val);
      if (!isNaN(parsed)) {
        onUpdateEntry(id, field, parsed);
      }
    }
  };

  const handleAdjust = (
    id: string,
    field: 'morningMilk' | 'afternoonMilk',
    delta: number
  ) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;

    const currentVal = entry[field];
    const num =
      typeof currentVal === 'number'
        ? currentVal
        : parseFloat(String(currentVal)) || 0;

    let newVal: number;
    if (currentVal === '' && delta > 0) {
      newVal = field === 'morningMilk' ? 42.0 : 40.0;
    } else {
      newVal = Math.max(0, Math.round((num + delta) * 100) / 100);
    }

    onUpdateEntry(id, field, newVal);
  };

  return (
    <div className="entry-table-container bg-white rounded-2xl shadow-sm border border-dairy-cream-300 overflow-hidden">
      {/* Table Toolbar Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-dairy-navy-950 to-dairy-green-950 text-white flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
            <span>दैनिक दूध संकलन नोंदवही</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-dairy-gold-400 text-slate-950">
              {entries.length} दिवस
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            सकाळ व दुपार दूध नोंदी थेट टाईप करा किंवा ऑटो-फिल करा (सर्व नोंदी पूर्णपणे संपादनक्षम)
          </p>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Smart Dynamic Auto-Fill Button */}
          <button
            type="button"
            onClick={triggerAutoFill}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-dairy-gold-400 to-amber-400 hover:from-amber-600 hover:to-dairy-gold-500 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/20 transition-all active:scale-95 border border-amber-300"
            title="१० दिवसांचा वास्तववादी डेटा ऑटो-फिल करा (प्रत्येक क्लिकवर नवीन संख्या)"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>ऑटो-फिल (१० दिवस भरा)</span>
          </button>

          <button
            type="button"
            onClick={onAddTenDays}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dairy-green-800 hover:bg-dairy-green-700 text-emerald-100 text-xs font-semibold border border-dairy-green-600 shadow-sm transition-colors"
            title="पुढील १० दिवसांच्या नोंदी जोडा"
          >
            <CalendarPlus className="w-4 h-4 text-dairy-gold-400" />
            <span>+१० दिवस जोडा</span>
          </button>

          <button
            type="button"
            onClick={onAddSingleRow}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            title="१ दिवस नोंद जोडा"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+१ दिवस</span>
          </button>

          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-medium border border-red-800 transition-colors"
            title="सर्व नोंदी साफ करा"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>साफ करा</span>
          </button>
        </div>
      </div>

      {/* Quick Farmer / Producer Details Bar (Editable per slip) */}
      <div className="px-5 py-2.5 bg-emerald-50/80 border-b border-emerald-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <span className="font-bold text-emerald-950 flex items-center gap-1">
            <span>👤 दूध उत्पादक / शेतकरी नाव (ऐच्छिक):</span>
          </span>
          <input
            type="text"
            value={farmerName || ''}
            onChange={(e) => onUpdateFarmerName?.(e.target.value)}
            placeholder="उदा. श्री. उमाकांत हिम्मतराव जाधव (किंवा रिकामे सोडा)"
            className="px-3 py-1 bg-white border border-emerald-300 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-dairy-green-600 focus:outline-none flex-1 max-w-sm text-xs shadow-sm"
          />
        </div>
        <div className="text-slate-500 text-[11px]">
          * ही पावती कोणाच्या नावावर आहे ते येथे बदला किंवा रिकामे ठेवा.
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-dairy-green-950/5 text-dairy-green-950 border-b-2 border-dairy-green-900/20 font-bold text-xs sm:text-sm">
              <th className="py-3 px-3 text-center w-12 sm:w-16">क्र.</th>
              <th className="py-3 px-4 min-w-[130px]">दिनांक</th>
              <th className="py-3 px-4 min-w-[150px]">सकाळ (लिटर)</th>
              <th className="py-3 px-4 min-w-[150px]">दुपार (लिटर)</th>
              <th className="py-3 px-4 min-w-[140px] text-right">एकूण दूध (लिटर)</th>
              <th className="py-3 px-3 text-center w-24">कृती</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-500">
                  <p className="text-base font-semibold">कोणत्याही नोंदी उपलब्ध नाहीत.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    वर दिलेल्या &quot;ऑटो-फिल (१० दिवस भरा)&quot; किंवा &quot;+१० दिवस जोडा&quot; बटनावर क्लिक करा.
                  </p>
                </td>
              </tr>
            ) : (
              entries.map((entry, idx) => {
                return (
                  <tr
                    key={entry.id}
                    className={`hover:bg-dairy-cream-50/80 transition-colors ${
                      idx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                    }`}
                  >
                    {/* Serial Number */}
                    <td className="py-2.5 px-3 text-center font-bold text-slate-600">
                      {formatDisplayNumber(entry.srNo, numeralSystem)}
                    </td>

                    {/* Date Picker / Display */}
                    <td className="py-2.5 px-4 font-medium text-slate-800">
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={entry.date}
                          onChange={(e) => onUpdateEntry(entry.id, 'date', e.target.value)}
                          className="px-2 py-1 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-dairy-green-600 focus:outline-none bg-white text-slate-800 font-medium"
                        />
                        <span className="text-xs text-slate-500 hidden sm:inline">
                          ({formatDisplayDate(entry.date, numeralSystem)})
                        </span>
                      </div>
                    </td>

                    {/* Morning Milk Input with Stepper (+/-) */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center rounded-lg border border-slate-300 focus-within:ring-2 focus-within:ring-dairy-green-600 focus-within:border-dairy-green-600 overflow-hidden bg-white shadow-sm transition-all hover:border-slate-400">
                        <button
                          type="button"
                          onClick={() => handleAdjust(entry.id, 'morningMilk', -0.5)}
                          className="px-2 sm:px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm transition-colors select-none shrink-0"
                          title="०.५० ने कमी करा"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          step="any"
                          placeholder="0.00"
                          value={entry.morningMilk}
                          onChange={(e) =>
                            handleInputChange(entry.id, 'morningMilk', e.target.value)
                          }
                          onBlur={() => handleInputBlur(entry.id, 'morningMilk')}
                          className="w-full text-center px-1 py-1.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none bg-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => handleAdjust(entry.id, 'morningMilk', +0.5)}
                          className="px-2 sm:px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm transition-colors select-none shrink-0"
                          title="०.५० ने वाढवा"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Afternoon Milk Input with Stepper (+/-) */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center rounded-lg border border-slate-300 focus-within:ring-2 focus-within:ring-dairy-green-600 focus-within:border-dairy-green-600 overflow-hidden bg-white shadow-sm transition-all hover:border-slate-400">
                        <button
                          type="button"
                          onClick={() => handleAdjust(entry.id, 'afternoonMilk', -0.5)}
                          className="px-2 sm:px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm transition-colors select-none shrink-0"
                          title="०.५० ने कमी करा"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          step="any"
                          placeholder="0.00"
                          value={entry.afternoonMilk}
                          onChange={(e) =>
                            handleInputChange(entry.id, 'afternoonMilk', e.target.value)
                          }
                          onBlur={() => handleInputBlur(entry.id, 'afternoonMilk')}
                          className="w-full text-center px-1 py-1.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none bg-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => handleAdjust(entry.id, 'afternoonMilk', +0.5)}
                          className="px-2 sm:px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm transition-colors select-none shrink-0"
                          title="०.५० ने वाढवा"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Total Milk (Calculated) */}
                    <td className="py-2.5 px-4 text-right">
                      <span className="inline-block px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 font-extrabold text-sm sm:text-base tracking-tight">
                        {formatDisplayNumber(entry.totalMilk, numeralSystem, { decimals: 2 })}
                        <span className="text-xs font-normal text-emerald-700 ml-1">लि.</span>
                      </span>
                    </td>

                    {/* Row Actions */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onClearRow(entry.id)}
                          className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                          title="या दिवसाचे दूध रिकामे करा"
                        >
                          <Eraser className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteRow(entry.id)}
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="हा दिवस हटवा"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {/* Table Footer with Summary Row */}
          {entries.length > 0 && (
            <tfoot>
              <tr className="bg-slate-900 text-white font-bold text-sm">
                <td colSpan={2} className="py-3 px-4 text-right tracking-wide">
                  एकूण बेरीज (Grand Total):
                </td>
                <td className="py-3 px-4 text-amber-300">
                  {formatDisplayNumber(
                    entries.reduce(
                      (acc, curr) =>
                        acc +
                        (typeof curr.morningMilk === 'number'
                          ? curr.morningMilk
                          : parseFloat(String(curr.morningMilk)) || 0),
                      0
                    ),
                    numeralSystem,
                    { decimals: 2 }
                  )} लि.
                </td>
                <td className="py-3 px-4 text-amber-300">
                  {formatDisplayNumber(
                    entries.reduce(
                      (acc, curr) =>
                        acc +
                        (typeof curr.afternoonMilk === 'number'
                          ? curr.afternoonMilk
                          : parseFloat(String(curr.afternoonMilk)) || 0),
                      0
                    ),
                    numeralSystem,
                    { decimals: 2 }
                  )} लि.
                </td>
                <td className="py-3 px-4 text-right text-emerald-300 text-base">
                  {formatDisplayNumber(
                    entries.reduce((acc, curr) => acc + curr.totalMilk, 0),
                    numeralSystem,
                    { decimals: 2 }
                  )} लि.
                </td>
                <td className="py-3 px-3"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
