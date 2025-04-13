export const defaultLocale = 'en';
export const locales = ['en', 'tr', 'de', 'ru', 'ar', 'fr'] as const;
export type ValidLocale = typeof locales[number];

export const languageNames = {
  en: 'English',
  tr: 'Türkçe',
  de: 'Deutsch',
  ru: 'Русский',
  ar: 'العربية',
  fr: 'Français',
} as const; 