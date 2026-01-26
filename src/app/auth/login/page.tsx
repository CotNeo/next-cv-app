'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) setError('Geçersiz e-posta veya şifre.');
      else router.push('/dashboard');
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 text-center">Giriş yap</h1>
          <p className="mt-2 text-center text-sm text-stone-600">
            Hesabın yok mu?{' '}
            <Link href="/auth/register" className="font-medium text-teal-700 hover:text-teal-800">
              Kayıt ol
            </Link>
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <label htmlFor="email" className="sr-only">E-posta</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded border border-stone-300 bg-white px-3 py-2.5 text-stone-900 placeholder-stone-500 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 sm:text-sm"
              placeholder="E-posta"
            />
            <label htmlFor="password" className="sr-only">Şifre</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded border border-stone-300 bg-white px-3 py-2.5 text-stone-900 placeholder-stone-500 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 sm:text-sm"
              placeholder="Şifre"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded bg-teal-700 px-3 py-2.5 text-sm font-medium text-white hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-1 disabled:opacity-50"
          >
            {isLoading ? 'Giriş yapılıyor…' : 'Giriş yap'}
          </button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-stone-50 px-2 text-stone-500">veya</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded border border-stone-300 bg-white px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-1 disabled:opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-4.013z" /></svg>
          Google ile giriş yap
        </button>
      </div>
    </div>
  );
}
