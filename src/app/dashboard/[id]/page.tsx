'use client';

import { use, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import CVForm, { type CVFormData } from '@/components/CVForm';
import Link from 'next/link';

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
  atsScore?: number;
  aiSuggestions?: string[];
  createdAt: string;
}

function toYyyyMmDd(val: string | Date | undefined): string {
  if (!val) return '';
  const d = typeof val === 'string' ? new Date(val) : val;
  return d.toISOString().slice(0, 10);
}

function cvToFormData(cv: CV): CVFormData {
  const we = cv.workExperience ?? [];
  const edu = cv.education ?? [];
  const sk = cv.skills ?? [];
  const lang = cv.languages ?? [];
  return {
    title: cv.title ?? '',
    personalInfo: {
      name: cv.personalInfo?.name ?? '',
      email: cv.personalInfo?.email ?? '',
      phone: cv.personalInfo?.phone ?? '',
      location: cv.personalInfo?.location ?? '',
      website: cv.personalInfo?.website ?? '',
      linkedin: cv.personalInfo?.linkedin ?? '',
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

  const fetchCV = useCallback(async () => {
    try {
      const res = await fetch(`/api/cv/${id}`);
      if (!res.ok) throw new Error('Failed to fetch CV');
      const data = await res.json();
      setCV(data);
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
    try {
      const res = await fetch(`/api/cv/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update CV');
      const updated = await res.json();
      setCV(updated);
      setIsEditing(false);
    } catch (e) {
      console.error('Update CV error:', e);
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
    } catch (e) {
      console.error('Translate error:', e);
    }
  };

  const handleImprove = async () => {
    try {
      const res = await fetch(`/api/cv/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'improve' }),
      });
      if (!res.ok) throw new Error('Improve failed');
      await fetchCV();
    } catch (e) {
      console.error('Improve error:', e);
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

  const we = cv.workExperience ?? [];
  const edu = cv.education ?? [];
  const skills = cv.skills ?? [];
  const langs = cv.languages ?? [];
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
          </div>
        </div>

        {isEditing ? (
          <div className="bg-white shadow rounded-lg p-6">
            <CVForm
              initialData={cvToFormData(cv)}
              onSubmit={handleSubmit}
              submitLabel="Değişiklikleri Kaydet"
            />
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6 space-y-6">
            {ats > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-stone-900 mb-2">
                  ATS Puanı
                </h2>
                <div className="w-full bg-stone-200 rounded-full h-2.5">
                  <div
                    className="bg-teal-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${ats}%` }}
                  />
                </div>
                <p className="mt-1 text-sm text-stone-500">{ats}% uyumluluk</p>
              </div>
            )}

            {suggestions.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-stone-900 mb-2">
                  AI Önerileri
                </h2>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r">
                  <p className="text-amber-800 whitespace-pre-wrap">
                    {suggestions[0]}
                  </p>
                </div>
              </div>
            )}

            {cv.personalInfo && (
              <div>
                <h2 className="text-lg font-semibold text-stone-900 mb-2">
                  İletişim
                </h2>
                <div className="text-stone-700 space-y-1">
                  {cv.personalInfo.name && (
                    <p>
                      <span className="font-medium">Ad:</span>{' '}
                      {cv.personalInfo.name}
                    </p>
                  )}
                  {cv.personalInfo.email && (
                    <p>
                      <span className="font-medium">E-posta:</span>{' '}
                      {cv.personalInfo.email}
                    </p>
                  )}
                  {cv.personalInfo.phone && (
                    <p>
                      <span className="font-medium">Telefon:</span>{' '}
                      {cv.personalInfo.phone}
                    </p>
                  )}
                  {cv.personalInfo.location && (
                    <p>
                      <span className="font-medium">Konum:</span>{' '}
                      {cv.personalInfo.location}
                    </p>
                  )}
                </div>
              </div>
            )}

            {cv.summary && (
              <div>
                <h2 className="text-lg font-semibold text-stone-900 mb-2">
                  Özet
                </h2>
                <p className="text-stone-700 whitespace-pre-wrap">
                  {cv.summary}
                </p>
              </div>
            )}

            {we.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-stone-900 mb-2">
                  İş Deneyimi
                </h2>
                <div className="space-y-4">
                  {we.map((exp, i) => (
                    <div
                      key={i}
                      className="border-l-4 border-teal-200 pl-4 py-1"
                    >
                      <h3 className="font-medium text-stone-900">
                        {exp.position}
                        {exp.company && ` · ${exp.company}`}
                      </h3>
                      {(exp.startDate || exp.endDate) && (
                        <p className="text-sm text-stone-500 mt-0.5">
                          {exp.startDate
                            ? new Date(exp.startDate).toLocaleDateString(
                                'tr-TR'
                              )
                            : '?'}{' '}
                          –{' '}
                          {exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString('tr-TR')
                            : 'Devam ediyor'}
                        </p>
                      )}
                      {exp.description && (
                        <p className="text-stone-700 mt-2 text-sm">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {edu.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-stone-900 mb-2">
                  Eğitim
                </h2>
                <div className="space-y-4">
                  {edu.map((e, i) => (
                    <div
                      key={i}
                      className="border-l-4 border-teal-200 pl-4 py-1"
                    >
                      <h3 className="font-medium text-stone-900">
                        {e.degree}
                        {e.field && `, ${e.field}`}
                      </h3>
                      {e.institution && (
                        <p className="text-stone-600 text-sm">{e.institution}</p>
                      )}
                      {(e.startDate || e.endDate) && (
                        <p className="text-sm text-stone-500 mt-0.5">
                          {e.startDate
                            ? new Date(e.startDate).toLocaleDateString('tr-TR')
                            : '?'}{' '}
                          –{' '}
                          {e.endDate
                            ? new Date(e.endDate).toLocaleDateString('tr-TR')
                            : 'Devam ediyor'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skills.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-stone-900 mb-2">
                  Yetenekler
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.filter(Boolean).map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex px-3 py-1 rounded text-sm font-medium bg-teal-50 text-teal-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {langs.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-stone-900 mb-2">
                  Diller
                </h2>
                <div className="flex flex-wrap gap-2">
                  {langs
                    .filter((l) => l.language || l.level)
                    .map((l, i) => (
                      <span
                        key={i}
                        className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                      >
                        {l.language}
                        {l.level ? ` (${l.level})` : ''}
                      </span>
                    ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
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
