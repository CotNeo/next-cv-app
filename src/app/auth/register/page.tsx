'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Kayıt başarısız.');
      }
      router.push('/auth/login?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 text-center">Hesap oluştur</h1>
          <p className="mt-2 text-center text-sm text-stone-600">
            Zaten hesabın var mı?{' '}
            <Link href="/auth/login" className="font-medium text-teal-700 hover:text-teal-800">
              Giriş yap
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
            <label htmlFor="name" className="sr-only">Ad Soyad</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded border border-stone-300 bg-white px-3 py-2.5 text-stone-900 placeholder-stone-500 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 sm:text-sm"
              placeholder="Ad Soyad"
            />
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
              autoComplete="new-password"
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
            {isLoading ? 'Hesap oluşturuluyor…' : 'Hesap oluştur'}
          </button>
        </form>
      </div>
    </div>
  );
}
