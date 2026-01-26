'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CVForm from '@/components/CVForm';

export default function NewCVPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="h-8 w-8 rounded-full border-2 border-stone-300 border-t-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900">Yeni CV Oluştur</h1>
          <p className="mt-1 text-stone-600">
            CV&apos;nizi oluşturmak için formu doldurun.
          </p>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-6 sm:p-8">
          <CVForm />
        </div>
      </div>
    </div>
  );
} 