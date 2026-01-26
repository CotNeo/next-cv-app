'use client';

import { Suspense, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import CVForm from '@/components/CVForm';
import TemplateThumbnail from '@/components/templates/TemplateThumbnail';
import type { TemplateVariant } from '@/components/templates/TemplateThumbnail';
import { getTemplateById, templates, categories } from '@/data/templates';

function TemplateHeader() {
  const searchParams = useSearchParams();
  const templateParam = searchParams.get('template');
  const template = templateParam ? getTemplateById(templateParam) : null;

  return (
    <p className="mt-1 text-stone-600">
      {template
        ? `${template.name} şablonu ile CV'nizi oluşturun.`
        : "CV'nizi oluşturmak için formu doldurun."}
    </p>
  );
}

function TemplateSelectorContent({ 
  onSelect, 
  initialTemplate 
}: { 
  onSelect: (templateId: TemplateVariant) => void;
  initialTemplate: TemplateVariant | null;
}) {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateVariant | null>(initialTemplate);

  const filteredTemplates = templates.filter((t) => {
    return selectedCategory === 'Tümü' || t.category === selectedCategory;
  });

  const handleTemplateSelect = (templateId: TemplateVariant) => {
    setSelectedTemplate(templateId);
    onSelect(templateId);
  };

  return (
    <div className="mb-8 rounded-lg border border-stone-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-stone-900 mb-4">CV Şablonu Seçin</h2>
      <p className="text-sm text-stone-600 mb-4">
        CV&apos;nizi oluşturmak için bir şablon seçin. Daha sonra değiştirebilirsiniz.
      </p>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
        {categories.map((c) => (
          <button
            key={c.name}
            onClick={() => setSelectedCategory(c.name)}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === c.name
                ? 'bg-teal-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {c.name} ({c.count})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
        {filteredTemplates.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTemplateSelect(t.id)}
            className={`group rounded-lg border-2 p-3 bg-white transition-all ${
              selectedTemplate === t.id
                ? 'border-teal-600 bg-teal-50 shadow-md'
                : 'border-stone-200 hover:border-teal-300 hover:shadow-sm'
            }`}
          >
            <div className="flex justify-center mb-2">
              <TemplateThumbnail variant={t.id} />
            </div>
            <p className={`text-xs font-medium text-center ${
              selectedTemplate === t.id ? 'text-teal-700' : 'text-stone-700'
            }`}>
              {t.name}
            </p>
            {t.popular && (
              <span className="block text-[10px] text-teal-600 text-center mt-1">Popüler</span>
            )}
          </button>
        ))}
      </div>

      {selectedTemplate && (
        <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
          <p className="text-sm text-teal-800">
            <span className="font-semibold">{getTemplateById(selectedTemplate)?.name}</span> şablonu seçildi.
            Formu doldurarak CV&apos;nizi oluşturabilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
}

function TemplateSelector({ onSelect }: { onSelect: (templateId: TemplateVariant) => void }) {
  const searchParams = useSearchParams();
  const templateParam = searchParams.get('template');
  const initialTemplate = templateParam ? (templateParam as TemplateVariant) : null;

  return <TemplateSelectorContent onSelect={onSelect} initialTemplate={initialTemplate} />;
}

function NewCVForm({ templateId }: { templateId: TemplateVariant | null }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 sm:p-8">
      <CVForm templateId={templateId || undefined} />
    </div>
  );
}

export default function NewCVPage() {
  const { status } = useSession();
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateVariant | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Read template from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const templateParam = urlParams.get('template');
    if (templateParam) {
      setSelectedTemplate(templateParam as TemplateVariant);
    }
  }, []);

  const handleTemplateSelect = (templateId: TemplateVariant) => {
    setSelectedTemplate(templateId);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('template', templateId);
    window.history.pushState({}, '', url.toString());
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="h-8 w-8 rounded-full border-2 border-stone-300 border-t-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900">Yeni CV Oluştur</h1>
          <Suspense fallback={<p className="mt-1 text-stone-600">CV&apos;nizi oluşturmak için formu doldurun.</p>}>
            <TemplateHeader />
          </Suspense>
        </div>

        <Suspense fallback={
          <div className="rounded-lg border border-stone-200 bg-white p-6">
            <div className="h-8 w-8 rounded-full border-2 border-stone-300 border-t-teal-600 animate-spin mx-auto" />
          </div>
        }>
          <TemplateSelector onSelect={handleTemplateSelect} />
        </Suspense>

        {selectedTemplate && (
          <Suspense fallback={
            <div className="rounded-lg border border-stone-200 bg-white p-6 sm:p-8">
              <div className="h-8 w-8 rounded-full border-2 border-stone-300 border-t-teal-600 animate-spin mx-auto" />
            </div>
          }>
            <NewCVForm templateId={selectedTemplate} />
          </Suspense>
        )}

        {!selectedTemplate && (
          <div className="rounded-lg border border-stone-200 bg-white p-8 text-center">
            <p className="text-stone-600 mb-4">
              CV formunu görmek için yukarıdan bir şablon seçin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
