'use client';

import { use, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import CVForm, { type CVFormData } from '@/components/CVForm';
import CVRender from '@/components/cv/CVRender';
import TemplateThumbnail from '@/components/templates/TemplateThumbnail';
import Link from 'next/link';
import type { TemplateVariant } from '@/components/templates/TemplateThumbnail';
import { getTemplateById, templates, categories } from '@/data/templates';

interface CV {
  _id: string;
  title: string;
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    profilePhoto?: string;
  };
  summary?: string;
  workExperience?: Array<{
    company?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  education?: Array<{
    institution?: string;
    degree?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
  }>;
  skills?: string[];
  languages?: Array<{ language?: string; level?: string }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string | Date;
    expiryDate?: string | Date;
    credentialId?: string;
    credentialUrl?: string;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
    technologies?: string[];
    url?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    isCurrent?: boolean;
  }>;
  references?: Array<{
    name?: string;
    position?: string;
    company?: string;
    email?: string;
    phone?: string;
  }>;
  atsScore?: number;
  aiSuggestions?: string[];
  templateId?: string;
  shareToken?: string;
  isPublic?: boolean;
  createdAt: string;
}

function toYyyyMmDd(val: string | Date | undefined): string {
  if (!val) return '';
  const d = typeof val === 'string' ? new Date(val) : val;
  return d.toISOString().slice(0, 10);
}

function TemplateSelectorComponent({
  currentTemplate,
  onSelect,
}: {
  currentTemplate: TemplateVariant;
  onSelect: (templateId: TemplateVariant) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  const filteredTemplates = templates.filter((t) => {
    return selectedCategory === 'Tümü' || t.category === selectedCategory;
  });

  return (
    <div className="mt-4">
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
            onClick={() => onSelect(t.id)}
            className={`group rounded-lg border-2 p-3 bg-white transition-all ${
              currentTemplate === t.id
                ? 'border-teal-600 bg-teal-50 shadow-md'
                : 'border-stone-200 hover:border-teal-300 hover:shadow-sm'
            }`}
          >
            <div className="flex justify-center mb-2">
              <TemplateThumbnail variant={t.id} />
            </div>
            <p className={`text-xs font-medium text-center ${
              currentTemplate === t.id ? 'text-teal-700' : 'text-stone-700'
            }`}>
              {t.name}
            </p>
            {t.popular && (
              <span className="block text-[10px] text-teal-600 text-center mt-1">Popüler</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function cvToFormData(cv: CV): CVFormData {
  const we = cv.workExperience ?? [];
  const edu = cv.education ?? [];
  const sk = cv.skills ?? [];
  const lang = cv.languages ?? [];
  const certs = cv.certifications ?? [];
  const projs = cv.projects ?? [];
  const refs = cv.references ?? [];
  return {
    title: cv.title ?? '',
    personalInfo: {
      name: cv.personalInfo?.name ?? '',
      email: cv.personalInfo?.email ?? '',
      phone: cv.personalInfo?.phone ?? '',
      location: cv.personalInfo?.location ?? '',
      website: cv.personalInfo?.website ?? '',
      linkedin: cv.personalInfo?.linkedin ?? '',
      profilePhoto: cv.personalInfo?.profilePhoto ?? '',
    },
    summary: cv.summary ?? '',
    workExperience:
      we.length > 0
        ? we.map((e) => ({
            company: e.company ?? '',
            position: e.position ?? '',
            startDate: toYyyyMmDd(e.startDate),
            endDate: toYyyyMmDd(e.endDate),
            description: e.description ?? '',
            isCurrent: (e as { isCurrent?: boolean }).isCurrent ?? false,
          }))
        : [
            {
              company: '',
              position: '',
              startDate: '',
              endDate: '',
              description: '',
            },
          ],
    education:
      edu.length > 0
        ? edu.map((e) => ({
            institution: e.institution ?? '',
            degree: e.degree ?? '',
            field: e.field ?? '',
            startDate: toYyyyMmDd(e.startDate),
            endDate: toYyyyMmDd(e.endDate),
            isCurrent: (e as { isCurrent?: boolean }).isCurrent ?? false,
          }))
        : [
            {
              institution: '',
              degree: '',
              field: '',
              startDate: '',
              endDate: '',
            },
          ],
    skills: sk.length > 0 ? sk : [''],
    languages:
      lang.length > 0
        ? lang.map((l) => ({
            language: l.language ?? '',
            level: l.level ?? '',
          }))
        : [{ language: '', level: '' }],
    certifications:
      certs.length > 0
        ? certs.map((c) => ({
            name: c.name ?? '',
            issuer: c.issuer ?? '',
            date: c.date ? toYyyyMmDd(c.date) : '',
            expiryDate: c.expiryDate ? toYyyyMmDd(c.expiryDate) : '',
            credentialId: c.credentialId ?? '',
            credentialUrl: c.credentialUrl ?? '',
          }))
        : [],
    projects:
      projs.length > 0
        ? projs.map((p) => ({
            name: p.name ?? '',
            description: p.description ?? '',
            technologies: p.technologies ?? [],
            url: p.url ?? '',
            startDate: p.startDate ? toYyyyMmDd(p.startDate) : '',
            endDate: p.endDate ? toYyyyMmDd(p.endDate) : '',
            isCurrent: p.isCurrent ?? false,
          }))
        : [],
    references:
      refs.length > 0
        ? refs.map((r) => ({
            name: r.name ?? '',
            position: r.position ?? '',
            company: r.company ?? '',
            email: r.email ?? '',
            phone: r.phone ?? '',
          }))
        : [],
  };
}

export default function CVDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cv, setCV] = useState<CV | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [expandedSuggestions, setExpandedSuggestions] = useState<boolean[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateVariant | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const fetchCV = useCallback(async () => {
    try {
      const res = await fetch(`/api/cv/${id}`);
      if (!res.ok) throw new Error('Failed to fetch CV');
      const data = await res.json();
      setCV(data);
      setSelectedTemplate((data.templateId as TemplateVariant) || 'modern');
      if (data.shareToken) {
        setShareLink(`${window.location.origin}/cv/${data.shareToken}`);
      } else {
        setShareLink(null);
      }
      if (data.aiSuggestions) {
        setExpandedSuggestions(new Array(data.aiSuggestions.length).fill(false));
      }
    } catch (e) {
      console.error('Fetch CV error:', e);
      setCV(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (status === 'authenticated') {
      setIsLoading(true);
      fetchCV();
    }
  }, [status, router, fetchCV]);

  const handleSubmit = async (data: CVFormData) => {
    if (!cv) return;
    try {
      const res = await fetch(`/api/cv/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          templateId: selectedTemplate || cv.templateId || 'modern',
        }),
      });
      if (!res.ok) throw new Error('Failed to update CV');
      const updated = await res.json();
      setCV(updated);
      setSelectedTemplate((updated.templateId as TemplateVariant) || 'modern');
      setIsEditing(false);
      setShowTemplateSelector(false);
      toast.success('CV başarıyla güncellendi');
    } catch (e) {
      console.error('Update CV error:', e);
      toast.error('CV güncellenirken bir hata oluştu');
    }
  };

  const handleATSReview = async () => {
    try {
      const res = await fetch(`/api/cv/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ats-review' }),
      });
      if (!res.ok) throw new Error('ATS review failed');
      const text = await res.json();
      setCV((prev) =>
        prev ? { ...prev, aiSuggestions: [text] } : null
      );
    } catch (e) {
      console.error('ATS review error:', e);
    }
  };

  const handleTranslate = async (targetLanguage: string) => {
    try {
      toast.loading('CV çevriliyor...', { id: 'translate' });
      const res = await fetch(`/api/cv/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'translate',
          data: { targetLanguage },
        }),
      });
      if (!res.ok) throw new Error('Translate failed');
      await fetchCV();
      toast.success('CV başarıyla çevrildi', { id: 'translate' });
    } catch (e) {
      console.error('Translate error:', e);
      toast.error('CV çevrilirken bir hata oluştu', { id: 'translate' });
    }
  };

  const handleImprove = async () => {
    try {
      toast.loading('CV iyileştiriliyor...', { id: 'improve' });
      const res = await fetch(`/api/cv/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'improve' }),
      });
      if (!res.ok) throw new Error('Improve failed');
      await fetchCV();
      toast.success('CV başarıyla iyileştirildi', { id: 'improve' });
    } catch (e) {
      console.error('Improve error:', e);
      toast.error('CV iyileştirilirken bir hata oluştu', { id: 'improve' });
    }
  };

  const handleShare = async () => {
    try {
      const res = await fetch(`/api/cv/${id}/share`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Share failed');
      const data = await res.json();
      const link = `${window.location.origin}/cv/${data.shareToken}`;
      setShareLink(link);
      await navigator.clipboard.writeText(link);
      toast.success('Paylaşım linki oluşturuldu ve panoya kopyalandı');
      await fetchCV();
    } catch (e) {
      console.error('Share error:', e);
      toast.error('Paylaşım linki oluşturulurken bir hata oluştu');
    }
  };

  const handleUnshare = async () => {
    try {
      const res = await fetch(`/api/cv/${id}/share`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Unshare failed');
      setShareLink(null);
      toast.success('Paylaşım kapatıldı');
      await fetchCV();
    } catch (e) {
      console.error('Unshare error:', e);
      toast.error('Paylaşım kapatılırken bir hata oluştu');
    }
  };

  const copyShareLink = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success('Link panoya kopyalandı');
    } catch (e) {
      console.error('Copy error:', e);
      toast.error('Link kopyalanırken bir hata oluştu');
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-stone-300 border-t-teal-600 animate-spin" />
      </div>
    );
  }

  if (!session) return null;
  if (!cv) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-stone-600">CV bulunamadı.</p>
        <Link
          href="/dashboard"
          className="text-teal-700 hover:text-teal-800 font-medium"
        >
          ← Dashboard&apos;a dön
        </Link>
      </div>
    );
  }

  const ats = cv.atsScore ?? 0;
  const suggestions = cv.aiSuggestions ?? [];

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <Link
              href="/dashboard"
              className="text-teal-700 hover:text-teal-800 text-sm font-medium"
            >
              ← Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {cv.title}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/dashboard/${id}/view`}
              className="inline-flex items-center px-4 py-2 border border-stone-300 text-sm font-medium rounded text-stone-700 bg-white hover:bg-stone-50"
            >
              Görüntüle
            </Link>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-4 py-2 border border-stone-300 text-sm font-medium rounded text-stone-700 bg-white hover:bg-stone-50"
            >
              {isEditing ? 'İptal' : 'Düzenle'}
            </button>
            <button
              type="button"
              onClick={handleATSReview}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded text-white bg-teal-700 hover:bg-teal-800"
            >
              ATS İncelemesi
            </button>
            <button
              type="button"
              onClick={handleImprove}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded text-white bg-teal-700 hover:bg-teal-800"
            >
              AI ile İyileştir
            </button>
            {shareLink ? (
              <>
                <button
                  type="button"
                  onClick={copyShareLink}
                  className="inline-flex items-center px-4 py-2 border border-stone-300 text-sm font-medium rounded text-stone-700 bg-white hover:bg-stone-50"
                >
                  Linki Kopyala
                </button>
                <button
                  type="button"
                  onClick={handleUnshare}
                  className="inline-flex items-center px-4 py-2 border border-stone-300 text-sm font-medium rounded text-red-700 bg-white hover:bg-red-50"
                >
                  Paylaşımı Kapat
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 border border-stone-300 text-sm font-medium rounded text-stone-700 bg-white hover:bg-stone-50"
              >
                Paylaş
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-stone-900">CV Şablonu</h3>
                <button
                  type="button"
                  onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                >
                  {showTemplateSelector ? 'Şablon Seçimini Gizle' : 'Şablon Değiştir'}
                </button>
              </div>
              {!showTemplateSelector && selectedTemplate && (
                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <TemplateThumbnail variant={selectedTemplate} />
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">
                      {getTemplateById(selectedTemplate)?.name || 'Modern'} Şablonu
                    </p>
                    <p className="text-sm text-stone-600">
                      {getTemplateById(selectedTemplate)?.description || 'Profesyonel tasarım'}
                    </p>
                  </div>
                </div>
              )}
              {showTemplateSelector && (
                <TemplateSelectorComponent
                  currentTemplate={selectedTemplate || ((cv.templateId as TemplateVariant) || 'modern')}
                  onSelect={(templateId) => {
                    setSelectedTemplate(templateId);
                    setShowTemplateSelector(false);
                    toast.success(`${getTemplateById(templateId)?.name} şablonu seçildi`);
                  }}
                />
              )}
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <CVForm
                initialData={cvToFormData(cv)}
                onSubmit={handleSubmit}
                submitLabel="Değişiklikleri Kaydet"
                templateId={selectedTemplate || ((cv.templateId as TemplateVariant) || 'modern')}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {(ats > 0 || suggestions.length > 0) && (
              <div className="bg-white shadow rounded-lg p-6 space-y-4">
                {ats > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-lg font-semibold text-stone-900">
                        ATS Puanı
                      </h2>
                      <span
                        className={`text-sm font-semibold ${
                          ats >= 80
                            ? 'text-green-600'
                            : ats >= 60
                              ? 'text-teal-600'
                              : ats >= 40
                                ? 'text-amber-600'
                                : 'text-red-600'
                        }`}
                      >
                        {ats}%
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          ats >= 80
                            ? 'bg-green-600'
                            : ats >= 60
                              ? 'bg-teal-600'
                              : ats >= 40
                                ? 'bg-amber-600'
                                : 'bg-red-600'
                        }`}
                        style={{ width: `${ats}%` }}
                      />
                    </div>
                    <p className="mt-2 text-sm text-stone-500">
                      {ats >= 80
                        ? 'Mükemmel! CV\'niz ATS sistemleri için çok uyumlu.'
                        : ats >= 60
                          ? 'İyi! CV\'niz ATS sistemleri için uyumlu, ancak iyileştirme yapılabilir.'
                          : ats >= 40
                            ? 'Orta. CV\'niz bazı ATS sistemlerinde sorun yaşayabilir.'
                            : 'Düşük. CV\'niz ATS sistemleri için optimize edilmeli.'}
                    </p>
                  </div>
                )}

                {suggestions.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-stone-900 mb-3">
                      AI Önerileri
                    </h2>
                    <div className="space-y-3">
                      {suggestions.map((suggestion, idx) => {
                        const isExpanded = expandedSuggestions[idx] ?? false;
                        const lines = suggestion.split('\n').filter((l) => l.trim());
                        const preview = lines.slice(0, 3).join('\n');
                        const hasMore = lines.length > 3;

                        return (
                          <div
                            key={idx}
                            className="bg-amber-50 border-l-4 border-amber-400 rounded-r overflow-hidden"
                          >
                            <div className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-amber-900 text-xs font-bold">
                                      {idx + 1}
                                    </div>
                                    <h3 className="text-sm font-semibold text-amber-900">
                                      Öneri {idx + 1}
                                    </h3>
                                  </div>
                                  <div className="text-amber-800 whitespace-pre-wrap text-sm">
                                    {isExpanded || !hasMore ? (
                                      <p>{suggestion}</p>
                                    ) : (
                                      <>
                                        <p>{preview}</p>
                                        {hasMore && (
                                          <span className="text-amber-600 italic">
                                            {' '}
                                            ... ({lines.length - 3} satır daha)
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {hasMore && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newExpanded = [...expandedSuggestions];
                                    newExpanded[idx] = !newExpanded[idx];
                                    setExpandedSuggestions(newExpanded);
                                  }}
                                  className="mt-3 text-sm font-medium text-amber-700 hover:text-amber-800 underline"
                                >
                                  {isExpanded ? 'Daha az göster' : 'Devamını göster'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white shadow rounded-lg p-6">
              <CVRender
                data={cvToFormData(cv)}
                templateId={(cv.templateId as TemplateVariant) || 'modern'}
              />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <p className="text-sm text-stone-600 mb-2">
                CV&apos;yi farklı bir dile çevir
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'tr', label: 'Türkçe' },
                  { code: 'de', label: 'Deutsch' },
                  { code: 'fr', label: 'Français' },
                ].map(({ code, label }) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleTranslate(code)}
                    className="px-3 py-1.5 text-sm font-medium rounded bg-stone-100 text-stone-700 hover:bg-stone-200"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
