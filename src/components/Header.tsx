import React from 'react';
import { NumeralSystem, DairySettings } from '../types';
import { Settings, History, Sparkles, FileText, Calendar, IndianRupee } from 'lucide-react';
import { formatCurrency, formatDisplayDate } from '../utils/marathiNumerals';

interface HeaderProps {
  settings: DairySettings;
  numeralSystem: NumeralSystem;
  onToggleNumerals: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onLoadDemo: () => void;
  onOpenPreview: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  numeralSystem,
  onToggleNumerals,
  onOpenSettings,
  onOpenHistory,
  onLoadDemo,
  onOpenPreview,
  historyCount,
}) => {
  return (
    <header className="app-header bg-gradient-to-r from-dairy-green-950 via-dairy-green-900 to-dairy-navy-950 text-white shadow-xl border-b-4 border-dairy-gold-500 relative overflow-hidden">
      {/* Decorative Traditional Border Pattern */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-dairy-gold-400 via-amber-300 to-dairy-gold-500 opacity-90" />
      
      {/* Background Subtle Watermark Rings */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-amber-500/5 blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Auspicious Invocation Header */}
        <div className="text-center mb-3">
          <span className="inline-block px-4 py-0.5 text-xs sm:text-sm font-semibold tracking-wider text-dairy-gold-300 bg-black/25 rounded-full border border-dairy-gold-500/30 shadow-inner">
            {settings.headerShloka || '॥ श्री गणेशाय नमः ॥'}
          </span>
        </div>

        {/* Main Branding Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Logo & Identity */}
          <div className="flex items-center gap-4 sm:gap-6 text-center md:text-left">
            {/* Original Uploaded Logo (Kept intact, high res, original aspect ratio) */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-1 bg-gradient-to-tr from-dairy-gold-500 via-amber-200 to-dairy-green-400 shadow-2xl shadow-black/40 ring-2 ring-dairy-gold-400/50">
                <img
                  src="/shivkrupa-logo.jpg"
                  alt="शिवकृपा दूध संकलन ग्रुप लोगो"
                  className="w-full h-full object-cover rounded-full bg-white transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                {settings.dairyName}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 mt-1 text-xs sm:text-sm text-emerald-100 font-medium">
                <span className="text-dairy-gold-300">📍 {settings.location}</span>
                <span className="hidden sm:inline text-white/40">•</span>
                <span>संचालक: <strong className="text-white font-semibold">{settings.ownerName}</strong></span>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-600/50">
                  <IndianRupee className="w-3 h-3 text-dairy-gold-400" />
                  दर: <strong className="text-white">{formatCurrency(settings.milkRate, numeralSystem)}</strong> / लिटर
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-200 border border-slate-700">
                  <Calendar className="w-3 h-3 text-cyan-400" />
                  कालावधी: {formatDisplayDate(settings.fromDate, numeralSystem)} ते {formatDisplayDate(settings.toDate, numeralSystem)}
                </span>
              </div>
            </div>
          </div>

          {/* Top Actions & Numeral Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 shrink-0">
            {/* English / Marathi Numeral Toggle */}
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 backdrop-blur-sm">
              <button
                type="button"
                onClick={onToggleNumerals}
                title="अंक स्वरूप बदला (मराठी / English)"
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200"
              >
                <span className="text-slate-300 text-[11px]">अंक:</span>
                <span className={`px-2 py-0.5 rounded ${numeralSystem === 'mr' ? 'bg-dairy-gold-500 text-dairy-navy-950 font-bold shadow' : 'text-slate-300 hover:text-white'}`}>
                  मराठी (०-९)
                </span>
                <span className={`px-2 py-0.5 rounded ${numeralSystem === 'en' ? 'bg-dairy-gold-500 text-dairy-navy-950 font-bold shadow' : 'text-slate-300 hover:text-white'}`}>
                  English (0-9)
                </span>
              </button>
            </div>

            {/* Dynamic Smart Auto-Fill Button */}
            <button
              type="button"
              onClick={onLoadDemo}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors shadow-sm active:scale-95"
              title="१० दिवसांचा वास्तववादी डेटा ऑटो-फिल करा (प्रत्येक क्लिकवर नवीन संख्या)"
            >
              <Sparkles className="w-3.5 h-3.5 text-dairy-gold-400" />
              <span>ऑटो-फिल (१० दिवस)</span>
            </button>

            {/* History Drawer Trigger */}
            <button
              type="button"
              onClick={onOpenHistory}
              className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition-colors shadow-sm"
              title="मागील सेव्ह केलेली बिले पहा"
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>इतिहास</span>
              {historyCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-cyan-500 text-black font-bold rounded-full">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Settings Trigger */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition-colors shadow-sm"
              title="डेअरी व बिल सेटिंग्ज बदला"
            >
              <Settings className="w-3.5 h-3.5 text-dairy-gold-400" />
              <span>सेटिंग्ज</span>
            </button>

            {/* View Official Receipt / PDF Preview */}
            <button
              type="button"
              onClick={onOpenPreview}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-dairy-gold-500 to-amber-500 hover:from-dairy-gold-600 hover:to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 border border-amber-400 transition-all transform active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>पावती / PDF पहा</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
