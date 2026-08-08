'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { DEFAULT_TEMPLATE, type TemplateVariant } from '@/data/templates';
import { languageNames, locales, type ValidLocale } from '@/i18n/settings';

export interface CVFormData {
  title: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    profilePhoto?: string;
  };
  summary: string;
  workExperience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    isCurrent?: boolean;
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
  }[];
  skills: string[];
  languages: {
    language: string;
    level: string;
  }[];
  certifications?: {
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
    credentialUrl?: string;
  }[];
  projects?: {
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    startDate: string;
    endDate?: string;
    isCurrent?: boolean;
  }[];
  references?: {
    name: string;
    position: string;
    company: string;
    email: string;
    phone: string;
  }[];
  /** Language the finished CV is written in; drives the rendered headings. */
  language?: ValidLocale;
}

const emptyFormData: CVFormData = {
  title: '',
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    profilePhoto: '',
  },
  summary: '',
  workExperience: [
    {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      isCurrent: false,
    },
  ],
  education: [
    {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
    },
  ],
  skills: [''],
  languages: [{ language: '', level: '' }],
  certifications: [],
  projects: [],
  references: [],
};

type CVFormProps = {
  initialData?: CVFormData | null;
  onSubmit?: (data: CVFormData) => Promise<void>;
  submitLabel?: string;
  templateId?: TemplateVariant;
};

export default function CVForm({
  initialData,
  onSubmit,
  submitLabel,
  templateId,
}: CVFormProps) {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [formData, setFormData] = useState<CVFormData>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 6;

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (!onSubmit) {
      setFormData(emptyFormData);
    }
  }, [initialData, onSubmit]);

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(t('form.toast.imageOnly'));
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('form.toast.imageTooLarge'));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setFormData({
        ...formData,
        personalInfo: { ...formData.personalInfo, profilePhoto: result },
      });
      toast.success(t('form.toast.photoUploaded'));
    };
    reader.onerror = () => {
      toast.error(t('form.toast.photoError'));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        const response = await fetch('/api/cv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            language: formData.language ?? locale,
            templateId: templateId ?? DEFAULT_TEMPLATE,
          }),
        });
        if (!response.ok) {
          const body = await response.json().catch(() => null);
          // Quota and validation failures are the user's to act on, so they get
          // their own message rather than the generic "something went wrong".
          if (body?.code === 'quota_exceeded') {
            toast.error(t('form.toast.quotaExceeded'));
          } else if (body?.code === 'validation_failed') {
            toast.error(t('form.toast.validationError'));
          } else {
            toast.error(t('form.toast.createError'));
          }
          return;
        }
        const data = await response.json();
        toast.success(t('form.toast.created'));
        router.push(`/dashboard/${data._id}`);
      }
    } catch (error) {
      console.error('CV submit error:', error);
      toast.error(t('form.toast.createError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const addWorkExperience = () => {
    setFormData({
      ...formData,
      workExperience: [
        ...formData.workExperience,
        {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: '',
          isCurrent: false,
        },
      ],
    });
  };

  const removeWorkExperience = (index: number) => {
    const newExp = formData.workExperience.filter((_, i) => i !== index);
    setFormData({ ...formData, workExperience: newExp });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
        },
      ],
    });
  };

  const removeEducation = (index: number) => {
    const newEdu = formData.education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: newEdu });
  };

  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, ''],
    });
  };

  const removeSkill = (index: number) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: newSkills });
  };

  const addLanguage = () => {
    setFormData({
      ...formData,
      languages: [
        ...formData.languages,
        {
          language: '',
          level: '',
        },
      ],
    });
  };

  const removeLanguage = (index: number) => {
    const newLangs = formData.languages.filter((_, i) => i !== index);
    setFormData({ ...formData, languages: newLangs });
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [
        ...(formData.certifications || []),
        {
          name: '',
          issuer: '',
          date: '',
          expiryDate: '',
          credentialId: '',
          credentialUrl: '',
        },
      ],
    });
  };

  const removeCertification = (index: number) => {
    const newCerts = (formData.certifications || []).filter((_, i) => i !== index);
    setFormData({ ...formData, certifications: newCerts });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...(formData.projects || []),
        {
          name: '',
          description: '',
          technologies: [],
          url: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
        },
      ],
    });
  };

  const removeProject = (index: number) => {
    const newProjects = (formData.projects || []).filter((_, i) => i !== index);
    setFormData({ ...formData, projects: newProjects });
  };

  const addReference = () => {
    setFormData({
      ...formData,
      references: [
        ...(formData.references || []),
        {
          name: '',
          position: '',
          company: '',
          email: '',
          phone: '',
        },
      ],
    });
  };

  const removeReference = (index: number) => {
    const newRefs = (formData.references || []).filter((_, i) => i !== index);
    setFormData({ ...formData, references: newRefs });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderWorkExperience();
      case 3:
        return renderEducation();
      case 4:
        return renderSkillsAndLanguages();
      case 5:
        return renderAdditionalInfo();
      case 6:
        return renderSummary();
      default:
        return null;
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-stone-900 mb-4">{t('form.personal.title')}</h3>
        
        {/* Profil Resmi */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            {t('form.personal.photo')}
          </label>
          <div className="flex items-center gap-4">
            {formData.personalInfo.profilePhoto ? (
              <div className="relative">
                <Image
                  src={formData.personalInfo.profilePhoto}
                  alt="Profil"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover border-2 border-stone-300"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      personalInfo: { ...formData.personalInfo, profilePhoto: '' },
                    });
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-stone-200 flex items-center justify-center border-2 border-dashed border-stone-300">
                <span className="text-stone-400 text-xs text-center px-2">{t('form.personal.noPhoto')}</span>
              </div>
            )}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                className="hidden"
                id="profilePhoto"
              />
              <label
                htmlFor="profilePhoto"
                className="inline-flex items-center px-4 py-2 border border-stone-300 rounded-md text-sm font-medium text-stone-700 bg-white hover:bg-stone-50 cursor-pointer"
              >
                {t('form.personal.choosePhoto')}
              </label>
              <p className="mt-1 text-xs text-stone-500">{t('form.personal.photoHint')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-stone-700">
              {t('form.personal.cvTitle')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
              placeholder={t('form.personal.cvTitlePlaceholder')}
              required
            />
          </div>
          <div>
            <label htmlFor="cvLanguage" className="block text-sm font-medium text-stone-700">
              {t('form.personal.cvLanguage')}
            </label>
            <select
              id="cvLanguage"
              value={formData.language ?? locale}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value as ValidLocale })
              }
              className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
            >
              {locales.map((code) => (
                <option key={code} value={code}>
                  {languageNames[code]}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-stone-500">{t('form.personal.cvLanguageHint')}</p>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-stone-700">
              {t('form.personal.fullName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.personalInfo.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, name: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700">
              {t('form.personal.email')} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.personalInfo.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, email: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-stone-700">
              {t('form.personal.phone')} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.personalInfo.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, phone: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
              placeholder={t('form.personal.phonePlaceholder')}
              required
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-stone-700">
              {t('form.personal.location')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              value={formData.personalInfo.location}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, location: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
              placeholder={t('form.personal.locationPlaceholder')}
              required
            />
          </div>
          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-stone-700">
              LinkedIn
            </label>
            <input
              type="url"
              id="linkedin"
              value={formData.personalInfo.linkedin || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, linkedin: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
              placeholder={t('form.personal.linkedinPlaceholder')}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="website" className="block text-sm font-medium text-stone-700">
              {t('form.personal.website')}
            </label>
            <input
              type="url"
              id="website"
              value={formData.personalInfo.website || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, website: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
              placeholder={t('form.personal.websitePlaceholder')}
            />
          </div>
        </div>
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-stone-700 mt-4">
            {t('form.personal.summary')} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="summary"
            rows={5}
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
            placeholder={t('form.personal.summaryPlaceholder')}
            required
          />
          <p className="mt-1 text-xs text-stone-500">{t('form.personal.summaryHint')}</p>
        </div>
      </div>
    </div>
  );

  const renderWorkExperience = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-stone-900">{t('form.experience.title')}</h3>
        <button
          type="button"
          onClick={addWorkExperience}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-teal-700 bg-teal-50 hover:bg-teal-100"
        >
          {t('form.experience.add')}
        </button>
      </div>
      {formData.workExperience.map((exp, index) => (
        <div key={index} className="space-y-4 p-5 border border-stone-200 rounded-lg bg-stone-50">
          {formData.workExperience.length > 1 && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-stone-600">Deneyim #{index + 1}</span>
              <button
                type="button"
                onClick={() => removeWorkExperience(index)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                {t('form.common.remove')}
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`company-${index}`} className="block text-sm font-medium text-stone-700">
                {t('form.common.company')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id={`company-${index}`}
                value={exp.company}
                onChange={(e) => {
                  const newExp = [...formData.workExperience];
                  newExp[index].company = e.target.value;
                  setFormData({ ...formData, workExperience: newExp });
                }}
                className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                required
              />
            </div>
            <div>
              <label htmlFor={`position-${index}`} className="block text-sm font-medium text-stone-700">
                {t('form.common.position')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id={`position-${index}`}
                value={exp.position}
                onChange={(e) => {
                  const newExp = [...formData.workExperience];
                  newExp[index].position = e.target.value;
                  setFormData({ ...formData, workExperience: newExp });
                }}
                className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`startDate-${index}`} className="block text-sm font-medium text-stone-700">
                {t('form.experience.startDate')} <span className="text-red-500">*</span>
              </label>
              <input
                type="month"
                id={`startDate-${index}`}
                value={exp.startDate}
                onChange={(e) => {
                  const newExp = [...formData.workExperience];
                  newExp[index].startDate = e.target.value;
                  setFormData({ ...formData, workExperience: newExp });
                }}
                className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                required
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id={`isCurrent-${index}`}
                  checked={exp.isCurrent || false}
                  onChange={(e) => {
                    const newExp = [...formData.workExperience];
                    newExp[index].isCurrent = e.target.checked;
                    if (e.target.checked) {
                      newExp[index].endDate = '';
                    }
                    setFormData({ ...formData, workExperience: newExp });
                  }}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-stone-300 rounded"
                />
                <label htmlFor={`isCurrent-${index}`} className="text-sm font-medium text-stone-700">
                  {t('form.experience.current')}
                </label>
              </div>
              {!exp.isCurrent && (
                <label htmlFor={`endDate-${index}`} className="block text-sm font-medium text-stone-700">
                  {t('form.experience.endDate')} <span className="text-red-500">*</span>
                </label>
              )}
              {!exp.isCurrent && (
                <input
                  type="month"
                  id={`endDate-${index}`}
                  value={exp.endDate}
                  onChange={(e) => {
                    const newExp = [...formData.workExperience];
                    newExp[index].endDate = e.target.value;
                    setFormData({ ...formData, workExperience: newExp });
                  }}
                  className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                  required={!exp.isCurrent}
                />
              )}
            </div>
          </div>
          <div>
            <label htmlFor={`description-${index}`} className="block text-sm font-medium text-stone-700">
              {t('form.experience.description')} <span className="text-red-500">*</span>
            </label>
            <textarea
              id={`description-${index}`}
              rows={4}
              value={exp.description}
              onChange={(e) => {
                const newExp = [...formData.workExperience];
                newExp[index].description = e.target.value;
                setFormData({ ...formData, workExperience: newExp });
              }}
              className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
              placeholder={t('form.experience.descriptionPlaceholder')}
              required
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-stone-900">{t('form.education.title')}</h3>
        <button
          type="button"
          onClick={addEducation}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-teal-700 bg-teal-50 hover:bg-teal-100"
        >
          {t('form.education.add')}
        </button>
      </div>
      {formData.education.map((edu, index) => (
        <div key={index} className="space-y-4 p-5 border border-stone-200 rounded-lg bg-stone-50">
          {formData.education.length > 1 && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-stone-600">{t('form.education.title')} #{index + 1}</span>
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                {t('form.common.remove')}
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`institution-${index}`} className="block text-sm font-medium text-stone-700">
                {t('form.education.institution')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id={`institution-${index}`}
                value={edu.institution}
                onChange={(e) => {
                  const newEdu = [...formData.education];
                  newEdu[index].institution = e.target.value;
                  setFormData({ ...formData, education: newEdu });
                }}
                className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                required
              />
            </div>
            <div>
              <label htmlFor={`degree-${index}`} className="block text-sm font-medium text-stone-700">
                {t('form.education.degree')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id={`degree-${index}`}
                value={edu.degree}
                onChange={(e) => {
                  const newEdu = [...formData.education];
                  newEdu[index].degree = e.target.value;
                  setFormData({ ...formData, education: newEdu });
                }}
                className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                placeholder={t('form.education.degreePlaceholder')}
                required
              />
            </div>
            <div>
              <label htmlFor={`field-${index}`} className="block text-sm font-medium text-stone-700">
                {t('form.education.field')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id={`field-${index}`}
                value={edu.field}
                onChange={(e) => {
                  const newEdu = [...formData.education];
                  newEdu[index].field = e.target.value;
                  setFormData({ ...formData, education: newEdu });
                }}
                className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                placeholder={t('form.education.fieldPlaceholder')}
                required
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id={`eduIsCurrent-${index}`}
                  checked={edu.isCurrent || false}
                  onChange={(e) => {
                    const newEdu = [...formData.education];
                    newEdu[index].isCurrent = e.target.checked;
                    if (e.target.checked) {
                      newEdu[index].endDate = '';
                    }
                    setFormData({ ...formData, education: newEdu });
                  }}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-stone-300 rounded"
                />
                <label htmlFor={`eduIsCurrent-${index}`} className="text-sm font-medium text-stone-700">
                  {t('form.experience.current')}
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`eduStartDate-${index}`} className="block text-sm font-medium text-stone-700">
                    {t('form.education.start')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="month"
                    id={`eduStartDate-${index}`}
                    value={edu.startDate}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].startDate = e.target.value;
                      setFormData({ ...formData, education: newEdu });
                    }}
                    className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                    required
                  />
                </div>
                {!edu.isCurrent && (
                  <div>
                    <label htmlFor={`eduEndDate-${index}`} className="block text-sm font-medium text-stone-700">
                      {t('form.education.end')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="month"
                      id={`eduEndDate-${index}`}
                      value={edu.endDate}
                      onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index].endDate = e.target.value;
                        setFormData({ ...formData, education: newEdu });
                      }}
                      className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                      required={!edu.isCurrent}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkillsAndLanguages = () => (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-stone-900">{t('form.skills.title')}</h3>
          <button
            type="button"
            onClick={addSkill}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-teal-700 bg-teal-50 hover:bg-teal-100"
          >
            {t('form.skills.add')}
          </button>
        </div>
        <div className="space-y-2">
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => {
                  const newSkills = [...formData.skills];
                  newSkills[index] = e.target.value;
                  setFormData({ ...formData, skills: newSkills });
                }}
                className="flex-1 rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                placeholder={t('form.skills.placeholder')}
                required
              />
              {formData.skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-stone-900">{t('form.languages.title')}</h3>
          <button
            type="button"
            onClick={addLanguage}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-teal-700 bg-teal-50 hover:bg-teal-100"
          >
            {t('form.languages.add')}
          </button>
        </div>
        {formData.languages.map((lang, index) => (
          <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={lang.language}
                onChange={(e) => {
                  const newLangs = [...formData.languages];
                  newLangs[index].language = e.target.value;
                  setFormData({ ...formData, languages: newLangs });
                }}
                className="flex-1 rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                placeholder={t('form.languages.placeholder')}
                required
              />
              {formData.languages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700"
                >
                  ×
                </button>
              )}
            </div>
            <div>
              <select
                value={lang.level}
                onChange={(e) => {
                  const newLangs = [...formData.languages];
                  newLangs[index].level = e.target.value;
                  setFormData({ ...formData, languages: newLangs });
                }}
                className="w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                required
              >
                <option value="">{t('form.languages.selectLevel')}</option>
                <option value="A1">{t('form.languages.a1')}</option>
                <option value="A2">{t('form.languages.a2')}</option>
                <option value="B1">{t('form.languages.b1')}</option>
                <option value="B2">{t('form.languages.b2')}</option>
                <option value="C1">{t('form.languages.c1')}</option>
                <option value="C2">{t('form.languages.c2')}</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAdditionalInfo = () => (
    <div className="space-y-6">
      {/* Sertifikalar */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-stone-900">{t('form.certifications.title')}</h3>
          <button
            type="button"
            onClick={addCertification}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-teal-700 bg-teal-50 hover:bg-teal-100"
          >
            {t('form.certifications.add')}
          </button>
        </div>
        {(formData.certifications || []).map((cert, index) => (
          <div key={index} className="space-y-4 p-5 border border-stone-200 rounded-lg bg-stone-50 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-stone-600">Sertifika #{index + 1}</span>
              <button
                type="button"
                onClick={() => removeCertification(index)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                {t('form.common.remove')}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-stone-700">{t('form.certifications.name')}</label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => {
                    const newCerts = [...(formData.certifications || [])];
                    newCerts[index].name = e.target.value;
                    setFormData({ ...formData, certifications: newCerts });
                  }}
                  className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700">{t('form.certifications.issuer')}</label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => {
                    const newCerts = [...(formData.certifications || [])];
                    newCerts[index].issuer = e.target.value;
                    setFormData({ ...formData, certifications: newCerts });
                  }}
                  className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700">{t('form.certifications.date')}</label>
                <input
                  type="month"
                  value={cert.date}
                  onChange={(e) => {
                    const newCerts = [...(formData.certifications || [])];
                    newCerts[index].date = e.target.value;
                    setFormData({ ...formData, certifications: newCerts });
                  }}
                  className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700">{t('form.certifications.credentialId')}</label>
                <input
                  type="text"
                  value={cert.credentialId || ''}
                  onChange={(e) => {
                    const newCerts = [...(formData.certifications || [])];
                    newCerts[index].credentialId = e.target.value;
                    setFormData({ ...formData, certifications: newCerts });
                  }}
                  className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                  placeholder={t('form.certifications.credentialIdPlaceholder')}
                />
              </div>
            </div>
          </div>
        ))}
        {(!formData.certifications || formData.certifications.length === 0) && (
          <p className="text-sm text-stone-500 italic">{t('form.certifications.empty')}</p>
        )}
      </div>

      {/* Projeler */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-stone-900">{t('form.projects.title')}</h3>
          <button
            type="button"
            onClick={addProject}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-teal-700 bg-teal-50 hover:bg-teal-100"
          >
            {t('form.projects.add')}
          </button>
        </div>
        {(formData.projects || []).map((project, index) => (
          <div key={index} className="space-y-4 p-5 border border-stone-200 rounded-lg bg-stone-50 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-stone-600">Proje #{index + 1}</span>
              <button
                type="button"
                onClick={() => removeProject(index)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                {t('form.common.remove')}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700">{t('form.projects.name')}</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => {
                    const newProjects = [...(formData.projects || [])];
                    newProjects[index].name = e.target.value;
                    setFormData({ ...formData, projects: newProjects });
                  }}
                  className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700">{t('form.projects.description')}</label>
                <textarea
                  rows={3}
                  value={project.description}
                  onChange={(e) => {
                    const newProjects = [...(formData.projects || [])];
                    newProjects[index].description = e.target.value;
                    setFormData({ ...formData, projects: newProjects });
                  }}
                  className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700">{t('form.experience.startDate')}</label>
                <input
                  type="month"
                  value={project.startDate}
                  onChange={(e) => {
                    const newProjects = [...(formData.projects || [])];
                    newProjects[index].startDate = e.target.value;
                    setFormData({ ...formData, projects: newProjects });
                  }}
                  className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={project.isCurrent || false}
                    onChange={(e) => {
                      const newProjects = [...(formData.projects || [])];
                      newProjects[index].isCurrent = e.target.checked;
                      if (e.target.checked) {
                        newProjects[index].endDate = '';
                      }
                      setFormData({ ...formData, projects: newProjects });
                    }}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-stone-300 rounded"
                  />
                  <label className="text-sm font-medium text-stone-700">{t('form.projects.current')}</label>
                </div>
                {!project.isCurrent && (
                  <label className="block text-sm font-medium text-stone-700">{t('form.experience.endDate')}</label>
                )}
                {!project.isCurrent && (
                  <input
                    type="month"
                    value={project.endDate || ''}
                    onChange={(e) => {
                      const newProjects = [...(formData.projects || [])];
                      newProjects[index].endDate = e.target.value;
                      setFormData({ ...formData, projects: newProjects });
                    }}
                    className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                  />
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700">{t('form.projects.link')}</label>
                <input
                  type="url"
                  value={project.url || ''}
                  onChange={(e) => {
                    const newProjects = [...(formData.projects || [])];
                    newProjects[index].url = e.target.value;
                    setFormData({ ...formData, projects: newProjects });
                  }}
                  className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                  placeholder={t('form.common.urlPlaceholder')}
                />
              </div>
            </div>
          </div>
        ))}
        {(!formData.projects || formData.projects.length === 0) && (
          <p className="text-sm text-stone-500 italic">{t('form.projects.empty')}</p>
        )}
      </div>

      {/* Referanslar */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-stone-900">{t('form.references.title')}</h3>
          <button
            type="button"
            onClick={addReference}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-teal-700 bg-teal-50 hover:bg-teal-100"
          >
            {t('form.references.add')}
          </button>
        </div>
        {(formData.references || []).map((ref, index) => (
          <div key={index} className="space-y-4 p-5 border border-stone-200 rounded-lg bg-stone-50 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-stone-600">Referans #{index + 1}</span>
              <button
                type="button"
                onClick={() => removeReference(index)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                {t('form.common.remove')}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-stone-700">{t('form.personal.fullName')}</label>
                <input
                  type="text"
                  value={ref.name}
                  onChange={(e) => {
                    const newRefs = [...(formData.references || [])];
                    newRefs[index].name = e.target.value;
                    setFormData({ ...formData, references: newRefs });
                  }}
                  className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700">{t('form.common.position')}</label>
                <input
                  type="text"
                  value={ref.position}
                  onChange={(e) => {
                    const newRefs = [...(formData.references || [])];
                    newRefs[index].position = e.target.value;
                    setFormData({ ...formData, references: newRefs });
                  }}
                  className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700">{t('form.common.company')}</label>
                <input
                  type="text"
                  value={ref.company}
                  onChange={(e) => {
                    const newRefs = [...(formData.references || [])];
                    newRefs[index].company = e.target.value;
                    setFormData({ ...formData, references: newRefs });
                  }}
                  className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700">{t('form.personal.email')}</label>
                <input
                  type="email"
                  value={ref.email}
                  onChange={(e) => {
                    const newRefs = [...(formData.references || [])];
                    newRefs[index].email = e.target.value;
                    setFormData({ ...formData, references: newRefs });
                  }}
                  className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700">{t('form.personal.phone')}</label>
                <input
                  type="tel"
                  value={ref.phone}
                  onChange={(e) => {
                    const newRefs = [...(formData.references || [])];
                    newRefs[index].phone = e.target.value;
                    setFormData({ ...formData, references: newRefs });
                  }}
                  className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 sm:text-sm px-3 py-2"
                />
              </div>
            </div>
          </div>
        ))}
        {(!formData.references || formData.references.length === 0) && (
          <p className="text-sm text-stone-500 italic">{t('form.references.empty')}</p>
        )}
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-teal-900 mb-2">{t('form.preview.title')}</h3>
        <p className="text-sm text-teal-800 mb-4">
          {t('form.preview.hint')}
        </p>
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-stone-700">{t('form.preview.cvTitle')}</span>{' '}
            <span className="text-stone-600">{formData.title || t('form.preview.notProvided')}</span>
          </div>
          <div>
            <span className="font-medium text-stone-700">{t('form.preview.fullName')}</span>{' '}
            <span className="text-stone-600">{formData.personalInfo.name || t('form.preview.notProvided')}</span>
          </div>
          <div>
            <span className="font-medium text-stone-700">{t('form.preview.experience')}</span>{' '}
            <span className="text-stone-600">{t('form.preview.experienceCount', { count: formData.workExperience.length })}</span>
          </div>
          <div>
            <span className="font-medium text-stone-700">{t('form.preview.education')}</span>{' '}
            <span className="text-stone-600">{t('form.preview.educationCount', { count: formData.education.length })}</span>
          </div>
          <div>
            <span className="font-medium text-stone-700">{t('form.preview.skills')}</span>{' '}
            <span className="text-stone-600">{t('form.preview.skillsCount', { count: formData.skills.filter(s => s).length })}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-stone-700">
            {t('form.progress.step', { current: currentStep, total: totalSteps })}
          </span>
          <span className="text-sm text-stone-500">
            {t('form.progress.complete', { percent: Math.round((currentStep / totalSteps) * 100) })}
          </span>
        </div>
        <div className="w-full bg-stone-200 rounded-full h-2">
          <div
            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-stone-600">
          <span>{t('form.personal.title')}</span>
          <span>{t('form.experience.title')}</span>
          <span>{t('form.education.title')}</span>
          <span>{t('form.skills.title')}</span>
          <span>{t('form.additional.title')}</span>
          <span>{t('form.preview.summary')}</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">{renderStep()}</div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-stone-200">
        <button
          type="button"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-4 py-2 border border-stone-300 rounded-md text-sm font-medium text-stone-700 bg-white hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('form.common.back')}
        </button>
        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-teal-700 hover:bg-teal-800"
          >
            {t('form.common.next')}
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('form.common.saving') : submitLabel ?? t('form.common.submit')}
          </button>
        )}
      </div>
    </form>
  );
}
