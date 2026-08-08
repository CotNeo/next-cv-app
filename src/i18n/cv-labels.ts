import { LOCALE_TAGS, defaultLocale, type ValidLocale } from '@/i18n/settings';

/**
 * Section headings printed inside a rendered CV.
 *
 * Deliberately separate from the UI translations: a candidate browsing the app
 * in Turkish may still need an English CV, so the document carries its own
 * `language` field and these labels follow that, not the interface locale.
 */
export interface CVLabels {
  summary: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  certifications: string;
  projects: string;
  references: string;
  present: string;
  namePlaceholder: string;
  contact: string;
  technologies: string;
  credentialId: string;
}

const LABELS: Record<ValidLocale, CVLabels> = {
  en: {
    summary: 'Summary',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    certifications: 'Certifications',
    projects: 'Projects',
    references: 'References',
    present: 'Present',
    namePlaceholder: 'Your Name',
    contact: 'Contact',
    technologies: 'Technologies',
    credentialId: 'Credential ID',
  },
  tr: {
    summary: 'Özet',
    experience: 'İş Deneyimi',
    education: 'Eğitim',
    skills: 'Yetenekler',
    languages: 'Diller',
    certifications: 'Sertifikalar',
    projects: 'Projeler',
    references: 'Referanslar',
    present: 'Devam ediyor',
    namePlaceholder: 'Ad Soyad',
    contact: 'İletişim',
    technologies: 'Teknolojiler',
    credentialId: 'Sertifika No',
  },
  de: {
    summary: 'Profil',
    experience: 'Berufserfahrung',
    education: 'Ausbildung',
    skills: 'Kenntnisse',
    languages: 'Sprachen',
    certifications: 'Zertifikate',
    projects: 'Projekte',
    references: 'Referenzen',
    present: 'Heute',
    namePlaceholder: 'Ihr Name',
    contact: 'Kontakt',
    technologies: 'Technologien',
    credentialId: 'Zertifikats-ID',
  },
  fr: {
    summary: 'Profil',
    experience: 'Expérience professionnelle',
    education: 'Formation',
    skills: 'Compétences',
    languages: 'Langues',
    certifications: 'Certifications',
    projects: 'Projets',
    references: 'Références',
    present: "Aujourd'hui",
    namePlaceholder: 'Votre nom',
    contact: 'Contact',
    technologies: 'Technologies',
    credentialId: 'ID du certificat',
  },
  ru: {
    summary: 'О себе',
    experience: 'Опыт работы',
    education: 'Образование',
    skills: 'Навыки',
    languages: 'Языки',
    certifications: 'Сертификаты',
    projects: 'Проекты',
    references: 'Рекомендации',
    present: 'По настоящее время',
    namePlaceholder: 'Ваше имя',
    contact: 'Контакты',
    technologies: 'Технологии',
    credentialId: 'Номер сертификата',
  },
  ar: {
    summary: 'نبذة',
    experience: 'الخبرة العملية',
    education: 'التعليم',
    skills: 'المهارات',
    languages: 'اللغات',
    certifications: 'الشهادات',
    projects: 'المشاريع',
    references: 'المراجع',
    present: 'حتى الآن',
    namePlaceholder: 'الاسم الكامل',
    contact: 'التواصل',
    technologies: 'التقنيات',
    credentialId: 'رقم الشهادة',
  },
};

export function getCVLabels(locale: ValidLocale = defaultLocale): CVLabels {
  return LABELS[locale] ?? LABELS[defaultLocale];
}

/** Month + year, formatted for the CV's own language. */
export function formatCVDate(value: string | undefined, locale: ValidLocale): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(LOCALE_TAGS[locale] ?? LOCALE_TAGS.en, {
    year: 'numeric',
    month: 'long',
  });
}
