'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ValidLocale, defaultLocale } from '@/i18n/settings';
import FeatureCard from '@/components/features/FeatureCard';
import HowItWorksStep from '@/components/features/HowItWorksStep';
import TestimonialCard from '@/components/features/TestimonialCard';
import LanguageSelector from '@/components/layout/LanguageSelector';

const features = [
  {
    key: 'ai',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    key: 'ats',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    key: 'templates',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    key: 'multilingual',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
  },
];

const steps = [1, 2, 3, 4];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    company: 'TechCorp',
    content: 'CV Builder helped me create a professional CV that landed me multiple job interviews. The AI suggestions were incredibly helpful!',
    image: '/testimonials/sarah.jpg',
  },
  {
    name: 'Michael Chen',
    role: 'Marketing Manager',
    company: 'Growth Inc.',
    content: 'The templates are modern and professional. I was able to create a standout CV in minutes.',
    image: '/testimonials/michael.jpg',
  },
  {
    name: 'Emma Wilson',
    role: 'Data Scientist',
    company: 'DataFlow',
    content: 'The ATS optimization feature is a game-changer. My CV now gets past automated screening systems.',
    image: '/testimonials/emma.jpg',
  },
];

export default function HomePage() {
  const { data: session } = useSession();
  const [currentLocale, setCurrentLocale] = useState<ValidLocale>(defaultLocale);
  const { t } = useTranslation(currentLocale);

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as ValidLocale;
    if (savedLocale) {
      setCurrentLocale(savedLocale);
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              {t('home.hero.title')}
            </h1>
            <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">
              {t('home.hero.description')}
            </p>
            <div className="mt-10">
              {session ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
                >
                  {t('home.hero.dashboard')}
                </Link>
              ) : (
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
                >
                  {t('home.hero.cta')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              {t('home.features.title')}
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              {t('home.features.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <FeatureCard
                key={feature.key}
                featureKey={feature.key}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              {t('home.howItWorks.title')}
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              {t('home.howItWorks.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <HowItWorksStep key={step} step={step} />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              {t('home.testimonials.title')}
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              {t('home.testimonials.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.name}
                {...testimonial}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              {t('home.cta.title')}
            </h2>
            <p className="mt-4 text-xl text-indigo-100">
              {t('home.cta.description')}
            </p>
            <div className="mt-8">
              {session ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  {t('home.hero.dashboard')}
                </Link>
              ) : (
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  {t('home.hero.cta')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
