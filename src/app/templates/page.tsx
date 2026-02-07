'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TemplateThumbnail from '@/components/templates/TemplateThumbnail';
import { useTranslation } from '@/hooks/useTranslation';
import { ValidLocale, defaultLocale } from '@/i18n/settings';
import { templates, categories } from '@/data/templates';

function getCategoryLabel(name: string, t: (key: string) => string): string {
  return name === 'all' ? t('home.templates.categories.all') : t('home.templates.categories.' + name.toLowerCase());
}

export default function TemplatesPage() {
  const [currentLocale, setCurrentLocale] = useState<ValidLocale>(defaultLocale);
  const { t } = useTranslation(currentLocale);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('locale') as ValidLocale | null;
    if (saved) setCurrentLocale(saved);
  }, []);

  const filteredTemplates = templates.filter((tpl) => {
    const matchCat = selectedCategory === 'all' || tpl.category === selectedCategory;
    const matchSearch =
      !searchQuery.trim() ||
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-stone-900 text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            {t('home.templates.page.title')}
          </h1>
          <p className="text-stone-400 max-w-xl">
            {t('home.templates.page.subtitle').replace('{count}', String(templates.length))}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder={t('home.templates.searchPlaceholder')}
              className="w-full pl-10 pr-3 py-2.5 border border-stone-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600 text-stone-900 placeholder-stone-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCategory(c.name)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === c.name
                    ? 'bg-teal-700 text-white'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {getCategoryLabel(c.name, t)} ({c.count})
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-stone-600 mb-6">
          <span className="font-semibold text-teal-700">{filteredTemplates.length}</span>{' '}
          {t('home.templates.templatesLabel')}
          {selectedCategory !== 'all' && ` · ${getCategoryLabel(selectedCategory, t)}`}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredTemplates.map((tpl) => (
            <Link
              key={tpl.id}
              href={`/templates/${tpl.id}`}
              className="group rounded-lg border border-stone-200 bg-white overflow-hidden hover:border-teal-300 hover:shadow-md transition-all"
            >
              <div className="p-4 flex justify-center bg-stone-50/50">
                <TemplateThumbnail variant={tpl.id} />
              </div>
              <div className="p-4 pt-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-stone-900 group-hover:text-teal-700">
                    {(() => {
                      const key = `home.templates.items.${tpl.id}.name`;
                      const v = t(key);
                      return v === key ? tpl.name : v;
                    })()}
                  </h3>
                  {tpl.popular && (
                    <span className="text-xs font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      {t('home.templates.popular')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 line-clamp-2">
                  {(() => {
                    const key = `home.templates.items.${tpl.id}.description`;
                    const v = t(key);
                    return v === key ? tpl.description : v;
                  })()}
                </p>
                <span className="mt-2 inline-block text-xs font-medium text-teal-700 group-hover:text-teal-800">
                  {t('home.templates.preview')}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-16 rounded-lg border border-stone-200 bg-white">
            <p className="text-stone-500 mb-4">{t('home.templates.noResults')}</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-sm font-medium text-teal-700 hover:text-teal-800"
            >
              {t('home.templates.clearFilters')}
            </button>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-stone-600 mb-4">{t('home.templates.startWithoutTemplate')}</p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 rounded bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 transition-colors"
          >
            {t('home.templates.createNewCv')}
            <span className="text-stone-300">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
