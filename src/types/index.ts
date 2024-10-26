import { addDays } from 'date-fns';

export type PageStatus = 0 | 1 | 2 | 3;

export interface PageData {
  [key: number]: {
    status: PageStatus;
    percentage: number;
    lastModified?: string;
    nextReview?: string; // Date string for next review
    reviewCount?: number; // Number of times reviewed
  };
}

export interface PageMetadata {
  lastModified: string;
  juz: number;
}

export type FilterType = 'all' | '0' | '1' | '2' | '3' | 'review';

export const STATUS_LABELS = {
  0: 'Not Memorized',
  1: 'Started',
  2: 'Partial',
  3: 'Memorized',
} as const;

export const STATUS_COLORS = {
  0: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600',
  1: 'bg-amber-400 hover:bg-amber-500 dark:bg-amber-600 dark:hover:bg-amber-700',
  2: 'bg-blue-400 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700',
  3: 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700',
} as const;

// Review intervals in days based on review count
export const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60, 90];

export function getNextReviewDate(reviewCount: number): Date {
  const interval = REVIEW_INTERVALS[Math.min(reviewCount, REVIEW_INTERVALS.length - 1)];
  return addDays(new Date(), interval);
}

// Juz' information with start pages and names
export const JUZ_INFO = {
  1: { start: 1, name: "Alif-Lām-Mīm", end: 21 },
  2: { start: 22, name: "Sayaqūl", end: 41 },
  3: { start: 42, name: "Tilka 'r-Rusul", end: 61 },
  4: { start: 62, name: "Lan Tanalū", end: 81 },
  5: { start: 82, name: "Wa'l-Muḥṣanāt", end: 101 },
  6: { start: 102, name: "Lā Yuḥibbu-'llāh", end: 121 },
  7: { start: 122, name: "Wa Idhā Samiʿū", end: 141 },
  8: { start: 142, name: "Wa Law Annanā", end: 161 },
  9: { start: 162, name: "Qāla 'l-Mala'", end: 181 },
  10: { start: 182, name: "Wa-ʿlamū", end: 201 },
  11: { start: 202, name: "Yaʿtadhirūn", end: 221 },
  12: { start: 222, name: "Wa Mā Min Dābbah", end: 241 },
  13: { start: 242, name: "Wa Mā Ubarri'u", end: 261 },
  14: { start: 262, name: "Rubamā", end: 281 },
  15: { start: 282, name: "Subḥāna 'lladhī", end: 301 },
  16: { start: 302, name: "Qāla 'Alam", end: 321 },
  17: { start: 322, name: "Iqtaraba Lin-Nās", end: 341 },
  18: { start: 342, name: "Qad 'Aflaḥa", end: 361 },
  19: { start: 362, name: "Wa Qāla 'Lladhīna", end: 381 },
  20: { start: 382, name: "'A-Man Khalaq", end: 401 },
  21: { start: 402, name: "Utlu Mā Ūḥiya", end: 421 },
  22: { start: 422, name: "Wa Man Yaqnut", end: 441 },
  23: { start: 442, name: "Wa Mā Liya", end: 461 },
  24: { start: 462, name: "Fa-Man 'Aẓlam", end: 481 },
  25: { start: 482, name: "Ilayhi Yuraddu", end: 501 },
  26: { start: 502, name: "Ḥā Mīm", end: 521 },
  27: { start: 522, name: "Qāla Fa-Mā Khaṭbukum", end: 541 },
  28: { start: 542, name: "Qad Samiʿa 'llāh", end: 561 },
  29: { start: 562, name: "Tabāraka 'Lladhī", end: 581 },
  30: { start: 582, name: "ʿAmma", end: 604 }
} as const;