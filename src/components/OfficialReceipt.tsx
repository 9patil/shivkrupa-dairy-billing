import React from 'react';
import { DairySettings, MilkEntry, BillingSummaryData, NumeralSystem } from '../types';
import { formatDisplayNumber, formatDisplayDate, formatCurrency } from '../utils/marathiNumerals';

interface OfficialReceiptProps {
  settings: DairySettings;
  entries: MilkEntry[];
  summary: BillingSummaryData;
  numeralSystem: NumeralSystem;
  generatedDate?: string;
  isPrintView?: boolean;
  id?: string;
}

export const OfficialReceipt: React.FC<OfficialReceiptProps> = ({
  settings,
  entries,
  summary,
  numeralSystem,
  isPrintView = false,
  id = 'receipt-print-area',
}) => {
  return (
    <div
      id={id}
      className="official-dairy-receipt font-marathi bg-white text-black mx-auto w-full max-w-[760px] p-2 sm:p-4 border-0 shadow-none"
      style={{
        width: '100%',
        maxWidth: '760px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        color: '#000000',
        boxSizing: 'border-box',
      }}
    >
      {/* Pure Borderless Container with natural page margins */}
      <div className="bg-white">
        {/* Top Auspicious Invocation Header */}
        <div className="text-center mb-1.5">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-black">
            {settings.headerShloka || '॥ श्री गणेशाय नमः ॥'}
          </span>
        </div>

        {/* Letterhead Section: Logo on Left, Details in Center & Right */}
        <div className="flex items-center justify-between gap-4 pb-2.5 border-b border-black">
          {/* Official Dairy Logo - Preserved Aspect Ratio & High Resolution */}
          <div className="shrink-0">
            <img
              src="/shivkrupa-logo.jpg"
              alt="शिवकृपा दूध संकलन ग्रुप"
              className="w-18 h-18 sm:w-20 sm:h-20 object-contain rounded-full border border-black bg-white"
              crossOrigin="anonymous"
            />
          </div>

          {/* Center Brand Identity */}
          <div className="text-center flex-1 px-2">
            <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight leading-tight">
              {settings.dairyName}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-black mt-0.5">
              {settings.location}
            </p>
            <div className="mt-0.5 text-xs sm:text-sm font-semibold text-black">
              संचालक: <span className="font-extrabold text-black">{settings.ownerName}</span>
            </div>
            <div className="inline-block mt-1 px-3 py-0.5 border border-black text-black text-xs font-bold tracking-wider bg-white">
              दूध संकलन अहवाल व पेमेंट पावती
            </div>
          </div>

          {/* Right Meta Info Box (Receipt No & Rate Only - NO generation date) */}
          <div className="hidden sm:block text-right text-xs space-y-1 min-w-[120px] border-l border-black pl-3">
            <div>
              <span className="text-black font-medium">पावती क्र:</span>{' '}
              <strong className="text-black font-bold font-mono">
                {numeralSystem === 'mr' ? formatDisplayNumber(settings.receiptNo, 'mr') : settings.receiptNo}
              </strong>
            </div>
            <div>
              <span className="text-black font-medium">दर:</span>{' '}
              <strong className="text-black font-bold">
                {formatCurrency(settings.milkRate, numeralSystem)} / लि.
              </strong>
            </div>
          </div>
        </div>

        {/* Sub-Header Metadata Bar (Only Active Billing Period, Receipt No, Farmer) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 px-3 my-2 border border-black text-xs bg-white text-black">
          <div>
            <span className="block text-[11px] text-black">बिल कालावधी:</span>
            <strong className="font-bold text-black">
              {formatDisplayDate(settings.fromDate, numeralSystem)} ते {formatDisplayDate(settings.toDate, numeralSystem)}
            </strong>
          </div>
          <div>
            <span className="block text-[11px] text-black">पावती क्रमांक:</span>
            <strong className="font-bold font-mono text-black">
              {numeralSystem === 'mr' ? formatDisplayNumber(settings.receiptNo, 'mr') : settings.receiptNo}
            </strong>
          </div>
          <div>
            <span className="block text-[11px] text-black">दूध उत्पादक / सभासद:</span>
            <strong className="font-bold text-black">
              {settings.farmerName || 'श्री. उमाकांत हिम्मतराव जाधव'}
            </strong>
          </div>
          <div className="text-left sm:text-right">
            <span className="block text-[11px] text-black">खाते क्र / कोड:</span>
            <strong className="font-bold text-black">
              {settings.farmerCode ? formatDisplayNumber(settings.farmerCode, numeralSystem) : '-'}
            </strong>
          </div>
        </div>

        {/* Daily Milk Collection Table (Strict Minimal Monochrome Grid) */}
        <div className="my-2">
          <table className="w-full border-collapse border border-black text-xs sm:text-sm text-black">
            <thead>
              <tr className="bg-white text-black font-bold text-center border-b-2 border-black">
                <th className="border border-black py-1 px-2 w-10 sm:w-12">क्र.</th>
                <th className="border border-black py-1 px-3 min-w-[95px]">दिनांक</th>
                <th className="border border-black py-1 px-3 min-w-[105px]">सकाळ (लिटर)</th>
                <th className="border border-black py-1 px-3 min-w-[105px]">दुपार (लिटर)</th>
                <th className="border border-black py-1 px-3 min-w-[115px] text-right">एकूण दूध (लिटर)</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="border border-black text-center py-6 text-black">
                    कोणत्याही नोंदी उपलब्ध नाहीत.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => {
                  const mVal = typeof entry.morningMilk === 'number' ? entry.morningMilk : 0;
                  const aVal = typeof entry.afternoonMilk === 'number' ? entry.afternoonMilk : 0;

                  return (
                    <tr key={entry.id} className="text-center font-medium bg-white">
                      <td className="border border-black py-1 px-2 font-bold text-black">
                        {formatDisplayNumber(entry.srNo, numeralSystem)}
                      </td>
                      <td className="border border-black py-1 px-3 font-semibold text-black text-left pl-3">
                        {formatDisplayDate(entry.date, numeralSystem)}
                      </td>
                      <td className="border border-black py-1 px-3 text-black">
                        {mVal > 0 ? formatDisplayNumber(mVal, numeralSystem, { decimals: 2 }) : '-'}
                      </td>
                      <td className="border border-black py-1 px-3 text-black">
                        {aVal > 0 ? formatDisplayNumber(aVal, numeralSystem, { decimals: 2 }) : '-'}
                      </td>
                      <td className="border border-black py-1 px-3 text-right font-bold text-black pr-3">
                        {entry.totalMilk > 0
                          ? formatDisplayNumber(entry.totalMilk, numeralSystem, { decimals: 2 })
                          : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {/* Table Totals Row */}
            <tfoot>
              <tr className="bg-white font-bold text-center border-t-2 border-black">
                <td colSpan={2} className="border border-black py-1 px-3 text-right font-extrabold text-black">
                  एकूण बेरीज:
                </td>
                <td className="border border-black py-1 px-3 font-bold text-black">
                  {formatDisplayNumber(summary.totalMorningMilk, numeralSystem, { decimals: 2 })} लि.
                </td>
                <td className="border border-black py-1 px-3 font-bold text-black">
                  {formatDisplayNumber(summary.totalAfternoonMilk, numeralSystem, { decimals: 2 })} लि.
                </td>
                <td className="border border-black py-1 px-3 text-right font-extrabold text-black pr-3">
                  {formatDisplayNumber(summary.grandTotalMilk, numeralSystem, { decimals: 2 })} लि.
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Calculation Summary Box (Single Thin Black Border, No Outer Page Box) */}
        <div className="my-2.5 border border-black p-2.5 bg-white text-black">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm font-semibold border-b border-black pb-2">
            <div>
              <span className="text-black">सकाळ एकूण :</span>{' '}
              <strong className="text-black text-xs sm:text-sm">
                {formatDisplayNumber(summary.totalMorningMilk, numeralSystem, { decimals: 2 })}
              </strong>{' '}
              लिटर
            </div>
            <div>
              <span className="text-black">दुपार एकूण :</span>{' '}
              <strong className="text-black text-xs sm:text-sm">
                {formatDisplayNumber(summary.totalAfternoonMilk, numeralSystem, { decimals: 2 })}
              </strong>{' '}
              लिटर
            </div>
            <div>
              <span className="text-black">एकूण दूध :</span>{' '}
              <strong className="text-black text-xs sm:text-sm font-bold">
                {formatDisplayNumber(summary.grandTotalMilk, numeralSystem, { decimals: 2 })}
              </strong>{' '}
              लिटर
            </div>
            <div>
              <span className="text-black">दूध दर :</span>{' '}
              <strong className="text-black text-xs sm:text-sm">
                {formatCurrency(summary.milkRate, numeralSystem)}
              </strong>{' '}
              प्रति लिटर
            </div>
          </div>

          {/* Amount in Words & Total Payable Box with Single Black Outline */}
          <div className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-2 pt-0.5">
            <div className="text-xs sm:text-sm text-black">
              <span className="font-bold">अक्षरी रक्कम:</span>{' '}
              <span className="font-extrabold text-black">{summary.amountInWords}</span>
            </div>
            {/* Total Amount Box with single black outline and bold black text */}
            <div className="border border-black px-3.5 py-1 bg-white text-black font-extrabold text-sm sm:text-base tracking-tight">
              <span>एकूण रक्कम : </span>
              <span className="font-black">
                {formatCurrency(summary.totalPayableAmount, numeralSystem)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer / Signature Section (Authorized Sign - completely blank space, NO stamp box) */}
        <div className="mt-5 pt-2 border-t border-black">
          <div className="flex justify-end">
            <div className="w-56 text-center space-y-1.5">
              {/* Completely blank open space above signature line (no border, no box) */}
              <div className="h-12" />
              
              {/* Single dashed signature line */}
              <div className="text-black tracking-widest overflow-hidden text-xs select-none">
                ---------------------------------
              </div>

              {/* Centered label & Sub-text */}
              <div>
                <div className="font-bold text-xs sm:text-sm text-black">
                  अधिकृत संकलक स्वाक्षरी
                </div>
                <div className="text-xs text-black font-semibold mt-0.5">
                  {settings.ownerName}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
