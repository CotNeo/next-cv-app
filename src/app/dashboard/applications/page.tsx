'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/ConfirmModal';
import { useTranslation } from '@/hooks/useTranslation';
import { LOCALE_TAGS } from '@/i18n/settings';

interface Application {
  _id: string;
  jobTitle: string;
  companyName: string;
  coverLetter: string;
  language: string;
  createdAt: string;
  cvId?: { _id: string; title: string } | string | null;
}

function cvTitleOf(application: Application): string | null {
  const cv = application.cvId;
  return cv && typeof cv === 'object' ? cv.title : null;
}

export default function ApplicationsPage() {
  const { status } = useSession();
  const { t, locale } = useTranslation();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Application | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch('/api/applications');
      if (!res.ok) throw new Error('Failed to load applications');
      setApplications(await res.json());
    } catch (error) {
      console.error('Applications load error:', error);
      toast.error(t('applications.loadError'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (status === 'authenticated') fetchApplications();
  }, [status, fetchApplications]);

  const handleCopy = async (application: Application) => {
    await navigator.clipboard.writeText(application.coverLetter);
    toast.success(t('applications.copied'));
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      const res = await fetch(`/api/applications/${pendingDelete._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setApplications((current) => current.filter((item) => item._id !== pendingDelete._id));
      toast.success(t('applications.deleteSuccess'));
    } catch (error) {
      console.error('Application delete error:', error);
      toast.error(t('applications.deleteError'));
    } finally {
      setPendingDelete(null);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="h-8 w-8 rounded-full border-2 border-stone-300 border-t-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900">{t('applications.title')}</h1>
          <p className="mt-1 text-sm text-stone-600">{t('applications.subtitle')}</p>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-lg border border-stone-200 bg-white py-16 text-center">
            <p className="text-stone-500 text-sm">{t('applications.empty')}</p>
            <p className="mt-1 text-sm text-stone-400">{t('applications.emptyHint')}</p>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex items-center rounded bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
            >
              {t('dashboard.list.title')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => {
              const isExpanded = expandedId === application._id;
              const cvTitle = cvTitleOf(application);
              return (
                <article
                  key={application._id}
                  className="rounded-lg border border-stone-200 bg-white overflow-hidden"
                >
                  <div className="p-5">
                    <h2 className="text-lg font-semibold text-stone-900">
                      {application.jobTitle}
                    </h2>
                    <p className="text-sm text-stone-600">{application.companyName}</p>
                    <p className="mt-1 text-xs text-stone-400">
                      {cvTitle && (
                        <>
                          {t('applications.forCv')}: {cvTitle} ·{' '}
                        </>
                      )}
                      {t('applications.created')}:{' '}
                      {new Date(application.createdAt).toLocaleDateString(LOCALE_TAGS[locale])}
                    </p>

                    {isExpanded && (
                      <p className="mt-4 whitespace-pre-line text-sm text-stone-700 leading-relaxed border-t border-stone-100 pt-4">
                        {application.coverLetter}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-t border-stone-100 bg-stone-50/50">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : application._id)}
                      className="text-sm font-medium text-teal-700 hover:text-teal-800"
                    >
                      {isExpanded ? t('dashboard.detail.showLess') : t('applications.view')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(application)}
                      className="text-sm font-medium text-stone-600 hover:text-stone-900"
                    >
                      {t('applications.copy')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(application)}
                      className="ml-auto text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      {t('applications.delete')}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        title={t('applications.deleteTitle')}
        message={t('applications.deleteMessage', { title: pendingDelete?.jobTitle ?? '' })}
        confirmText={t('applications.delete')}
        cancelText={t('dashboard.list.cancel')}
        variant="danger"
      />
    </div>
  );
}
