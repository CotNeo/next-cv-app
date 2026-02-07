'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { ValidLocale, defaultLocale } from '@/i18n/settings';

export default function PrivacyPage() {
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
            {t('privacy.title')}
          </h1>
          <p className="text-lg text-stone-400 leading-relaxed">
            {t('privacy.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg border border-stone-200 p-8 sm:p-12 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('privacy.intro.title')}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('privacy.intro.content')}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('privacy.data.title')}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('privacy.data.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
                <li>{t('privacy.data.item1')}</li>
                <li>{t('privacy.data.item2')}</li>
                <li>{t('privacy.data.item3')}</li>
                <li>{t('privacy.data.item4')}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('privacy.use.title')}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('privacy.use.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
                <li>{t('privacy.use.item1')}</li>
                <li>{t('privacy.use.item2')}</li>
                <li>{t('privacy.use.item3')}</li>
                <li>{t('privacy.use.item4')}</li>
                <li>{t('privacy.use.item5')}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('privacy.sharing.title')}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('privacy.sharing.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
                <li>{t('privacy.sharing.item1')}</li>
                <li>{t('privacy.sharing.item2')}</li>
                <li>{t('privacy.sharing.item3')}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('privacy.security.title')}
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {t('privacy.security.content')}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('privacy.rights.title')}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                {t('privacy.rights.content')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
                <li>{t('privacy.rights.item1')}</li>
                <li>{t('privacy.rights.item2')}</li>
                <li>{t('privacy.rights.item3')}</li>
                <li>{t('privacy.rights.item4')}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('privacy.cookies.title')}
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {t('privacy.cookies.content')}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('privacy.changes.title')}
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {t('privacy.changes.content')}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">
                {t('privacy.contact.title')}
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {t('privacy.contact.content')}
              </p>
              <p className="text-stone-600 mt-2">
                <Link href="/contact" className="text-teal-600 hover:underline">
                  {t('privacy.contact.link')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
