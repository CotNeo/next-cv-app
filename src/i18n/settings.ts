export const defaultLocale = 'en';
export const locales = ['en', 'tr', 'de', 'ru', 'ar', 'fr'] as const;
export type ValidLocale = (typeof locales)[number];

/** Native names, shown in the language switcher. */
export const languageNames = {
  en: 'English',
  tr: 'Türkçe',
  de: 'Deutsch',
  ru: 'Русский',
  ar: 'العربية',
  fr: 'Français',
} as const;

/** English names, used when instructing the AI which language to write in. */
export const LANGUAGE_LABELS: Record<ValidLocale, string> = {
  en: 'English',
  tr: 'Turkish',
  de: 'German',
  ru: 'Russian',
  ar: 'Arabic',
  fr: 'French',
};

/** BCP 47 tags for Intl date/number formatting. */
export const LOCALE_TAGS: Record<ValidLocale, string> = {
  en: 'en-US',
  tr: 'tr-TR',
  de: 'de-DE',
  ru: 'ru-RU',
  ar: 'ar',
  fr: 'fr-FR',
};

const rtlLocales: ReadonlySet<string> = new Set(['ar']);

export function isRTL(locale: string): boolean {
  return rtlLocales.has(locale);
}

export function textDirection(locale: string): 'rtl' | 'ltr' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}

export function isValidLocale(value: unknown): value is ValidLocale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Narrows arbitrary stored/user input to a supported locale. */
export function toLocale(value: unknown): ValidLocale {
  return isValidLocale(value) ? value : defaultLocale;
}
