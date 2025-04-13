'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CVFormData {
  title: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
  };
  summary: string;
  workExperience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }[];
  skills: string[];
  languages: {
    language: string;
    level: string;
  }[];
}

export default function CVForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<CVFormData>({
    title: '',
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
    },
    summary: '',
    workExperience: [
      {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    ],
    education: [
      {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
      },
    ],
    skills: [''],
    languages: [
      {
        language: '',
        level: '',
      },
    ],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('CV oluşturulamadı');
      }

      const data = await response.json();
      router.push(`/dashboard/${data._id}`);
    } catch (error) {
      console.error('CV oluşturma hatası:', error);
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
        },
      ],
    });
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
        },
      ],
    });
  };

  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, ''],
    });
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* CV Başlığı */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          CV Başlığı
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Kişisel Bilgiler */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Kişisel Bilgiler</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Ad Soyad
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-posta
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefon
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Konum
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>
      </div>

      {/* Özet */}
      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
          Profesyonel Özet
        </label>
        <textarea
          id="summary"
          rows={4}
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* İş Deneyimi */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">İş Deneyimi</h3>
          <button
            type="button"
            onClick={addWorkExperience}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Deneyim Ekle
          </button>
        </div>
        {formData.workExperience.map((exp, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-md">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`company-${index}`} className="block text-sm font-medium text-gray-700">
                  Şirket
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor={`position-${index}`} className="block text-sm font-medium text-gray-700">
                  Pozisyon
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`startDate-${index}`} className="block text-sm font-medium text-gray-700">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  id={`startDate-${index}`}
                  value={exp.startDate}
                  onChange={(e) => {
                    const newExp = [...formData.workExperience];
                    newExp[index].startDate = e.target.value;
                    setFormData({ ...formData, workExperience: newExp });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor={`endDate-${index}`} className="block text-sm font-medium text-gray-700">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  id={`endDate-${index}`}
                  value={exp.endDate}
                  onChange={(e) => {
                    const newExp = [...formData.workExperience];
                    newExp[index].endDate = e.target.value;
                    setFormData({ ...formData, workExperience: newExp });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700">
                Açıklama
              </label>
              <textarea
                id={`description-${index}`}
                rows={3}
                value={exp.description}
                onChange={(e) => {
                  const newExp = [...formData.workExperience];
                  newExp[index].description = e.target.value;
                  setFormData({ ...formData, workExperience: newExp });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>
        ))}
      </div>

      {/* Eğitim */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Eğitim</h3>
          <button
            type="button"
            onClick={addEducation}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Eğitim Ekle
          </button>
        </div>
        {formData.education.map((edu, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-md">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`institution-${index}`} className="block text-sm font-medium text-gray-700">
                  Kurum
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor={`degree-${index}`} className="block text-sm font-medium text-gray-700">
                  Derece
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`field-${index}`} className="block text-sm font-medium text-gray-700">
                  Alan
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`eduStartDate-${index}`} className="block text-sm font-medium text-gray-700">
                    Başlangıç
                  </label>
                  <input
                    type="date"
                    id={`eduStartDate-${index}`}
                    value={edu.startDate}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].startDate = e.target.value;
                      setFormData({ ...formData, education: newEdu });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`eduEndDate-${index}`} className="block text-sm font-medium text-gray-700">
                    Bitiş
                  </label>
                  <input
                    type="date"
                    id={`eduEndDate-${index}`}
                    value={edu.endDate}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].endDate = e.target.value;
                      setFormData({ ...formData, education: newEdu });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Yetenekler */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Yetenekler</h3>
          <button
            type="button"
            onClick={addSkill}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Yetenek Ekle
          </button>
        </div>
        <div className="space-y-2">
          {formData.skills.map((skill, index) => (
            <div key={index}>
              <input
                type="text"
                value={skill}
                onChange={(e) => {
                  const newSkills = [...formData.skills];
                  newSkills[index] = e.target.value;
                  setFormData({ ...formData, skills: newSkills });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Yetenek"
                required
              />
            </div>
          ))}
        </div>
      </div>

      {/* Diller */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Diller</h3>
          <button
            type="button"
            onClick={addLanguage}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Dil Ekle
          </button>
        </div>
        {formData.languages.map((lang, index) => (
          <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <input
                type="text"
                value={lang.language}
                onChange={(e) => {
                  const newLangs = [...formData.languages];
                  newLangs[index].language = e.target.value;
                  setFormData({ ...formData, languages: newLangs });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Dil"
                required
              />
            </div>
            <div>
              <select
                value={lang.level}
                onChange={(e) => {
                  const newLangs = [...formData.languages];
                  newLangs[index].level = e.target.value;
                  setFormData({ ...formData, languages: newLangs });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Seviye Seçin</option>
                <option value="A1">A1 - Başlangıç</option>
                <option value="A2">A2 - Temel</option>
                <option value="B1">B1 - Orta</option>
                <option value="B2">B2 - Orta Üstü</option>
                <option value="C1">C1 - İleri</option>
                <option value="C2">C2 - Ana Dil</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="pt-5">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          CV Oluştur
        </button>
      </div>
    </form>
  );
} 