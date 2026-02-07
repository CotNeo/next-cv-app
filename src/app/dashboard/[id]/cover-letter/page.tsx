'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { ValidLocale, defaultLocale } from '@/i18n/settings';

const LANGUAGES = [
  { value: 'tr', label: 'Türkçe' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'fr', label: 'Français' },
];

export default function CoverLetterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { status } = useSession();
  const [currentLocale, setCurrentLocale] = useState<ValidLocale>(defaultLocale);
  const { t } = useTranslation(currentLocale);
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [language, setLanguage] = useState('tr');
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('locale') as ValidLocale | null;
    if (saved) setCurrentLocale(saved);
  }, []);

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !companyName.trim()) {
      toast.error(t('dashboard.coverLetter.positionRequired'));
      return;
    }
    setIsGenerating(true);
    setCoverLetter('');
    try {
      const res = await fetch(`/api/cv/${id}/cover-letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: jobTitle.trim(),
          companyName: companyName.trim(),
          jobDescription: jobDescription.trim(),
          language,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? t('dashboard.coverLetter.errorCreate'));
      }
      const data = await res.json();
      setCoverLetter(data.coverLetter ?? '');
      toast.success(t('dashboard.coverLetter.created'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('dashboard.coverLetter.errorGeneric'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    toast.success(t('dashboard.coverLetter.copySuccess'));
  };

  const handleDownloadTxt = () => {
    if (!coverLetter) return;
    const blob = new Blob([coverLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${companyName.replace(/\s+/g, '-')}-${jobTitle.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t('dashboard.coverLetter.fileDownloaded'));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-stone-300 border-t-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/dashboard/${id}`}
          className="text-teal-700 hover:text-teal-800 text-sm font-medium"
        >
          {t('dashboard.coverLetter.backToCv')}
        </Link>
        <h1 className="text-2xl font-bold text-stone-900 mt-2">
          {t('dashboard.coverLetter.title')}
        </h1>
        <p className="text-stone-600 mt-1 text-sm">
          {t('dashboard.coverLetter.description')}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-stone-700 mb-1">
              {t('dashboard.coverLetter.jobTitle')}
            </label>
            <input
              id="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder={t('dashboard.coverLetter.placeholderJobTitle')}
              className="w-full rounded border border-stone-300 bg-white px-3 py-2 text-stone-900 placeholder-stone-500 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              required
            />
          </div>
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-stone-700 mb-1">
              {t('dashboard.coverLetter.companyName')}
            </label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder={t('dashboard.coverLetter.placeholderCompany')}
              className="w-full rounded border border-stone-300 bg-white px-3 py-2 text-stone-900 placeholder-stone-500 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              required
            />
          </div>
          <div>
            <label htmlFor="jobDescription" className="block text-sm font-medium text-stone-700 mb-1">
              {t('dashboard.coverLetter.jobDescriptionOptional')}
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={t('dashboard.coverLetter.placeholderPaste')}
              rows={5}
              className="w-full rounded border border-stone-300 bg-white px-3 py-2 text-stone-900 placeholder-stone-500 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 resize-y"
            />
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-stone-700 mb-1">
              {t('dashboard.coverLetter.coverLetterLanguage')}
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              {LANGUAGES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 rounded font-medium text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? t('dashboard.coverLetter.generating') : t('dashboard.coverLetter.createCoverLetter')}
          </button>
        </form>

        {coverLetter && (
          <div className="mt-10">
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center px-4 py-2 border border-stone-300 text-sm font-medium rounded text-stone-700 bg-white hover:bg-stone-50"
              >
                {t('dashboard.coverLetter.copy')}
              </button>
              <button
                type="button"
                onClick={handleDownloadTxt}
                className="inline-flex items-center px-4 py-2 border border-stone-300 text-sm font-medium rounded text-stone-700 bg-white hover:bg-stone-50"
              >
                {t('dashboard.coverLetter.downloadTxt')}
              </button>
            </div>
            <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-6">
              <p className="text-sm font-medium text-stone-500 mb-2">{t('dashboard.coverLetter.generatedCoverLetter')}</p>
              <div className="text-stone-800 whitespace-pre-wrap leading-relaxed">
                {coverLetter}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
