// Bengali conversion & formatting utilities

const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const bengaliMonths = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];
const bengaliDays = [
  'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
];

/**
 * Convert an English number or string of digits to Bengali digits
 * @param {number|string} num 
 * @returns {string}
 */
export function toBengaliNumber(num) {
  if (num === undefined || num === null) return '০';
  return num
    .toString()
    .replace(/\d/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

/**
 * Format currency in Bangladeshi Taka with Bengali numerals and comma separators
 * @param {number} amount 
 * @param {boolean} showSymbol 
 * @returns {string} e.g. "৳ ৩,৫০০"
 */
export function formatBengaliPrice(amount, showSymbol = true) {
  if (typeof amount !== 'number') {
    amount = Number(amount) || 0;
  }
  const formattedEnglish = amount.toLocaleString('en-IN');
  const formattedBengali = formattedEnglish.replace(/\d/g, (d) => bengaliDigits[parseInt(d, 10)]);
  return showSymbol ? `৳ ${formattedBengali}` : formattedBengali;
}

/**
 * Format a Date object into a readable Bengali date string
 * @param {Date|string} dateInput 
 * @returns {string} e.g. "২৫ আগস্ট, ২০২৬ (মঙ্গলবার)"
 */
export function formatBengaliDate(dateInput) {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (!date || isNaN(date.getTime())) return '';
  
  const day = toBengaliNumber(date.getDate());
  const month = bengaliMonths[date.getMonth()];
  const year = toBengaliNumber(date.getFullYear());
  const dayName = bengaliDays[date.getDay()];

  return `${day} ${month}, ${year} (${dayName})`;
}

/**
 * Available delivery time slots in Bengali
 */
export const DELIVERY_SLOTS = [
  { id: 'morning', label: 'সকাল ৯:০০ - দুপুর ১২:০০', tag: 'মর্নিং ব্লুম' },
  { id: 'afternoon', label: 'দুপুর ১২:০০ - বিকাল ৩:০০', tag: 'নুন এক্সপ্রেস' },
  { id: 'evening', label: 'বিকাল ৩:০০ - সন্ধ্যা ৬:০০', tag: 'সানসেট স্পেশাল' },
  { id: 'night', label: 'সন্ধ্যা ৬:০০ - রাত ৯:০০', tag: 'ইভনিং রোমান্স' },
  { id: 'midnight', label: 'রাত ১১:৩০ - ১২:৩০', tag: 'মিডনাইট সারপ্রাইজ (+৳২০০)' }
];
