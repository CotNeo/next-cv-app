'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { ValidLocale, defaultLocale } from '@/i18n/settings';

export default function TermsPage() {
  const [currentLocale, setCurrentLocale] = useState<ValidLocale>(defaultLocale);
  const { t } = useTranslation(currentLocale);

  useEffect(() => {
    const saved = localStorage.getItem('locale') as ValidLocale | null;
    if (saved) setCurrentLocale(saved);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {t('terms.title')}
          </h1>
          <p className="text-lg text-stone-400 leading-relaxed">
            {t('terms.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg border border-stone-200 p-8 sm:p-12 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.acceptance.title')}
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {t('terms.acceptance.content')}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.account.title')}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('terms.account.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
                <li>{t('terms.account.item1')}</li>
                <li>{t('terms.account.item2')}</li>
                <li>{t('terms.account.item3')}</li>
                <li>{t('terms.account.item4')}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.use.title')}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('terms.use.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
                <li>{t('terms.use.item1')}</li>
                <li>{t('terms.use.item2')}</li>
                <li>{t('terms.use.item3')}</li>
                <li>{t('terms.use.item4')}</li>
                <li>{t('terms.use.item5')}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.content.title')}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('terms.content.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
                <li>{t('terms.content.item1')}</li>
                <li>{t('terms.content.item2')}</li>
                <li>{t('terms.content.item3')}</li>
                <li>{t('terms.content.item4')}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.intellectual.title')}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('terms.intellectual.content')}
              </p>
              <p className="text-stone-600 leading-relaxed">
                {t('terms.intellectual.userContent')}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.payment.title')}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('terms.payment.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
                <li>{t('terms.payment.item1')}</li>
                <li>{t('terms.payment.item2')}</li>
                <li>{t('terms.payment.item3')}</li>
                <li>{t('terms.payment.item4')}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.termination.title')}
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {t('terms.termination.content')}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.disclaimer.title')}
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {t('terms.disclaimer.content')}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.changes.title')}
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {t('terms.changes.content')}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('terms.contact.title')}
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {t('terms.contact.content')}
              </p>
              <p className="text-stone-600 mt-2">
                <Link href="/contact" className="text-teal-600 hover:underline">
                  {t('terms.contact.link')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
