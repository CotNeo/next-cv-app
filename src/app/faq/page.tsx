'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { ValidLocale, defaultLocale } from '@/i18n/settings';

const FAQ_ITEM_COUNT = 10;

export default function FAQPage() {
  const [currentLocale, setCurrentLocale] = useState<ValidLocale>(defaultLocale);
  const { t } = useTranslation(currentLocale);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('locale') as ValidLocale | null;
    if (saved) setCurrentLocale(saved);
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {t('faq.title')}
          </h1>
          <p className="text-lg text-stone-400 leading-relaxed">
            {t('faq.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {Array.from({ length: FAQ_ITEM_COUNT }, (_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-stone-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-stone-50 transition-colors"
                >
                  <span className="font-semibold text-stone-900 pr-4">
                    {t(`faq.items.${index}.question`)}
                  </span>
                  <svg
                    className={`w-5 h-5 text-stone-500 flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-stone-600 leading-relaxed">
                      {t(`faq.items.${index}.answer`)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-teal-50 border border-teal-200 rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold text-stone-900 mb-2">
              {t('faq.cta.title')}
            </h2>
            <p className="text-stone-600 mb-4">
              {t('faq.cta.description')}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded bg-teal-600 px-5 py-3 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
            >
              {t('faq.cta.button')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
