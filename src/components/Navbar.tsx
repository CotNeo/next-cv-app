'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { defaultLocale, languageNames, locales, type ValidLocale } from '@/i18n/settings';

function getStoredLocale(): ValidLocale {
  if (typeof window === 'undefined') return defaultLocale;
  const stored = localStorage.getItem('locale');
  if (stored && locales.includes(stored as ValidLocale)) return stored as ValidLocale;
  return defaultLocale;
}

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [locale, setLocale] = useState<ValidLocale>(defaultLocale);
  const { t, changeLocale } = useTranslation(locale);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setLocale(getStoredLocale());
  }, []);

  const handleLocaleChange = (newLocale: ValidLocale) => {
    changeLocale(newLocale);
  };

  const isActive = (path: string) => pathname === path;

  const linkClass = (active: boolean) =>
    `text-sm font-medium transition-colors ${
      active ? 'text-teal-700' : 'text-stone-600 hover:text-stone-900'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-stone-900 hover:text-stone-700">
              <div className="w-8 h-8 bg-teal-700 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-semibold text-stone-900">CV Builder</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className={linkClass(isActive('/'))}>{t('nav.home')}</Link>
              <Link href="/templates" className={linkClass(isActive('/templates'))}>{t('nav.templates')}</Link>
              <Link href="/pricing" className={linkClass(isActive('/pricing'))}>{t('nav.pricing')}</Link>
              <Link href="/about" className={linkClass(isActive('/about'))}>{t('nav.about')}</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={locale}
              onChange={(e) => handleLocaleChange(e.target.value as ValidLocale)}
              className="text-sm text-stone-600 bg-stone-50 border border-stone-200 rounded px-3 py-1.5 cursor-pointer hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-1"
              aria-label="Select language"
            >
              {Object.entries(languageNames).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>

            {session ? (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/dashboard" className={linkClass(false)}>{t('nav.dashboard')}</Link>
                <button onClick={() => signOut()} className="text-sm font-medium text-stone-600 hover:text-stone-900">
                  {t('nav.signOut')}
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/auth/login" className={linkClass(false)}>{t('nav.signIn')}</Link>
                <Link
                  href="/auth/register"
                  className="bg-teal-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-teal-800"
                >
                  {t('nav.getStarted')}
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200 space-y-1">
            <Link href="/" className={`block py-2 ${linkClass(isActive('/'))}`} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.home')}</Link>
            <Link href="/templates" className={`block py-2 ${linkClass(isActive('/templates'))}`} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.templates')}</Link>
            <Link href="/pricing" className={`block py-2 ${linkClass(isActive('/pricing'))}`} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.pricing')}</Link>
            <Link href="/about" className={`block py-2 ${linkClass(isActive('/about'))}`} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.about')}</Link>
            {session ? (
              <>
                <Link href="/dashboard" className={`block py-2 ${linkClass(false)}`} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.dashboard')}</Link>
                <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-sm font-medium text-stone-600 hover:text-stone-900">{t('nav.signOut')}</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className={`block py-2 ${linkClass(false)}`} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.signIn')}</Link>
                <Link href="/auth/register" className="block py-2 text-sm font-medium text-teal-700 hover:text-teal-800" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.getStarted')}</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
