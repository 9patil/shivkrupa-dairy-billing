import React from 'react';
import { BillingSummaryData, NumeralSystem } from '../types';
import { formatDisplayNumber, formatCurrency } from '../utils/marathiNumerals';
import { Sun, Sunset, Droplets, IndianRupee, Wallet, CheckCircle } from 'lucide-react';

interface BillingSummaryProps {
  summary: BillingSummaryData;
  numeralSystem: NumeralSystem;
  onOpenReceipt: () => void;
  onSaveBill: () => void;
  isSaved?: boolean;
}

export const BillingSummary: React.FC<BillingSummaryProps> = ({
  summary,
  numeralSystem,
  onOpenReceipt,
  onSaveBill,
  isSaved,
}) => {
  return (
    <div className="billing-cards-grid space-y-4">
      {/* 5-Column Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Morning Total */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-200/80 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full pointer-events-none -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500" />
              सकाळ एकूण
            </span>
            <span className="text-[11px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full font-medium">
              Morning
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              {formatDisplayNumber(summary.totalMorningMilk, numeralSystem, { decimals: 2 })}
              <span className="text-xs font-normal text-slate-500 ml-1">लिटर</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">सकाळचे एकूण दूध</p>
          </div>
        </div>

        {/* Card 2: Afternoon Total */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-200/80 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50 rounded-bl-full pointer-events-none -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-orange-900 flex items-center gap-1.5">
              <Sunset className="w-4 h-4 text-orange-500" />
              दुपार एकूण
            </span>
            <span className="text-[11px] text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-full font-medium">
              Afternoon
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              {formatDisplayNumber(summary.totalAfternoonMilk, numeralSystem, { decimals: 2 })}
              <span className="text-xs font-normal text-slate-500 ml-1">लिटर</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">दुपारचे एकूण दूध</p>
          </div>
        </div>

        {/* Card 3: Grand Total Milk */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl p-4 shadow-sm border border-emerald-300 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-emerald-600" />
              एकूण दूध
            </span>
            <span className="text-[11px] text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full font-semibold">
              Grand Total
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
              {formatDisplayNumber(summary.grandTotalMilk, numeralSystem, { decimals: 2 })}
              <span className="text-xs font-normal text-emerald-800 ml-1">लिटर</span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-0.5">सकाळ + दुपार एकूण</p>
          </div>
        </div>

        {/* Card 4: Rate per Liter */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-dairy-gold-600" />
              दूध दर
            </span>
            <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
              Rate / Lit
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(summary.milkRate, numeralSystem)}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">प्रति लिटर खरेदी दर</p>
          </div>
        </div>

        {/* Card 5: Total Amount (Payable) - Prominent Golden Accent */}
        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-dairy-green-950 via-dairy-green-900 to-dairy-navy-950 rounded-2xl p-4 shadow-xl border-2 border-dairy-gold-400 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-dairy-gold-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-dairy-gold-300 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-dairy-gold-400" />
              एकूण देय रक्कम
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-950 bg-dairy-gold-400 font-extrabold px-2 py-0.5 rounded-full shadow-sm">
              Payable
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow">
              {formatCurrency(summary.totalPayableAmount, numeralSystem)}
            </div>
            <p className="text-[11px] text-emerald-200/90 mt-0.5 font-medium">
              = एकूण दूध × दर
            </p>
          </div>
        </div>
      </div>

      {/* Words & Action Strip */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-dairy-gold-300/80 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Amount in Marathi Words */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-dairy-gold-50 border border-dairy-gold-200 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-dairy-gold-600" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              रक्कम अक्षरी (Amount in Words):
            </span>
            <div className="text-base sm:text-lg font-bold text-dairy-green-950 mt-0.5">
              {summary.amountInWords}
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={onSaveBill}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition-all ${
              isSaved
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{isSaved ? 'बिल सेव्ह झाले!' : 'बिल सेव्ह करा'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenReceipt}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-dairy-gold-400 via-dairy-gold-500 to-amber-500 hover:from-dairy-gold-500 hover:to-amber-600 border border-amber-300 shadow-md shadow-amber-500/20 transition-all transform active:scale-95"
          >
            <span>अधिकृत पावती / प्रिंट पहा</span>
            <span className="text-sm">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
