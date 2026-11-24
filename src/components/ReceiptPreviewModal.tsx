import React, { useState } from 'react';
import { DairySettings, MilkEntry, BillingSummaryData, NumeralSystem } from '../types';
import { OfficialReceipt } from './OfficialReceipt';
import { X, Download, Printer, Check, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ReceiptPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DairySettings;
  entries: MilkEntry[];
  summary: BillingSummaryData;
  numeralSystem: NumeralSystem;
  onToggleNumerals: () => void;
  onSaveBill: () => void;
  isSaved?: boolean;
}

export const ReceiptPreviewModal: React.FC<ReceiptPreviewModalProps> = ({
  isOpen,
  onClose,
  settings,
  entries,
  summary,
  numeralSystem,
  onToggleNumerals,
  onSaveBill,
  isSaved,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const downloadPDF = async () => {
    const source = document.getElementById('receipt-print-area');
    if (!source) return;

    setIsGeneratingPdf(true);

    try {
      await document.fonts.ready;

      // 1. Create a detached sandbox container
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '-9999px';
      container.style.width = '794px';       // Standard A4 width at 96 DPI
      container.style.minHeight = '1120px';  // Standard A4 height
      container.style.background = '#ffffff';
      container.style.zIndex = '-1000';
      container.style.overflow = 'visible';

      // 2. Clone the receipt into sandbox
      const clone = source.cloneNode(true) as HTMLElement;
      clone.style.width = '794px';
      clone.style.maxWidth = '794px';
      clone.style.minWidth = '794px';
      clone.style.padding = '30px 40px';
      clone.style.boxSizing = 'border-box';
      clone.style.transform = 'none';
      clone.style.margin = '0 auto';

      // Force all child elements in the clone to desktop proportions
      clone.querySelectorAll('*').forEach((el) => {
        (el as HTMLElement).style.boxSizing = 'border-box';
      });

      container.appendChild(clone);
      document.body.appendChild(container);

      try {
        // 3. Render canvas specifically constrained to 794px
        const canvas = await html2canvas(clone, {
          scale: 2,
          useCORS: true,
          logging: false,
          width: 794,
          height: 1120,
          windowWidth: 794,
          windowHeight: 1120,
          scrollX: 0,
          scrollY: 0,
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        // Exactly 1 full A4 page (210mm x 297mm)
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        pdf.save('Dudh_Sankalan_Pavti.pdf');

        setDownloadSuccess(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
        setTimeout(() => setDownloadSuccess(false), 3000);
      } finally {
        // Clean up sandbox
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      }
    } catch (error) {
      console.error('PDF Generation failed:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="modal-backdrop-root fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="modal-dialog-container relative w-full max-w-4xl bg-slate-100 rounded-2xl shadow-2xl border border-slate-300 flex flex-col max-h-[95vh] overflow-hidden my-4">
        {/* Modal Toolbar Header */}
        <div className="modal-header-toolbar flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-gradient-to-r from-slate-950 via-dairy-green-950 to-slate-900 text-white border-b-2 border-dairy-gold-400 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <span>अधिकृत पावती पूर्वावलोकन (Official Receipt Preview)</span>
            </h2>
            <p className="text-xs text-slate-300">
              A4 फॉरमॅट, शुद्ध कृष्ण-धवल (Pure B&W) बँक व मुद्रणासाठी पावती
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Numeral Switcher inside Preview */}
            <button
              type="button"
              onClick={onToggleNumerals}
              className="px-2.5 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-xs font-medium border border-white/20 text-slate-200 transition-colors"
              title="अंक स्वरूप बदला (मराठी / English)"
            >
              अंक: <strong className="text-dairy-gold-400">{numeralSystem === 'mr' ? 'मराठी (०-९)' : 'English (0-9)'}</strong>
            </button>

            {/* Save Bill */}
            <button
              type="button"
              onClick={onSaveBill}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                isSaved
                  ? 'bg-emerald-700 text-white border-emerald-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaved ? 'सेव्ह झाले!' : 'सेव्ह करा'}</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 shadow transition-all active:scale-95"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>पावती प्रिंट करा</span>
            </button>

            {/* Download PDF Button via html2pdf.js */}
            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={downloadPDF}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-dairy-gold-400 to-amber-500 hover:from-dairy-gold-500 hover:to-amber-600 border border-amber-300 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>PDF तयार होत आहे...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-950" />
                  <span>डाउनलोड झाले!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>डाउनलोड PDF</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="modal-scroll-area flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/60">
          <div className="w-full max-w-[760px] mx-auto bg-white border border-slate-300 shadow-none">
            <OfficialReceipt
              id="receipt-print-area"
              settings={settings}
              entries={entries}
              summary={summary}
              numeralSystem={numeralSystem}
            />
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="modal-footer-strip px-6 py-2.5 bg-white border-t border-slate-300 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <span>
            💡 <strong>टीप:</strong> शुद्ध काळा व पांढरा (Pure B&W) पावती फॉरमॅट, बँक व प्रिंटसाठी सर्वोत्तम.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-700 hover:text-slate-950 font-semibold"
          >
            बंद करा
          </button>
        </div>
      </div>
    </div>
  );
};
