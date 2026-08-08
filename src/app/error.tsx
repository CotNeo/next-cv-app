'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    // The digest is the only handle on the server-side stack in production.
    console.error('Unhandled page error:', error.digest ?? error.message);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-stone-900">{t('errors.unexpected')}</h1>
      <p className="mt-2 text-stone-600 max-w-md">{t('errors.unexpectedHint')}</p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded bg-teal-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-800"
        >
          {t('errors.retry')}
        </button>
        <Link
          href="/"
          className="rounded border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          {t('errors.goHome')}
        </Link>
      </div>
      {error.digest && <p className="mt-6 text-xs text-stone-400">ref: {error.digest}</p>}
    </div>
  );
}
