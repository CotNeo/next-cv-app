'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import CVForm from '@/components/CVForm';
import TemplateThumbnail from '@/components/templates/TemplateThumbnail';
import type { TemplateVariant } from '@/components/templates/TemplateThumbnail';
import { getTemplateById, templates, categories } from '@/data/templates';
import { useTranslation } from '@/hooks/useTranslation';
import { ValidLocale, defaultLocale } from '@/i18n/settings';

function TemplateHeader({ t }: { t: (key: string) => string }) {
  const searchParams = useSearchParams();
  const templateParam = searchParams.get('template');
  const template = templateParam ? getTemplateById(templateParam) : null;

  return (
    <p className="mt-1 text-stone-600">
      {template
        ? t('dashboard.new.withTemplate').replace('{name}', t('templates.items.' + template.id + '.name'))
        : t('dashboard.new.fillForm')}
    </p>
  );
}

function TemplateSelectorContent({
  onSelect,
  initialTemplate,
  t,
}: {
  onSelect: (templateId: TemplateVariant) => void;
  initialTemplate: TemplateVariant | null;
  t: (key: string) => string;
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateVariant | null>(initialTemplate);

  const filteredTemplates = templates.filter((tm) => {
    return selectedCategory === 'all' || tm.category === selectedCategory;
  });

  const handleTemplateSelect = (templateId: TemplateVariant) => {
    setSelectedTemplate(templateId);
    onSelect(templateId);
  };

  return (
    <div className="mb-8 rounded-lg border border-stone-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-stone-900 mb-4">{t('dashboard.new.selectTemplate')}</h2>
      <p className="text-sm text-stone-600 mb-4">
        {t('dashboard.new.selectTemplateHint')}
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
            {c.name === 'all' ? t('templates.categories.all') : t('templates.categories.' + c.name.toLowerCase())} ({c.count})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
        {filteredTemplates.map((tm) => (
          <button
            key={tm.id}
            onClick={() => handleTemplateSelect(tm.id)}
            className={`group rounded-lg border-2 p-3 bg-white transition-all ${
              selectedTemplate === tm.id
                ? 'border-teal-600 bg-teal-50 shadow-md'
                : 'border-stone-200 hover:border-teal-300 hover:shadow-sm'
            }`}
          >
            <div className="flex justify-center mb-2">
              <TemplateThumbnail variant={tm.id} />
            </div>
            <p className={`text-xs font-medium text-center ${
              selectedTemplate === tm.id ? 'text-teal-700' : 'text-stone-700'
            }`}>
              {t('templates.items.' + tm.id + '.name')}
            </p>
            {tm.popular && (
              <span className="block text-[10px] text-teal-600 text-center mt-1">{t('templates.popular')}</span>
            )}
          </button>
        ))}
      </div>

      {selectedTemplate && (
        <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
          <p className="text-sm text-teal-800">
            {t('dashboard.new.templateSelectedMessage').replace('{name}', t('templates.items.' + selectedTemplate + '.name'))}
          </p>
        </div>
      )}
    </div>
  );
}

function TemplateSelector({ onSelect, t }: { onSelect: (templateId: TemplateVariant) => void; t: (key: string) => string }) {
  const searchParams = useSearchParams();
  const templateParam = searchParams.get('template');
  const initialTemplate = templateParam ? (templateParam as TemplateVariant) : null;

  return <TemplateSelectorContent onSelect={onSelect} initialTemplate={initialTemplate} t={t} />;
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
  const [currentLocale, setCurrentLocale] = useState<ValidLocale>(defaultLocale);
  const { t } = useTranslation(currentLocale);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateVariant | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('locale') as ValidLocale | null;
    if (saved) setCurrentLocale(saved);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const templateParam = urlParams.get('template');
    if (templateParam) {
      setSelectedTemplate(templateParam as TemplateVariant);
    }
  }, []);

  const handleTemplateSelect = (templateId: TemplateVariant) => {
    setSelectedTemplate(templateId);
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
          <h1 className="text-2xl font-bold text-stone-900">{t('dashboard.new.title')}</h1>
          <Suspense fallback={<p className="mt-1 text-stone-600">{t('dashboard.new.fillForm')}</p>}>
            <TemplateHeader t={t} />
          </Suspense>
        </div>

        <Suspense fallback={
          <div className="rounded-lg border border-stone-200 bg-white p-6">
            <div className="h-8 w-8 rounded-full border-2 border-stone-300 border-t-teal-600 animate-spin mx-auto" />
          </div>
        }>
          <TemplateSelector onSelect={handleTemplateSelect} t={t} />
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
              {t('dashboard.new.selectTemplateHintForm')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
