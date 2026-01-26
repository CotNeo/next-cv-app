'use client';

import { use } from 'react';
import Link from 'next/link';
import TemplatePreview from '@/components/templates/TemplatePreview';
import { getTemplateById } from '@/data/templates';
export default function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const template = getTemplateById(id);

  if (!template) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4">
        <h1 className="text-xl font-bold text-stone-900 mb-2">Şablon bulunamadı</h1>
        <p className="text-stone-500 mb-4">Geçersiz veya mevcut olmayan şablon.</p>
        <Link
          href="/templates"
          className="text-teal-700 font-medium hover:text-teal-800"
        >
          ← Şablonlara dön
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-stone-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/templates"
            className="inline-flex items-center gap-1 text-stone-400 hover:text-white text-sm font-medium mb-4"
          >
            ← Şablonlara dön
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold">{template.name}</h1>
            {template.popular && (
              <span className="text-xs font-medium text-amber-400 bg-amber-900/50 px-2 py-1 rounded">
                Popüler
              </span>
            )}
            <span className="text-sm text-stone-400">{template.category}</span>
          </div>
          <p className="text-stone-400 max-w-xl">{template.description}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          <div className="flex-shrink-0 flex justify-center lg:justify-start">
            <TemplatePreview variant={template.id} />
          </div>
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-stone-200 p-6 shadow-sm">
              <h2 className="font-semibold text-stone-900 mb-2">Bu şablonu kullan</h2>
              <p className="text-sm text-stone-500 mb-4">
                Seçtiğiniz şablonda yeni bir CV oluşturmak için aşağıdaki butona tıklayın.
              </p>
              <Link
                href={`/dashboard/new?template=${template.id}`}
                className="inline-flex items-center justify-center gap-2 rounded bg-teal-700 px-5 py-3 text-sm font-medium text-white hover:bg-teal-800 transition-colors"
              >
                Bu şablonla CV oluştur
                <span className="text-stone-300">→</span>
              </Link>
            </div>
            <div className="mt-6">
              <Link
                href="/templates"
                className="text-sm font-medium text-stone-500 hover:text-stone-700"
              >
                Tüm şablonları görüntüle
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
