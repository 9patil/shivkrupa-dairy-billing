import React, { useState, useEffect } from 'react';
import { DairySettings } from '../types';
import { X, Check, RotateCcw, Calendar, Store, MapPin, User, IndianRupee, Hash } from 'lucide-react';
import { DEFAULT_SETTINGS } from '../utils/calculations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: DairySettings;
  onSave: (newSettings: DairySettings) => void;
  onApplyDateRange: (from: string, to: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onSave,
  onApplyDateRange,
}) => {
  const [formData, setFormData] = useState<DairySettings>(currentSettings);

  useEffect(() => {
    setFormData(currentSettings);
  }, [currentSettings, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof DairySettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyPreset = (type: '1-10' | '11-20' | '21-end') => {
    const now = new Date(formData.fromDate || new Date());
    const year = now.getFullYear();
    const month = now.getMonth();

    let startDay = 1;
    let endDay = 10;

    if (type === '11-20') {
      startDay = 11;
      endDay = 20;
    } else if (type === '21-end') {
      startDay = 21;
      endDay = new Date(year, month + 1, 0).getDate();
    }

    const pad = (n: number) => String(n).padStart(2, '0');
    const newFrom = `${year}-${pad(month + 1)}-${pad(startDay)}`;
    const newTo = `${year}-${pad(month + 1)}-${pad(endDay)}`;

    setFormData(prev => ({
      ...prev,
      fromDate: newFrom,
      toDate: newTo,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onApplyDateRange(formData.fromDate, formData.toDate);
    onClose();
  };

  const handleResetToDefault = () => {
    if (window.confirm('सर्व सेटिंग्ज डीफॉल्ट मूल्यांवर रीसेट करायच्या आहेत का?')) {
      setFormData(DEFAULT_SETTINGS);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-dairy-cream-300 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-dairy-green-950 to-dairy-green-900 text-white border-b border-dairy-gold-500/50">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-dairy-gold-400" />
            <h2 className="text-lg font-bold">डेअरी माहिती व बिलिंग सेटिंग्ज</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm">
          {/* Top Shloka & Dairy Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block font-semibold text-slate-700 mb-1">
                शीर्षक श्लोक
              </label>
              <input
                type="text"
                value={formData.headerShloka}
                onChange={e => handleChange('headerShloka', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dairy-green-600 focus:outline-none"
                placeholder="॥ श्री गणेशाय नमः ॥"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                दूध संकलन केंद्राचे नाव <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.dairyName}
                onChange={e => handleChange('dairyName', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dairy-green-600 focus:outline-none font-semibold text-slate-900"
                placeholder="शिवकृपा दूध संकलन ग्रुप"
              />
            </div>
          </div>

          {/* Location & Owner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 font-semibold text-slate-700 mb-1">
                <MapPin className="w-4 h-4 text-dairy-green-700" />
                पत्ता / ठिकाण <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={e => handleChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dairy-green-600 focus:outline-none"
                placeholder="नांदगांव, ता. जि. जळगांव"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 font-semibold text-slate-700 mb-1">
                <User className="w-4 h-4 text-dairy-green-700" />
                संचालक / अधिकृत संकलकाचे नाव <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={e => handleChange('ownerName', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dairy-green-600 focus:outline-none"
                placeholder="श्री. चंद्रकांत जिजाबराव पाटील"
              />
            </div>
          </div>

          {/* Rate & Receipt Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-dairy-cream-50 p-4 rounded-xl border border-dairy-cream-200">
            <div>
              <label className="flex items-center gap-1 font-semibold text-slate-700 mb-1">
                <IndianRupee className="w-4 h-4 text-dairy-gold-600" />
                दूध दर (₹ प्रति लिटर) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  required
                  value={formData.milkRate}
                  onChange={e => handleChange('milkRate', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dairy-green-600 focus:outline-none font-bold text-slate-900 text-base"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">डीफॉल्ट: ₹६० प्रति लिटर</p>
            </div>

            <div>
              <label className="flex items-center gap-1 font-semibold text-slate-700 mb-1">
                <Hash className="w-4 h-4 text-dairy-green-700" />
                पावती क्रमांक (Receipt No) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.receiptNo}
                onChange={e => handleChange('receiptNo', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dairy-green-600 focus:outline-none font-mono"
                placeholder="SK-2026-11-001"
              />
              <p className="text-xs text-slate-500 mt-1">स्वयंचलित अथवा इच्छेनुसार बदला</p>
            </div>
          </div>

          {/* Billing Cycle / Dates */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 font-bold text-emerald-900">
                <Calendar className="w-4 h-4 text-emerald-700" />
                बिल कालावधी (Billing Cycle: 10 Days)
              </label>
              <div className="flex gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('1-10')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 font-medium rounded border border-emerald-300 transition-colors"
                >
                  १ ते १०
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('11-20')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 font-medium rounded border border-emerald-300 transition-colors"
                >
                  ११ ते २०
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('21-end')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 font-medium rounded border border-emerald-300 transition-colors"
                >
                  २१ ते अखेर
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  पासून दिनांक (From Date)
                </label>
                <input
                  type="date"
                  required
                  value={formData.fromDate}
                  onChange={e => handleChange('fromDate', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dairy-green-600 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  पर्यंत दिनांक (To Date)
                </label>
                <input
                  type="date"
                  required
                  value={formData.toDate}
                  onChange={e => handleChange('toDate', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dairy-green-600 focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>

          {/* Optional Farmer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                दूध उत्पादक / शेतकरी नाव (ऐच्छिक)
              </label>
              <input
                type="text"
                value={formData.farmerName || ''}
                onChange={e => handleChange('farmerName', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dairy-green-600 focus:outline-none"
                placeholder="उदा. श्री. उमाकांत हिम्मतराव जाधव"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                उत्पादक कोड / खाते क्रमांक
              </label>
              <input
                type="text"
                value={formData.farmerCode || ''}
                onChange={e => handleChange('farmerCode', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dairy-green-600 focus:outline-none"
                placeholder="उदा. १४२"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>डीफॉल्ट मूल्ये आणा</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                रद्द करा
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 font-bold text-white bg-dairy-green-800 hover:bg-dairy-green-900 rounded-xl shadow-md transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>बदल जतन करा</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
