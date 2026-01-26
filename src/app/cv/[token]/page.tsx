'use client';

import { use, useEffect, useState } from 'react';
import CVRender from '@/components/cv/CVRender';
import type { CVFormData } from '@/components/CVForm';
import type { TemplateVariant } from '@/components/templates/TemplateThumbnail';

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
  workExperience?: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education?: {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }[];
  skills?: string[];
  languages?: {
    language: string;
    level: string;
  }[];
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
  templateId?: string;
}

function cvToFormData(cv: CV): CVFormData {
  const we = cv.workExperience || [];
  const edu = cv.education || [];
  const sk = cv.skills || [];
  const lang = cv.languages || [];
  const certs = cv.certifications || [];
  const projs = cv.projects || [];
  const refs = cv.references || [];

  return {
    title: cv.title || '',
    personalInfo: {
      name: cv.personalInfo?.name || '',
      email: cv.personalInfo?.email || '',
      phone: cv.personalInfo?.phone || '',
      location: cv.personalInfo?.location || '',
      website: cv.personalInfo?.website,
      linkedin: cv.personalInfo?.linkedin,
      profilePhoto: cv.personalInfo?.profilePhoto,
    },
    summary: cv.summary || '',
    workExperience:
      we.length > 0
        ? we.map((w) => ({
            company: w.company || '',
            position: w.position || '',
            startDate:
              typeof w.startDate === 'string'
                ? w.startDate
                : new Date(w.startDate).toISOString().split('T')[0],
            endDate:
              typeof w.endDate === 'string'
                ? w.endDate
                : new Date(w.endDate).toISOString().split('T')[0],
            description: w.description || '',
            isCurrent: (w as { isCurrent?: boolean }).isCurrent ?? false,
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
            institution: e.institution || '',
            degree: e.degree || '',
            field: e.field || '',
            startDate:
              typeof e.startDate === 'string'
                ? e.startDate
                : new Date(e.startDate).toISOString().split('T')[0],
            endDate:
              typeof e.endDate === 'string'
                ? e.endDate
                : new Date(e.endDate).toISOString().split('T')[0],
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
            date: c.date ? (typeof c.date === 'string' ? c.date : new Date(c.date).toISOString().split('T')[0]) : '',
            expiryDate: c.expiryDate ? (typeof c.expiryDate === 'string' ? c.expiryDate : new Date(c.expiryDate).toISOString().split('T')[0]) : '',
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
            startDate: p.startDate ? (typeof p.startDate === 'string' ? p.startDate : new Date(p.startDate).toISOString().split('T')[0]) : '',
            endDate: p.endDate ? (typeof p.endDate === 'string' ? p.endDate : new Date(p.endDate).toISOString().split('T')[0]) : '',
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

export default function PublicCVPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [cv, setCV] = useState<CV | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const res = await fetch(`/api/cv/public/${token}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('CV bulunamadı veya paylaşım kapatılmış');
          } else {
            setError('CV yüklenirken bir hata oluştu');
          }
          return;
        }
        const data = await res.json();
        setCV(data);
      } catch (e) {
        console.error('Fetch CV error:', e);
        setError('CV yüklenirken bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCV();
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="h-8 w-8 rounded-full border-2 border-stone-300 border-t-teal-600 animate-spin" />
      </div>
    );
  }

  if (error || !cv) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Hata</h1>
          <p className="text-stone-600">{error || 'CV bulunamadı'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
          <CVRender
            data={cvToFormData(cv)}
            templateId={(cv.templateId as TemplateVariant) || 'modern'}
          />
        </div>
      </div>
    </div>
  );
}
