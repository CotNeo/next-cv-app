import { useCallback } from 'react';
import { defaultLocale, ValidLocale } from '@/i18n/settings';

// Import all translations
import en from '@/i18n/translations/en.json';
import tr from '@/i18n/translations/tr.json';
import de from '@/i18n/translations/de.json';
import ru from '@/i18n/translations/ru.json';
import ar from '@/i18n/translations/ar.json';
import fr from '@/i18n/translations/fr.json';

type TranslationsType = typeof en;

const translations: Record<ValidLocale, TranslationsType> = {
  en,
  tr,
  de,
  ru,
  ar,
  fr,
};

export function useTranslation(locale: ValidLocale = defaultLocale) {
  const t = useCallback((key: string) => {
    const keys = key.split('.');
    let value: unknown = translations[locale];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in (value as object)) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  }, [locale]);

  const changeLocale = useCallback((newLocale: ValidLocale) => {
    // Store the selected locale in localStorage
    localStorage.setItem('locale', newLocale);
    // Reload the page to apply the new locale
    window.location.reload();
  }, []);

  return { t, locale, changeLocale };
} 