'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { defaultLocale, isValidLocale, textDirection, type ValidLocale } from '@/i18n/settings';

const STORAGE_KEY = 'locale';

interface LocaleContextValue {
  locale: ValidLocale;
  setLocale: (locale: ValidLocale) => void;
  /** False until the stored preference has been read on the client. */
  ready: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function detectLocale(): ValidLocale {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isValidLocale(stored)) return stored;

  for (const candidate of window.navigator.languages ?? []) {
    const base = candidate.split('-')[0];
    if (isValidLocale(base)) return base;
  }
  return defaultLocale;
}

/**
 * Holds the interface language for the whole app.
 *
 * The locale is resolved on the client after hydration — the server has no way
 * to know the stored preference, so rendering it directly would mismatch. Once
 * resolved it is applied to `<html lang>` and `<html dir>`, which is what makes
 * Arabic render right-to-left and lets screen readers pick the right voice.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<ValidLocale>(defaultLocale);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(detectLocale());
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = textDirection(locale);
  }, [locale]);

  const setLocale = useCallback((next: ValidLocale) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    // No reload: every consumer reads the locale through this context.
    setLocaleState(next);
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, ready }),
    [locale, setLocale, ready]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used inside a LocaleProvider');
  }
  return context;
}
