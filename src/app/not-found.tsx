'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-stone-300">404</p>
      <h1 className="mt-4 text-2xl font-bold text-stone-900">{t('errors.notFound')}</h1>
      <p className="mt-2 text-stone-600 max-w-md">{t('errors.notFoundHint')}</p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded bg-teal-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-800"
      >
        {t('errors.goHome')}
      </Link>
    </div>
  );
}
