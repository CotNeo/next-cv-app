'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

/** NextAuth error codes that deserve a more specific explanation. */
const AUTH_ERROR_KEYS: Record<string, string> = {
  CredentialsSignin: 'auth.login.invalidCredentials',
  OAuthAccountNotLinked: 'auth.error.accountNotLinked',
  AccessDenied: 'auth.error.accessDenied',
  Configuration: 'auth.error.configuration',
};

function AuthErrorContent() {
  const { t } = useTranslation();
  const params = useSearchParams();
  const code = params.get('error') ?? '';
  const detailKey = AUTH_ERROR_KEYS[code];

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-stone-900">{t('errors.authTitle')}</h1>
      <p className="mt-2 text-stone-600 max-w-md">
        {detailKey ? t(detailKey) : t('errors.authHint')}
      </p>
      <Link
        href="/auth/login"
        className="mt-6 inline-flex items-center rounded bg-teal-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-800"
      >
        {t('errors.backToLogin')}
      </Link>
      {code && <p className="mt-6 text-xs text-stone-400">code: {code}</p>}
    </div>
  );
}

export default function AuthErrorPage() {
  // useSearchParams needs a Suspense boundary to keep the route prerenderable.
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <AuthErrorContent />
    </Suspense>
  );
}
