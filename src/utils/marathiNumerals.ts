import { NumeralSystem } from '../types';

const MARATHI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

/**
 * Converts any number or numeric string to Marathi numerals (०-९).
 */
export function toMarathiDigits(input: number | string | null | undefined): string {
  if (input === null || input === undefined || input === '') return '';
  const str = input.toString();
  return str.replace(/[0-9]/g, (digit) => MARATHI_DIGITS[parseInt(digit, 10)]);
}

/**
 * Formats a number based on selected numeral system ('mr' or 'en').
 */
export function formatDisplayNumber(
  val: number | string | null | undefined,
  numeralSystem: NumeralSystem = 'mr',
  options?: {
    decimals?: number;
    useGrouping?: boolean;
    prefix?: string;
    suffix?: string;
  }
): string {
  if (val === null || val === undefined || val === '') return '';

  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return val.toString();

  let formatted = '';
  if (options?.decimals !== undefined) {
    formatted = num.toLocaleString('en-IN', {
      minimumFractionDigits: options.decimals,
      maximumFractionDigits: options.decimals,
      useGrouping: options.useGrouping ?? true,
    });
  } else {
    formatted = num.toLocaleString('en-IN', {
      useGrouping: options?.useGrouping ?? true,
    });
  }

  if (numeralSystem === 'mr') {
    formatted = toMarathiDigits(formatted);
  }

  const prefix = options?.prefix || '';
  const suffix = options?.suffix || '';
  return `${prefix}${formatted}${suffix}`;
}

/**
 * Formats an amount as Indian Rupee currency.
 */
export function formatCurrency(
  amount: number,
  numeralSystem: NumeralSystem = 'mr',
  showDecimals = false
): string {
  const formatted = formatDisplayNumber(amount, numeralSystem, {
    decimals: showDecimals ? 2 : 0,
    useGrouping: true,
  });
  return `₹ ${formatted}`;
}

/**
 * Formats a YYYY-MM-DD date into DD/MM/YYYY in English or Marathi digits.
 */
export function formatDisplayDate(
  dateStr: string,
  numeralSystem: NumeralSystem = 'mr'
): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    const formatted = `${day}/${month}/${year}`;
    return numeralSystem === 'mr' ? toMarathiDigits(formatted) : formatted;
  }
  return numeralSystem === 'mr' ? toMarathiDigits(dateStr) : dateStr;
}

// Marathi word mappings for 0-99
const MARATHI_ONES: { [key: number]: string } = {
  0: 'शून्य', 1: 'एक', 2: 'दोन', 3: 'तीन', 4: 'चार', 5: 'पाच',
  6: 'सहा', 7: 'सात', 8: 'आठ', 9: 'नऊ', 10: 'दहा',
  11: 'अकरा', 12: 'बारा', 13: 'तेरा', 14: 'चौदा', 15: 'पंधरा',
  16: 'सोळा', 17: 'सतरा', 18: 'अठरा', 19: 'एकोणीस', 20: 'वीस',
  21: 'एकवीस', 22: 'बावीस', 23: 'तेवीस', 24: 'चोवीस', 25: 'पंचवीस',
  26: 'सव्वीस', 27: 'सत्तावीस', 28: 'अठ्ठावीस', 29: 'एकोणतीस', 30: 'तीस',
  31: 'एकतीस', 32: 'बत्तीस', 33: 'तेहेतीस', 34: 'चौतीस', 35: 'पस्तीस',
  36: 'छत्तीस', 37: 'सदतीस', 38: 'अडतीस', 39: 'एकेचाळीस', 40: 'चाळीस',
  41: 'एक्केचाळीस', 42: 'बेचाळीस', 43: 'त्रेचाळीस', 44: 'चव्वेचाळीस', 45: 'पंचेचाळीस',
  46: 'शेहेचाळीस', 47: 'सत्तेचाळीस', 48: 'अठ्ठेचाळीस', 49: 'एकोणपन्नास', 50: 'पन्नास',
  51: 'एक्कावन्न', 52: 'बावन्न', 53: 'त्रेपन्न', 54: 'चौपन्न', 55: 'पंचावन्न',
  56: 'छप्पन्न', 57: 'सत्तावन्न', 58: 'अठ्ठावन्न', 59: 'एकोणसाठ', 60: 'साठ',
  61: 'एकसष्ठ', 62: 'पासष्ठ', 63: 'त्रेसष्ठ', 64: 'चौसष्ठ', 65: 'पासष्ठ',
  66: 'सहासष्ठ', 67: 'सदुसष्ठ', 68: 'अडुसष्ठ', 69: 'एकोणसत्तर', 70: 'सत्तर',
  71: 'एकाहत्तर', 72: 'बाहत्तर', 73: 'त्र्याहत्तर', 74: 'चौर्‍याहत्तर', 75: 'पंच्याहत्तर',
  76: 'शहात्तर', 77: 'सत्त्याहत्तर', 78: 'अठ्ठ्याहत्तर', 79: 'एकोणऐंशी', 80: 'ऐंशी',
  81: 'एक्याऐंशी', 82: 'ब्याऐंशी', 83: 'त्र्याऐंशी', 84: 'चौऱ्याऐंशी', 85: 'पंच्याऐंशी',
  86: 'शहाऐंशी', 87: 'सत्त्याऐंशी', 88: 'अठ्ठ्याऐंशी', 89: 'एकोणनव्वद', 90: 'नव्वद',
  91: 'एक्याण्णव', 92: 'ब्याण्णव', 93: 'त्र्याण्णव', 94: 'चौऱ्याण्णव', 95: 'पंच्याण्णव',
  96: 'शहाण्णव', 97: 'सत्त्याण्णव', 98: 'अठ्ठ्याण्णव', 99: 'नऊ्याण्णव'
};

/**
 * Converts numbers under 100 to Marathi words.
 */
function twoDigitsToMarathiWords(n: number): string {
  if (n <= 0) return '';
  return MARATHI_ONES[n] || n.toString();
}

/**
 * Converts an integer amount into formal Marathi words (e.g. 49200 -> "एकोणपन्नास हजार दोनशे रुपये फक्त").
 */
export function amountToMarathiWords(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded === 0) return 'शून्य रुपये फक्त';
  if (rounded < 0) return 'उणे ' + amountToMarathiWords(Math.abs(rounded));

  let n = rounded;
  const parts: string[] = [];

  // Crores
  if (n >= 10000000) {
    const crore = Math.floor(n / 10000000);
    n %= 10000000;
    parts.push(`${twoDigitsToMarathiWords(crore)} कोटी`);
  }

  // Lakhs
  if (n >= 100000) {
    const lakh = Math.floor(n / 100000);
    n %= 100000;
    parts.push(`${twoDigitsToMarathiWords(lakh)} लाख`);
  }

  // Thousands
  if (n >= 1000) {
    const thousand = Math.floor(n / 1000);
    n %= 1000;
    parts.push(`${twoDigitsToMarathiWords(thousand)} हजार`);
  }

  // Hundreds
  if (n >= 100) {
    const hundred = Math.floor(n / 100);
    n %= 100;
    if (hundred === 1) {
      parts.push('एकशे');
    } else {
      parts.push(`${twoDigitsToMarathiWords(hundred)}शे`);
    }
  }

  // Remaining 1-99
  if (n > 0) {
    parts.push(twoDigitsToMarathiWords(n));
  }

  return `${parts.join(' ')} रुपये फक्त`;
}
