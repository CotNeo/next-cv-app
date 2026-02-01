'use client';

import { use, useCallback, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import CVRender from '@/components/cv/CVRender';
import type { CVFormData } from '@/components/CVForm';
import type { TemplateVariant } from '@/components/templates/TemplateThumbnail';
import html2pdf from 'html2pdf.js';

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
  templateId?: string;
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

export default function CVViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cv, setCV] = useState<CV | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

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

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleExportPDF = useCallback(async () => {
    if (!cvRef.current || !cv) return;
    setIsExporting(true);
    try {
      toast.loading('PDF oluşturuluyor...', { id: 'pdf-export' });
      if (document.fonts?.ready) await document.fonts.ready;
      const element = cvRef.current;
      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `${cv.title || 'CV'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
        },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
      };
      await html2pdf().set(opt).from(element).save();
      toast.success('PDF başarıyla indirildi', { id: 'pdf-export' });
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('PDF oluşturulurken bir hata oluştu', { id: 'pdf-export' });
    } finally {
      setIsExporting(false);
    }
  }, [cv]);

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

  return (
    <>
      <div className="min-h-screen bg-stone-50 py-8 print:hidden">
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
                href={`/dashboard/${id}`}
                className="inline-flex items-center px-4 py-2 border border-stone-300 text-sm font-medium rounded text-stone-700 bg-white hover:bg-stone-50"
              >
                Düzenle
              </Link>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 border border-stone-300 text-sm font-medium rounded text-stone-700 bg-white hover:bg-stone-50"
              >
                Yazdır
              </button>
              <button
                type="button"
                onClick={handleExportPDF}
                disabled={isExporting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? 'PDF Oluşturuluyor...' : 'PDF İndir'}
              </button>
            </div>
          </div>

          <div ref={cvRef} className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
            <CVRender
              data={cvToFormData(cv)}
              templateId={(cv.templateId as TemplateVariant) || 'modern'}
            />
          </div>
        </div>
      </div>
    </>
  );
}
