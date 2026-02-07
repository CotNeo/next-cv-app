'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { ValidLocale, defaultLocale } from '@/i18n/settings';

type PlanId = 'free' | 'payAsYouGo' | 'monthly';

const plans: {
  id: PlanId;
  price: string;
  periodKey: null | 'perMonth' | 'perCv';
  featureKeys: string[];
  buttonLink: string;
  popular: boolean;
}[] = [
  {
    id: 'free',
    price: '$0',
    periodKey: null,
    featureKeys: ['oneFreeCv', 'basicTemplates', 'pdfExport', 'emailSupport', 'basicAts'],
    buttonLink: '/auth/register',
    popular: false,
  },
  {
    id: 'payAsYouGo',
    price: '$0.50',
    periodKey: 'perCv',
    featureKeys: [
      'allTemplates',
      'unlimitedCvs',
      'pdfExport',
      'emailSupport',
      'advancedAts',
      'aiSuggestions',
      'customBranding',
    ],
    buttonLink: '/auth/register',
    popular: false,
  },
  {
    id: 'monthly',
    price: '$3',
    periodKey: 'perMonth',
    featureKeys: [
      'allTemplates',
      'unlimitedCvs',
      'pdfExport',
      'prioritySupport',
      'advancedAts',
      'aiSuggestions',
      'customBranding',
      'cloudStorage',
      'versionHistory',
      'collaborationTools',
    ],
    buttonLink: '/auth/register',
    popular: true,
  },
];

const faqKeys: { q: string; a: string }[] = [
  { q: 'switchPlansQ', a: 'switchPlansA' },
  { q: 'paymentMethodsQ', a: 'paymentMethodsA' },
  { q: 'freeTrialQ', a: 'freeTrialA' },
  { q: 'cancelAnytimeQ', a: 'cancelAnytimeA' },
];

export default function PricingPage() {
  const [currentLocale, setCurrentLocale] = useState<ValidLocale>(defaultLocale);
  const { t } = useTranslation(currentLocale);

  useEffect(() => {
    const saved = localStorage.getItem('locale') as ValidLocale | null;
    if (saved) setCurrentLocale(saved);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">
            {t('home.pricing.page.title')}
          </h1>
          <p className="text-xl text-stone-600">
            {t('home.pricing.page.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${
                plan.popular ? 'ring-2 ring-teal-600' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-teal-600 text-white text-center py-1">
                  {t('home.pricing.mostPopular')}
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-stone-900 mb-2">
                  {t(`home.pricing.plans.${plan.id}.name`)}
                </h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-stone-900">
                    {plan.price}
                  </span>
                  {plan.periodKey && (
                    <span className="text-stone-500 ml-1">
                      {t(`home.pricing.${plan.periodKey}`)}
                    </span>
                  )}
                </div>
                <p className="text-stone-600 mb-6">
                  {t(`home.pricing.plans.${plan.id}.description`)}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.featureKeys.map((key) => (
                    <li key={key} className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-stone-800 font-medium">
                        {t(`home.pricing.features.${key}`)}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.buttonLink}
                  className={`block w-full text-center px-4 py-2 rounded-md text-sm font-medium ${
                    plan.popular
                      ? 'bg-teal-700 text-white hover:bg-teal-800'
                      : 'bg-stone-100 text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  {t(`home.pricing.plans.${plan.id}.buttonText`)}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-stone-900 text-center mb-8">
            {t('home.pricing.faq.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqKeys.map(({ q, a }) => (
              <div key={q}>
                <h3 className="text-lg font-medium text-stone-900 mb-2">
                  {t(`home.pricing.faq.${q}`)}
                </h3>
                <p className="text-stone-600">
                  {t(`home.pricing.faq.${a}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
