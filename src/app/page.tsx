'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ValidLocale, defaultLocale } from '@/i18n/settings';
import FeatureCard from '@/components/features/FeatureCard';
import HowItWorksStep from '@/components/features/HowItWorksStep';
import Hero3D from '@/components/Hero3D';

const features = [
  { key: 'ai', icon: '◎' },
  { key: 'ats', icon: '◇' },
  { key: 'templates', icon: '▤' },
  { key: 'multilingual', icon: '◉' },
];

const steps = [1, 2, 3, 4];

export default function HomePage() {
  const { data: session } = useSession();
  const [currentLocale, setCurrentLocale] = useState<ValidLocale>(defaultLocale);
  const { t } = useTranslation(currentLocale);

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as ValidLocale;
    if (savedLocale) setCurrentLocale(savedLocale);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="bg-stone-900 text-white relative overflow-hidden min-h-[600px] sm:min-h-[700px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative z-10">
              <p className="text-stone-400 text-sm font-medium uppercase tracking-wider mb-4">
                AI destekli CV
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6">
                {t('home.hero.title')}
              </h1>
              <p className="text-lg text-stone-300 mb-10 leading-relaxed">
                {t('home.hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                {session ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 bg-white text-stone-900 px-5 py-3 rounded font-medium hover:bg-stone-100 transition-colors"
                  >
                    {t('home.hero.dashboard')}
                    <span className="text-stone-500">→</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth/register"
                      className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-3 rounded font-medium hover:bg-teal-700 transition-colors"
                    >
                      {t('home.hero.cta')}
                    </Link>
                    <Link
                      href="/templates"
                      className="inline-flex items-center gap-2 border border-stone-600 text-white px-5 py-3 rounded font-medium hover:bg-stone-800 transition-colors"
                    >
                      Şablonları İncele
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden lg:block relative z-10 h-[500px]">
              <Hero3D />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-2xl font-semibold text-stone-900">25+</p>
              <p className="text-sm text-stone-500 mt-1">Profesyonel şablon</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-stone-900">6</p>
              <p className="text-sm text-stone-500 mt-1">Dil desteği</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-stone-900">%95</p>
              <p className="text-sm text-stone-500 mt-1">ATS uyumluluğu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
              {t('home.features.title')}
            </h2>
            <p className="text-stone-600 max-w-xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <FeatureCard key={f.key} featureKey={f.key} icon={f.icon} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
              {t('home.howItWorks.title')}
            </h2>
            <p className="text-stone-600 max-w-xl mx-auto">
              {t('home.howItWorks.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <HowItWorksStep key={step} step={step} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900 text-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto mb-8">
            {t('home.cta.description')}
          </p>
          {session ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-stone-900 px-5 py-3 rounded font-medium hover:bg-stone-100 transition-colors"
            >
              {t('home.hero.dashboard')}
              <span className="text-stone-500">→</span>
            </Link>
          ) : (
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-3 rounded font-medium hover:bg-teal-700 transition-colors"
            >
              {t('home.hero.cta')}
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
