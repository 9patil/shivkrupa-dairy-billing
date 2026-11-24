import React, { useRef } from 'react';
import { SavedBill, NumeralSystem } from '../types';
import { formatDisplayDate, formatCurrency, formatDisplayNumber } from '../utils/marathiNumerals';
import { X, Calendar, Trash2, ArrowUpRight, Download, Upload, Clock, IndianRupee, Droplets } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedBills: SavedBill[];
  numeralSystem: NumeralSystem;
  onLoadBill: (bill: SavedBill) => void;
  onDeleteBill: (id: string) => void;
  onExportCSV: () => void;
  onExportJSONBackup: () => void;
  onImportBackup: (file: File) => void;
  onClearAllHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedBills,
  numeralSystem,
  onLoadBill,
  onDeleteBill,
  onExportCSV,
  onExportJSONBackup,
  onImportBackup,
  onClearAllHistory,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-300">
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-950 to-dairy-green-950 text-white flex items-center justify-between border-b-2 border-dairy-gold-400">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>सेव्ह केलेल्या बिलांचा इतिहास</span>
            </h2>
            <p className="text-xs text-slate-300">
              एकूण {savedBills.length} बिले जतन केलेली आहेत
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons Strip */}
        <div className="p-3 bg-dairy-cream-50 border-b border-dairy-cream-200 flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={onExportCSV}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium shadow-sm transition-colors"
            title="चालू बिल CSV फॉरमॅटमध्ये डाउनलोड करा"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>CSV एक्सपोर्ट</span>
          </button>

          <button
            type="button"
            onClick={onExportJSONBackup}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium shadow-sm transition-colors"
            title="सर्व माहितीचा संपूर्ण JSON बॅकअप डाउनलोड करा"
          >
            <Download className="w-3.5 h-3.5 text-dairy-gold-600" />
            <span>पूर्ण बॅकअप</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium shadow-sm transition-colors"
            title="यापूर्वी घेतलेला JSON बॅकअप परत आणा"
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>बॅकअप आणा</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>

        {/* Bill List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedBills.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-sm">अजून कोणताही इतिहास सेव्ह केलेला नाही.</p>
              <p className="text-xs text-slate-400 mt-1">
                डॅशबोर्डवर &quot;बिल सेव्ह करा&quot; बटनावर क्लिक करून चालू बिल सुरक्षित ठेवा.
              </p>
            </div>
          ) : (
            savedBills.map((bill) => (
              <div
                key={bill.id}
                className="bg-white rounded-xl p-3.5 border border-slate-200 hover:border-dairy-gold-400 hover:shadow-md transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-dairy-navy-950 px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                    {bill.receiptNo}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(bill.savedAt).toLocaleDateString('mr-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-600" />
                    <span>कालावधी:</span>
                    <span>
                      {formatDisplayDate(bill.fromDate, numeralSystem)} ते{' '}
                      {formatDisplayDate(bill.toDate, numeralSystem)}
                    </span>
                  </div>
                  {bill.farmerName && (
                    <div className="text-xs text-slate-600 mt-0.5">
                      उत्पादक: <strong className="text-slate-900">{bill.farmerName}</strong>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1 text-slate-700">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    <span>
                      <strong>
                        {formatDisplayNumber(bill.summary.grandTotalMilk, numeralSystem, {
                          decimals: 2,
                        })}
                      </strong>{' '}
                      लि.
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-900 font-bold justify-end">
                    <IndianRupee className="w-3.5 h-3.5 text-dairy-gold-600" />
                    <span className="text-emerald-950">
                      {formatCurrency(bill.summary.totalPayableAmount, numeralSystem)}
                    </span>
                  </div>
                </div>

                {/* Bill Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      onLoadBill(bill);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-dairy-green-800 hover:text-dairy-green-950 hover:underline"
                  >
                    <span>डॅशबोर्डवर लोड करा</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`पावती ${bill.receiptNo} इतिहासामधून कायमची हटवायची आहे का?`)) {
                        onDeleteBill(bill.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="इतिहासामधून हटवा"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {savedBills.length > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClearAllHistory}
              className="text-xs text-red-600 hover:text-red-800 font-medium hover:underline"
            >
              सर्व इतिहास साफ करा
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
            >
              बंद करा
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
