'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface CV {
  _id: string;
  title: string;
  createdAt: string;
  atsScore?: number;
}

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [cvs, setCVs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchCVs();
    }
  }, [status, router]);

  const fetchCVs = async () => {
    try {
      const res = await fetch('/api/cv');
      if (!res.ok) throw new Error('CV\'ler yüklenemedi');
      const data = await res.json();
      setCVs(data);
    } catch (e) {
      console.error('CV yükleme hatası:', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="h-8 w-8 rounded-full border-2 border-stone-300 border-t-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold text-stone-900">CV&apos;lerim</h1>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center justify-center rounded bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 transition-colors"
          >
            Yeni CV Oluştur
          </Link>
        </div>
        {cvs.length === 0 ? (
          <div className="rounded-lg border border-stone-200 bg-white py-16 text-center">
            <p className="text-stone-500 text-sm">Henüz CV yok.</p>
            <p className="mt-1 text-sm text-stone-400">Yeni bir CV oluşturmak için yukarıdaki butonu kullan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map((cv) => (
              <div
                key={cv._id}
                className="rounded-lg border border-stone-200 bg-white overflow-hidden hover:border-stone-300 transition-colors"
              >
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-stone-900">{cv.title}</h2>
                  <p className="mt-1 text-sm text-stone-500">
                    {new Date(cv.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="flex items-center justify-between px-5 py-4 border-t border-stone-100 bg-stone-50/50">
                  {cv.atsScore != null && (
                    <span className="text-sm text-stone-600">ATS: {cv.atsScore}</span>
                  )}
                  {!cv.atsScore && <span />}
                  <Link
                    href={`/dashboard/${cv._id}`}
                    className="text-sm font-medium text-teal-700 hover:text-teal-800"
                  >
                    Düzenle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
