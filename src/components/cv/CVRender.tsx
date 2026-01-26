'use client';

import Image from 'next/image';
import type { TemplateVariant } from '@/components/templates/TemplateThumbnail';
import type { CVFormData } from '@/components/CVForm';

interface CVRenderProps {
  data: CVFormData;
  templateId?: TemplateVariant;
  className?: string;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' });
}

export default function CVRender({ data, templateId = 'modern', className = '' }: CVRenderProps) {
  const cn = `bg-white text-stone-900 ${className}`.trim();
  const { personalInfo, summary, workExperience, education, skills, languages, certifications, projects, references } = data;

  switch (templateId) {
    case 'modern':
      return (
        <div className={cn} style={{ maxWidth: '210mm', margin: '0 auto' }}>
          <div className="h-2 bg-teal-600 w-full" />
          <div className="p-8">
            <div className="mb-6 flex items-start gap-6">
              {personalInfo.profilePhoto && (
                <div className="flex-shrink-0">
                  <Image
                    src={personalInfo.profilePhoto}
                    alt={personalInfo.name || 'Profil'}
                    width={120}
                    height={120}
                    className="w-30 h-30 rounded-full object-cover border-2 border-teal-600"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-stone-900 mb-2">{personalInfo.name || 'Ad Soyad'}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-stone-600">
                  {personalInfo.email && <span>{personalInfo.email}</span>}
                  {personalInfo.phone && <span>{personalInfo.phone}</span>}
                  {personalInfo.location && <span>{personalInfo.location}</span>}
                  {personalInfo.website && (
                    <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                      {personalInfo.website}
                    </a>
                  )}
                  {personalInfo.linkedin && (
                    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-1 space-y-4">
                {summary && (
                  <div>
                    <h2 className="text-sm font-semibold text-teal-700 uppercase mb-2">Özet</h2>
                    <p className="text-sm text-stone-600 leading-relaxed">{summary}</p>
                  </div>
                )}
                {skills.length > 0 && skills[0] && (
                  <div>
                    <h2 className="text-sm font-semibold text-teal-700 uppercase mb-2">Yetenekler</h2>
                    <ul className="space-y-1">
                      {skills.filter(Boolean).map((skill, i) => (
                        <li key={i} className="text-sm text-stone-600">{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {languages.length > 0 && languages[0]?.language && (
                  <div>
                    <h2 className="text-sm font-semibold text-teal-700 uppercase mb-2">Diller</h2>
                    <ul className="space-y-1">
                      {languages.filter(l => l.language).map((lang, i) => (
                        <li key={i} className="text-sm text-stone-600">
                          {lang.language} - {lang.level}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {certifications && certifications.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-teal-700 uppercase mb-2">Sertifikalar</h2>
                    <ul className="space-y-2">
                      {certifications.map((cert, i) => (
                        <li key={i} className="text-sm text-stone-600">
                          <div className="font-medium">{cert.name}</div>
                          {cert.issuer && <div className="text-xs text-stone-500">{cert.issuer}</div>}
                          {cert.date && <div className="text-xs text-stone-500">{formatDate(cert.date)}</div>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="col-span-2 space-y-4">
                {workExperience.length > 0 && workExperience[0]?.company && (
                  <div>
                    <h2 className="text-sm font-semibold text-teal-700 uppercase mb-3">İş Deneyimi</h2>
                    <div className="space-y-4">
                      {workExperience.filter(we => we.company).map((exp, i) => (
                        <div key={i}>
                          <h3 className="font-semibold text-stone-900">{exp.position}</h3>
                          <p className="text-sm text-stone-600">{exp.company}</p>
                          <p className="text-xs text-stone-500">
                            {formatDate(exp.startDate)} - {exp.isCurrent ? 'Devam ediyor' : exp.endDate ? formatDate(exp.endDate) : 'Devam ediyor'}
                          </p>
                          {exp.description && <p className="text-sm text-stone-600 mt-1">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {education.length > 0 && education[0]?.institution && (
                  <div>
                    <h2 className="text-sm font-semibold text-teal-700 uppercase mb-3">Eğitim</h2>
                    <div className="space-y-3">
                      {education.filter(edu => edu.institution).map((edu, i) => (
                        <div key={i}>
                          <h3 className="font-semibold text-stone-900">{edu.degree}</h3>
                          <p className="text-sm text-stone-600">{edu.institution}</p>
                          {edu.field && <p className="text-xs text-stone-500">{edu.field}</p>}
                          {(edu.startDate || edu.endDate || edu.isCurrent) && (
                            <p className="text-xs text-stone-500">
                              {edu.startDate ? formatDate(edu.startDate) : ''} - {edu.isCurrent ? 'Devam ediyor' : edu.endDate ? formatDate(edu.endDate) : ''}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {projects && projects.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-teal-700 uppercase mb-3">Projeler</h2>
                    <div className="space-y-3">
                      {projects.map((project, i) => (
                        <div key={i}>
                          <h3 className="font-semibold text-stone-900">{project.name}</h3>
                          {project.description && <p className="text-sm text-stone-600 mt-1">{project.description}</p>}
                          {project.technologies && project.technologies.length > 0 && (
                            <p className="text-xs text-stone-500 mt-1">
                              Teknolojiler: {project.technologies.join(', ')}
                            </p>
                          )}
                          {project.url && (
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:underline">
                              {project.url}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {references && references.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-teal-700 uppercase mb-3">Referanslar</h2>
                    <div className="space-y-2">
                      {references.map((ref, i) => (
                        <div key={i} className="text-sm">
                          <div className="font-medium text-stone-900">{ref.name}</div>
                          <div className="text-stone-600">{ref.position} - {ref.company}</div>
                          {ref.email && <div className="text-xs text-stone-500">{ref.email}</div>}
                          {ref.phone && <div className="text-xs text-stone-500">{ref.phone}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    case 'classic':
      return (
        <div className={cn} style={{ maxWidth: '210mm', margin: '0 auto' }}>
          <div className="flex">
            <div className="w-16 bg-teal-700 text-white p-6">
              <div className="mb-8">
                {personalInfo.profilePhoto && (
                  <div className="mb-4 flex justify-center">
                    <Image
                      src={personalInfo.profilePhoto}
                      alt={personalInfo.name || 'Profil'}
                      width={100}
                      height={100}
                      className="w-25 h-25 rounded-full object-cover border-2 border-white"
                      unoptimized
                    />
                  </div>
                )}
                <h1 className="text-2xl font-bold mb-4">{personalInfo.name || 'Ad Soyad'}</h1>
                <div className="space-y-2 text-sm">
                  {personalInfo.email && <p>{personalInfo.email}</p>}
                  {personalInfo.phone && <p>{personalInfo.phone}</p>}
                  {personalInfo.location && <p>{personalInfo.location}</p>}
                  {personalInfo.website && (
                    <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="underline">
                      Website
                    </a>
                  )}
                  {personalInfo.linkedin && (
                    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="underline">
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
              {summary && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold uppercase mb-2">Özet</h2>
                  <p className="text-sm leading-relaxed">{summary}</p>
                </div>
              )}
              {skills.length > 0 && skills[0] && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold uppercase mb-2">Yetenekler</h2>
                  <ul className="space-y-1 text-sm">
                    {skills.filter(Boolean).map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}
              {certifications && certifications.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold uppercase mb-2">Sertifikalar</h2>
                  <ul className="space-y-1 text-sm">
                    {certifications.map((cert, i) => (
                      <li key={i}>
                        <div className="font-medium">{cert.name}</div>
                        {cert.issuer && <div className="text-xs opacity-90">{cert.issuer}</div>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex-1 p-6 space-y-6">
              {workExperience.length > 0 && workExperience[0]?.company && (
                <div>
                  <h2 className="text-lg font-semibold text-stone-900 mb-3 border-b-2 border-stone-200 pb-1">İş Deneyimi</h2>
                  <div className="space-y-4">
                    {workExperience.filter(we => we.company).map((exp, i) => (
                      <div key={i}>
                        <h3 className="font-semibold text-stone-900">{exp.position}</h3>
                        <p className="text-sm text-stone-600">{exp.company}</p>
                        <p className="text-xs text-stone-500">
                          {formatDate(exp.startDate)} - {exp.isCurrent ? 'Devam ediyor' : exp.endDate ? formatDate(exp.endDate) : 'Devam ediyor'}
                        </p>
                        {exp.description && <p className="text-sm text-stone-600 mt-1">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {education.length > 0 && education[0]?.institution && (
                <div>
                  <h2 className="text-lg font-semibold text-stone-900 mb-3 border-b-2 border-stone-200 pb-1">Eğitim</h2>
                  <div className="space-y-3">
                    {education.filter(edu => edu.institution).map((edu, i) => (
                      <div key={i}>
                        <h3 className="font-semibold text-stone-900">{edu.degree}</h3>
                        <p className="text-sm text-stone-600">{edu.institution}</p>
                        {edu.field && <p className="text-xs text-stone-500">{edu.field}</p>}
                        {(edu.startDate || edu.endDate || edu.isCurrent) && (
                          <p className="text-xs text-stone-500">
                            {edu.startDate ? formatDate(edu.startDate) : ''} - {edu.isCurrent ? 'Devam ediyor' : edu.endDate ? formatDate(edu.endDate) : ''}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {projects && projects.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-stone-900 mb-3 border-b-2 border-stone-200 pb-1">Projeler</h2>
                  <div className="space-y-3">
                    {projects.map((project, i) => (
                      <div key={i}>
                        <h3 className="font-semibold text-stone-900">{project.name}</h3>
                        {project.description && <p className="text-sm text-stone-600 mt-1">{project.description}</p>}
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:underline">
                            {project.url}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {references && references.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-stone-900 mb-3 border-b-2 border-stone-200 pb-1">Referanslar</h2>
                  <div className="space-y-2">
                    {references.map((ref, i) => (
                      <div key={i} className="text-sm">
                        <div className="font-medium text-stone-900">{ref.name}</div>
                        <div className="text-stone-600">{ref.position} - {ref.company}</div>
                        {ref.email && <div className="text-xs text-stone-500">{ref.email}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    case 'minimal':
      return (
        <div className={cn} style={{ maxWidth: '210mm', margin: '0 auto' }}>
          <div className="p-12 text-center">
            {personalInfo.profilePhoto && (
              <div className="mb-6 flex justify-center">
                <Image
                  src={personalInfo.profilePhoto}
                  alt={personalInfo.name || 'Profil'}
                  width={120}
                  height={120}
                  className="w-30 h-30 rounded-full object-cover border-2 border-stone-300 mx-auto"
                  unoptimized
                />
              </div>
            )}
            <h1 className="text-4xl font-light text-stone-900 mb-2">{personalInfo.name || 'Ad Soyad'}</h1>
            <div className="flex justify-center gap-4 text-sm text-stone-500 mb-8">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.website && (
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                  Website
                </a>
              )}
              {personalInfo.linkedin && (
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                  LinkedIn
                </a>
              )}
            </div>
            <div className="h-px bg-stone-200 w-full mb-8" />
            {summary && (
              <div className="mb-8 text-stone-600 leading-relaxed max-w-2xl mx-auto">
                <p>{summary}</p>
              </div>
            )}
            <div className="space-y-6 text-left max-w-2xl mx-auto">
              {workExperience.length > 0 && workExperience[0]?.company && (
                <div>
                  <h2 className="text-sm font-semibold text-stone-900 uppercase mb-3">İş Deneyimi</h2>
                  <div className="space-y-4">
                    {workExperience.filter(we => we.company).map((exp, i) => (
                      <div key={i}>
                        <h3 className="font-medium text-stone-900">{exp.position} - {exp.company}</h3>
                        <p className="text-xs text-stone-500">
                          {formatDate(exp.startDate)} - {exp.isCurrent ? 'Devam ediyor' : exp.endDate ? formatDate(exp.endDate) : 'Devam ediyor'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {education.length > 0 && education[0]?.institution && (
                <div>
                  <h2 className="text-sm font-semibold text-stone-900 uppercase mb-3">Eğitim</h2>
                  <div className="space-y-3">
                    {education.filter(edu => edu.institution).map((edu, i) => (
                      <div key={i}>
                        <h3 className="font-medium text-stone-900">{edu.degree}</h3>
                        <p className="text-sm text-stone-600">{edu.institution}</p>
                        {edu.field && <p className="text-xs text-stone-500">{edu.field}</p>}
                        {(edu.startDate || edu.endDate || edu.isCurrent) && (
                          <p className="text-xs text-stone-500">
                            {edu.startDate ? formatDate(edu.startDate) : ''} - {edu.isCurrent ? 'Devam ediyor' : edu.endDate ? formatDate(edu.endDate) : ''}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {certifications && certifications.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-stone-900 uppercase mb-3">Sertifikalar</h2>
                  <div className="space-y-2">
                    {certifications.map((cert, i) => (
                      <div key={i}>
                        <div className="font-medium text-stone-900">{cert.name}</div>
                        {cert.issuer && <div className="text-xs text-stone-500">{cert.issuer}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {projects && projects.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-stone-900 uppercase mb-3">Projeler</h2>
                  <div className="space-y-3">
                    {projects.map((project, i) => (
                      <div key={i}>
                        <h3 className="font-medium text-stone-900">{project.name}</h3>
                        {project.description && <p className="text-sm text-stone-600 mt-1">{project.description}</p>}
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:underline">
                            {project.url}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {references && references.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-stone-900 uppercase mb-3">Referanslar</h2>
                  <div className="space-y-2">
                    {references.map((ref, i) => (
                      <div key={i} className="text-sm">
                        <div className="font-medium text-stone-900">{ref.name}</div>
                        <div className="text-stone-600">{ref.position} - {ref.company}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    case 'professional':
      return (
        <div className={cn} style={{ maxWidth: '210mm', margin: '0 auto' }}>
          <div className="p-8">
            <div className="flex items-start gap-6 mb-6">
              {personalInfo.profilePhoto && (
                <div className="flex-shrink-0">
                  <Image
                    src={personalInfo.profilePhoto}
                    alt={personalInfo.name || 'Profil'}
                    width={100}
                    height={100}
                    className="w-25 h-25 rounded-full object-cover border-2 border-stone-300"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-stone-900 mb-2">{personalInfo.name || 'Ad Soyad'}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-stone-600">
                  {personalInfo.email && <span>{personalInfo.email}</span>}
                  {personalInfo.phone && <span>{personalInfo.phone}</span>}
                  {personalInfo.location && <span>{personalInfo.location}</span>}
                  {personalInfo.website && (
                    <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                      Website
                    </a>
                  )}
                  {personalInfo.linkedin && (
                    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="h-px bg-stone-300 mb-6" />
            {summary && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-2">Özet</h2>
                <p className="text-stone-600">{summary}</p>
              </div>
            )}
            {workExperience.length > 0 && workExperience[0]?.company && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-3 border-b border-stone-300 pb-1">İş Deneyimi</h2>
                <div className="space-y-4">
                  {workExperience.filter(we => we.company).map((exp, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-stone-900">{exp.position}</h3>
                      <p className="text-sm text-stone-600">{exp.company}</p>
                      <p className="text-xs text-stone-500">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Devam ediyor'}
                      </p>
                      {exp.description && <p className="text-sm text-stone-600 mt-1">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {education.length > 0 && education[0]?.institution && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-3 border-b border-stone-300 pb-1">Eğitim</h2>
                <div className="space-y-3">
                  {education.filter(edu => edu.institution).map((edu, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-stone-900">{edu.degree}</h3>
                      <p className="text-sm text-stone-600">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {skills.length > 0 && skills[0] && (
              <div>
                <h2 className="text-lg font-semibold text-stone-900 mb-3 border-b border-stone-300 pb-1">Yetenekler</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.filter(Boolean).map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-stone-100 text-stone-700 rounded text-sm">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    case 'executive':
      return (
        <div className={cn} style={{ maxWidth: '210mm', margin: '0 auto' }}>
          <div className="h-3 bg-stone-900 w-full" />
          <div className="p-8">
            <div className="text-center mb-8">
              {personalInfo.profilePhoto && (
                <div className="mb-4 flex justify-center">
                  <Image
                    src={personalInfo.profilePhoto}
                    alt={personalInfo.name || 'Profil'}
                    width={120}
                    height={120}
                    className="w-30 h-30 rounded-full object-cover border-4 border-stone-900 mx-auto"
                    unoptimized
                  />
                </div>
              )}
              <h1 className="text-4xl font-bold text-stone-900 mb-2">{personalInfo.name || 'Ad Soyad'}</h1>
              <div className="flex justify-center gap-4 text-sm text-stone-600">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.website && (
                  <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                    Website
                  </a>
                )}
                {personalInfo.linkedin && (
                  <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                {summary && (
                  <div className="mb-6">
                    <h2 className="text-sm font-semibold text-stone-700 uppercase mb-2">Özet</h2>
                    <p className="text-sm text-stone-600 leading-relaxed">{summary}</p>
                  </div>
                )}
                {skills.length > 0 && skills[0] && (
                  <div>
                    <h2 className="text-sm font-semibold text-stone-700 uppercase mb-2">Yetenekler</h2>
                    <ul className="space-y-1 text-sm text-stone-600">
                      {skills.filter(Boolean).map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div>
                {workExperience.length > 0 && workExperience[0]?.company && (
                  <div className="mb-6">
                    <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3">İş Deneyimi</h2>
                    <div className="space-y-4">
                      {workExperience.filter(we => we.company).map((exp, i) => (
                        <div key={i}>
                          <h3 className="font-semibold text-stone-900">{exp.position}</h3>
                          <p className="text-sm text-stone-600">{exp.company}</p>
                          <p className="text-xs text-stone-500">
                            {formatDate(exp.startDate)} - {exp.isCurrent ? 'Devam ediyor' : exp.endDate ? formatDate(exp.endDate) : 'Devam ediyor'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {education.length > 0 && education[0]?.institution && (
                  <div>
                    <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3">Eğitim</h2>
                    <div className="space-y-3">
                      {education.filter(edu => edu.institution).map((edu, i) => (
                        <div key={i}>
                          <h3 className="font-semibold text-stone-900">{edu.degree}</h3>
                          <p className="text-sm text-stone-600">{edu.institution}</p>
                          {edu.field && <p className="text-xs text-stone-500">{edu.field}</p>}
                          {(edu.startDate || edu.endDate || edu.isCurrent) && (
                            <p className="text-xs text-stone-500">
                              {edu.startDate ? formatDate(edu.startDate) : ''} - {edu.isCurrent ? 'Devam ediyor' : edu.endDate ? formatDate(edu.endDate) : ''}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {certifications && certifications.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3">Sertifikalar</h2>
                    <div className="space-y-2">
                      {certifications.map((cert, i) => (
                        <div key={i} className="text-sm">
                          <div className="font-medium text-stone-900">{cert.name}</div>
                          {cert.issuer && <div className="text-stone-600">{cert.issuer}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {projects && projects.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3">Projeler</h2>
                    <div className="space-y-3">
                      {projects.map((project, i) => (
                        <div key={i}>
                          <h3 className="font-semibold text-stone-900">{project.name}</h3>
                          {project.description && <p className="text-sm text-stone-600 mt-1">{project.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {references && references.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3">Referanslar</h2>
                    <div className="space-y-2">
                      {references.map((ref, i) => (
                        <div key={i} className="text-sm">
                          <div className="font-medium text-stone-900">{ref.name}</div>
                          <div className="text-stone-600">{ref.position} - {ref.company}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    case 'technical':
    case 'developer':
      return (
        <div className={cn} style={{ maxWidth: '210mm', margin: '0 auto' }}>
          <div className="p-8 bg-stone-50">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-stone-900 mb-2">{personalInfo.name || 'Ad Soyad'}</h1>
                <div className="text-sm text-stone-600">
                  {personalInfo.email && <p>{personalInfo.email}</p>}
                  {personalInfo.phone && <p>{personalInfo.phone}</p>}
                  {personalInfo.website && (
                    <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                      {personalInfo.website}
                    </a>
                  )}
                  {personalInfo.linkedin && (
                    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
              {skills.length > 0 && skills[0] && (
                <div className="flex flex-wrap gap-2 max-w-xs">
                  {skills.filter(Boolean).slice(0, 6).map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-teal-600 text-white text-xs rounded">{skill}</span>
                  ))}
                </div>
              )}
            </div>
            {summary && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-stone-700 uppercase mb-2">Özet</h2>
                <p className="text-sm text-stone-600">{summary}</p>
              </div>
            )}
            {workExperience.length > 0 && workExperience[0]?.company && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3">İş Deneyimi</h2>
                <div className="space-y-4">
                  {workExperience.filter(we => we.company).map((exp, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-stone-900">{exp.position} - {exp.company}</h3>
                      <p className="text-xs text-stone-500">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Devam ediyor'}
                      </p>
                      {exp.description && <p className="text-sm text-stone-600 mt-1">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {education.length > 0 && education[0]?.institution && (
              <div>
                <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3">Eğitim</h2>
                <div className="space-y-2">
                  {education.filter(edu => edu.institution).map((edu, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-stone-900">{edu.degree}</h3>
                      <p className="text-sm text-stone-600">{edu.institution}</p>
                      {edu.field && <p className="text-xs text-stone-500">{edu.field}</p>}
                      {(edu.startDate || edu.endDate || edu.isCurrent) && (
                        <p className="text-xs text-stone-500">
                          {edu.startDate ? formatDate(edu.startDate) : ''} - {edu.isCurrent ? 'Devam ediyor' : edu.endDate ? formatDate(edu.endDate) : ''}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {certifications && certifications.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3">Sertifikalar</h2>
                <div className="space-y-2">
                  {certifications.map((cert, i) => (
                    <div key={i} className="text-sm">
                      <div className="font-medium text-stone-900">{cert.name}</div>
                      {cert.issuer && <div className="text-stone-600">{cert.issuer}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {projects && projects.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3">Projeler</h2>
                <div className="space-y-3">
                  {projects.map((project, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-stone-900">{project.name}</h3>
                      {project.description && <p className="text-sm text-stone-600 mt-1">{project.description}</p>}
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:underline">
                          {project.url}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {references && references.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3">Referanslar</h2>
                <div className="space-y-2">
                  {references.map((ref, i) => (
                    <div key={i} className="text-sm">
                      <div className="font-medium text-stone-900">{ref.name}</div>
                      <div className="text-stone-600">{ref.position} - {ref.company}</div>
                      {ref.email && <div className="text-xs text-stone-500">{ref.email}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    case 'elegant':
      return (
        <div className={cn} style={{ maxWidth: '210mm', margin: '0 auto' }}>
          <div className="flex">
            <div className="w-20 bg-stone-100 flex-shrink-0 p-4">
              {personalInfo.profilePhoto && (
                <div className="mb-4">
                  <Image
                    src={personalInfo.profilePhoto}
                    alt={personalInfo.name || 'Profil'}
                    width={120}
                    height={120}
                    className="w-full rounded-full object-cover border-2 border-stone-300"
                    unoptimized
                  />
                </div>
              )}
            </div>
            <div className="flex-1 p-8 border-l border-stone-200">
              <h1 className="text-3xl font-light text-stone-900 mb-2">{personalInfo.name || 'Ad Soyad'}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-stone-500 mb-6">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.website && (
                  <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                    Website
                  </a>
                )}
                {personalInfo.linkedin && (
                  <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                    LinkedIn
                  </a>
                )}
              </div>
              {summary && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-2">Özet</h2>
                  <p className="text-sm text-stone-600 leading-relaxed">{summary}</p>
                </div>
              )}
              {workExperience.length > 0 && workExperience[0]?.company && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3 border-b border-stone-200 pb-1">İş Deneyimi</h2>
                  <div className="space-y-4">
                    {workExperience.filter(we => we.company).map((exp, i) => (
                      <div key={i}>
                        <h3 className="font-medium text-stone-900">{exp.position}</h3>
                        <p className="text-sm text-stone-600">{exp.company}</p>
                        <p className="text-xs text-stone-400">
                          {formatDate(exp.startDate)} - {exp.isCurrent ? 'Devam ediyor' : exp.endDate ? formatDate(exp.endDate) : 'Devam ediyor'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {education.length > 0 && education[0]?.institution && (
                <div>
                  <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3 border-b border-stone-200 pb-1">Eğitim</h2>
                  <div className="space-y-3">
                    {education.filter(edu => edu.institution).map((edu, i) => (
                      <div key={i}>
                        <h3 className="font-medium text-stone-900">{edu.degree}</h3>
                        <p className="text-sm text-stone-600">{edu.institution}</p>
                        {edu.field && <p className="text-xs text-stone-500">{edu.field}</p>}
                        {(edu.startDate || edu.endDate || edu.isCurrent) && (
                          <p className="text-xs text-stone-500">
                            {edu.startDate ? formatDate(edu.startDate) : ''} - {edu.isCurrent ? 'Devam ediyor' : edu.endDate ? formatDate(edu.endDate) : ''}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {certifications && certifications.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3 border-b border-stone-200 pb-1">Sertifikalar</h2>
                  <div className="space-y-2">
                    {certifications.map((cert, i) => (
                      <div key={i} className="text-sm">
                        <div className="font-medium text-stone-900">{cert.name}</div>
                        {cert.issuer && <div className="text-stone-600">{cert.issuer}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {projects && projects.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3 border-b border-stone-200 pb-1">Projeler</h2>
                  <div className="space-y-3">
                    {projects.map((project, i) => (
                      <div key={i}>
                        <h3 className="font-medium text-stone-900">{project.name}</h3>
                        {project.description && <p className="text-sm text-stone-600 mt-1">{project.description}</p>}
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:underline">
                            {project.url}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {references && references.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3 border-b border-stone-200 pb-1">Referanslar</h2>
                  <div className="space-y-2">
                    {references.map((ref, i) => (
                      <div key={i} className="text-sm">
                        <div className="font-medium text-stone-900">{ref.name}</div>
                        <div className="text-stone-600">{ref.position} - {ref.company}</div>
                        {ref.email && <div className="text-xs text-stone-500">{ref.email}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    case 'corporate':
      return (
        <div className={cn} style={{ maxWidth: '210mm', margin: '0 auto' }}>
          <div className="p-8">
            <h1 className="text-2xl font-bold text-stone-900 mb-1">{personalInfo.name || 'Ad Soyad'}</h1>
            <div className="text-sm text-stone-500 mb-6">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span className="mx-2">•</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.website && (
                <>
                  <span className="mx-2">•</span>
                  <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                    Website
                  </a>
                </>
              )}
              {personalInfo.linkedin && (
                <>
                  <span className="mx-2">•</span>
                  <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                    LinkedIn
                  </a>
                </>
              )}
            </div>
            <div className="h-px bg-stone-300 mb-4" />
            {summary && (
              <div className="mb-6">
                <h2 className="text-base font-semibold text-stone-900 mb-2">Özet</h2>
                <p className="text-sm text-stone-600">{summary}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-6">
              {workExperience.length > 0 && workExperience[0]?.company && (
                <div>
                  <h2 className="text-base font-semibold text-stone-900 mb-3 border-b border-stone-300 pb-1">İş Deneyimi</h2>
                  <div className="space-y-3">
                    {workExperience.filter(we => we.company).map((exp, i) => (
                      <div key={i}>
                        <h3 className="font-semibold text-stone-900 text-sm">{exp.position}</h3>
                        <p className="text-xs text-stone-600">{exp.company}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {education.length > 0 && education[0]?.institution && (
                <div>
                  <h2 className="text-base font-semibold text-stone-900 mb-3 border-b border-stone-300 pb-1">Eğitim</h2>
                  <div className="space-y-3">
                    {education.filter(edu => edu.institution).map((edu, i) => (
                      <div key={i}>
                        <h3 className="font-semibold text-stone-900 text-sm">{edu.degree}</h3>
                        <p className="text-xs text-stone-600">{edu.institution}</p>
                        {edu.field && <p className="text-xs text-stone-500">{edu.field}</p>}
                        {(edu.startDate || edu.endDate || edu.isCurrent) && (
                          <p className="text-xs text-stone-500">
                            {edu.startDate ? formatDate(edu.startDate) : ''} - {edu.isCurrent ? 'Devam ediyor' : edu.endDate ? formatDate(edu.endDate) : ''}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {skills.length > 0 && skills[0] && (
              <div className="mt-6">
                <h2 className="text-base font-semibold text-stone-900 mb-2 border-b border-stone-300 pb-1">Yetenekler</h2>
                <div className="grid grid-cols-3 gap-2">
                  {skills.filter(Boolean).map((skill, i) => (
                    <span key={i} className="text-xs text-stone-600">{skill}</span>
                  ))}
                </div>
              </div>
            )}
            {certifications && certifications.length > 0 && (
              <div className="mt-6">
                <h2 className="text-base font-semibold text-stone-900 mb-2 border-b border-stone-300 pb-1">Sertifikalar</h2>
                <div className="space-y-2">
                  {certifications.map((cert, i) => (
                    <div key={i} className="text-sm">
                      <div className="font-medium text-stone-900">{cert.name}</div>
                      {cert.issuer && <div className="text-xs text-stone-600">{cert.issuer}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {projects && projects.length > 0 && (
              <div className="mt-6">
                <h2 className="text-base font-semibold text-stone-900 mb-2 border-b border-stone-300 pb-1">Projeler</h2>
                <div className="space-y-2">
                  {projects.map((project, i) => (
                    <div key={i} className="text-sm">
                      <div className="font-medium text-stone-900">{project.name}</div>
                      {project.description && <div className="text-xs text-stone-600">{project.description}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {references && references.length > 0 && (
              <div className="mt-6">
                <h2 className="text-base font-semibold text-stone-900 mb-2 border-b border-stone-300 pb-1">Referanslar</h2>
                <div className="space-y-2">
                  {references.map((ref, i) => (
                    <div key={i} className="text-sm">
                      <div className="font-medium text-stone-900">{ref.name}</div>
                      <div className="text-xs text-stone-600">{ref.position} - {ref.company}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    case 'clean':
      return (
        <div className={cn} style={{ maxWidth: '210mm', margin: '0 auto' }}>
          <div className="p-12">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-light text-stone-900 mb-3">{personalInfo.name || 'Ad Soyad'}</h1>
              <div className="flex justify-center gap-6 text-sm text-stone-500">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
              </div>
            </div>
            <div className="h-px bg-stone-200 w-3/4 mx-auto mb-8" />
            {summary && (
              <div className="mb-8 text-center max-w-xl mx-auto">
                <p className="text-stone-600 leading-relaxed">{summary}</p>
              </div>
            )}
            <div className="space-y-8 max-w-2xl mx-auto">
              {workExperience.length > 0 && workExperience[0]?.company && (
                <div>
                  <h2 className="text-xs font-semibold text-stone-900 uppercase tracking-widest mb-4 text-center">İş Deneyimi</h2>
                  <div className="space-y-5">
                    {workExperience.filter(we => we.company).map((exp, i) => (
                      <div key={i} className="text-center">
                        <h3 className="font-medium text-stone-900">{exp.position}</h3>
                        <p className="text-sm text-stone-500">{exp.company}</p>
                        <p className="text-xs text-stone-400 mt-1">
                          {formatDate(exp.startDate)} - {exp.isCurrent ? 'Devam ediyor' : exp.endDate ? formatDate(exp.endDate) : 'Devam ediyor'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {education.length > 0 && education[0]?.institution && (
                <div>
                  <h2 className="text-xs font-semibold text-stone-900 uppercase tracking-widest mb-4 text-center">Eğitim</h2>
                  <div className="space-y-4">
                    {education.filter(edu => edu.institution).map((edu, i) => (
                      <div key={i} className="text-center">
                        <h3 className="font-medium text-stone-900">{edu.degree}</h3>
                        <p className="text-sm text-stone-500">{edu.institution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    case 'creative':
    case 'artistic':
    case 'innovative':
      return (
        <div className={cn} style={{ maxWidth: '210mm', margin: '0 auto' }}>
          <div className="p-8">
            <div className="flex gap-4 mb-6">
              {personalInfo.profilePhoto && (
                <div className="flex-shrink-0">
                  <Image
                    src={personalInfo.profilePhoto}
                    alt={personalInfo.name || 'Profil'}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover border-2 border-teal-500"
                    unoptimized
                  />
                </div>
              )}
              <div className="w-2 bg-teal-500 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-stone-900 mb-1">{personalInfo.name || 'Ad Soyad'}</h1>
                <div className="text-sm text-stone-500">
                  {personalInfo.email && <span>{personalInfo.email}</span>}
                  {personalInfo.phone && <span className="mx-2">•</span>}
                  {personalInfo.phone && <span>{personalInfo.phone}</span>}
                  {personalInfo.website && (
                    <>
                      <span className="mx-2">•</span>
                      <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                        Website
                      </a>
                    </>
                  )}
                  {personalInfo.linkedin && (
                    <>
                      <span className="mx-2">•</span>
                      <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                        LinkedIn
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
            {summary && (
              <div className="mb-6 border-l-2 border-stone-200 pl-4">
                <p className="text-stone-600 leading-relaxed">{summary}</p>
              </div>
            )}
            {workExperience.length > 0 && workExperience[0]?.company && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-stone-900 uppercase mb-3">İş Deneyimi</h2>
                <div className="space-y-4">
                  {workExperience.filter(we => we.company).map((exp, i) => (
                    <div key={i} className="border-l-2 border-teal-200 pl-4">
                      <h3 className="font-semibold text-stone-900">{exp.position}</h3>
                      <p className="text-sm text-stone-600">{exp.company}</p>
                      <p className="text-xs text-stone-500">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Devam ediyor'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {education.length > 0 && education[0]?.institution && (
              <div>
                <h2 className="text-sm font-semibold text-stone-900 uppercase mb-3">Eğitim</h2>
                <div className="space-y-3">
                  {education.filter(edu => edu.institution).map((edu, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-stone-900">{edu.degree}</h3>
                      <p className="text-sm text-stone-600">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    case 'portfolio':
      return (
        <div className={cn} style={{ maxWidth: '210mm', margin: '0 auto' }}>
          <div className="flex">
            <div className="w-32 bg-stone-300 flex-shrink-0" />
            <div className="flex-1 p-8">
              <h1 className="text-3xl font-bold text-stone-900 mb-2">{personalInfo.name || 'Ad Soyad'}</h1>
              <div className="text-sm text-stone-600 mb-6">
                {personalInfo.email && <p>{personalInfo.email}</p>}
                {personalInfo.phone && <p>{personalInfo.phone}</p>}
              </div>
              {summary && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-stone-700 uppercase mb-2">Özet</h2>
                  <p className="text-sm text-stone-600 leading-relaxed">{summary}</p>
                </div>
              )}
              {workExperience.length > 0 && workExperience[0]?.company && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3">İş Deneyimi</h2>
                  <div className="space-y-4">
                    {workExperience.filter(we => we.company).map((exp, i) => (
                      <div key={i}>
                        <h3 className="font-semibold text-stone-900">{exp.position}</h3>
                        <p className="text-sm text-stone-600">{exp.company}</p>
                        <p className="text-xs text-stone-500">
                          {formatDate(exp.startDate)} - {exp.isCurrent ? 'Devam ediyor' : exp.endDate ? formatDate(exp.endDate) : 'Devam ediyor'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {education.length > 0 && education[0]?.institution && (
                <div>
                  <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3">Eğitim</h2>
                  <div className="space-y-3">
                    {education.filter(edu => edu.institution).map((edu, i) => (
                      <div key={i}>
                        <h3 className="font-semibold text-stone-900">{edu.degree}</h3>
                        <p className="text-sm text-stone-600">{edu.institution}</p>
                        {edu.field && <p className="text-xs text-stone-500">{edu.field}</p>}
                        {(edu.startDate || edu.endDate || edu.isCurrent) && (
                          <p className="text-xs text-stone-500">
                            {edu.startDate ? formatDate(edu.startDate) : ''} - {edu.isCurrent ? 'Devam ediyor' : edu.endDate ? formatDate(edu.endDate) : ''}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {certifications && certifications.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3">Sertifikalar</h2>
                  <div className="space-y-2">
                    {certifications.map((cert, i) => (
                      <div key={i} className="text-sm">
                        <div className="font-medium text-stone-900">{cert.name}</div>
                        {cert.issuer && <div className="text-stone-600">{cert.issuer}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {projects && projects.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3">Projeler</h2>
                  <div className="space-y-3">
                    {projects.map((project, i) => (
                      <div key={i}>
                        <h3 className="font-semibold text-stone-900">{project.name}</h3>
                        {project.description && <p className="text-sm text-stone-600 mt-1">{project.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {references && references.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3">Referanslar</h2>
                  <div className="space-y-2">
                    {references.map((ref, i) => (
                      <div key={i} className="text-sm">
                        <div className="font-medium text-stone-900">{ref.name}</div>
                        <div className="text-stone-600">{ref.position} - {ref.company}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    case 'academic':
    case 'scholar':
      return (
        <div className={cn} style={{ maxWidth: '210mm', margin: '0 auto' }}>
          <div className="p-8">
            <div className="text-center mb-8">
              {personalInfo.profilePhoto && (
                <div className="mb-4 flex justify-center">
                  <Image
                    src={personalInfo.profilePhoto}
                    alt={personalInfo.name || 'Profil'}
                    width={120}
                    height={120}
                    className="w-30 h-30 rounded-full object-cover border-2 border-stone-300 mx-auto"
                    unoptimized
                  />
                </div>
              )}
              <h1 className="text-3xl font-bold text-stone-900 mb-2">{personalInfo.name || 'Ad Soyad'}</h1>
              <div className="text-sm text-stone-500">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span className="mx-2">•</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.website && (
                  <>
                    <span className="mx-2">•</span>
                    <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                      Website
                    </a>
                  </>
                )}
                {personalInfo.linkedin && (
                  <>
                    <span className="mx-2">•</span>
                    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                      LinkedIn
                    </a>
                  </>
                )}
              </div>
            </div>
            <div className="h-px bg-stone-300 mb-6" />
            {summary && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-stone-700 uppercase mb-2">Özet</h2>
                <p className="text-sm text-stone-600 leading-relaxed">{summary}</p>
              </div>
            )}
            {education.length > 0 && education[0]?.institution && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3 border-b border-stone-200 pb-1">Eğitim</h2>
                <div className="space-y-3">
                  {education.filter(edu => edu.institution).map((edu, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-stone-900">{edu.degree}</h3>
                      <p className="text-sm text-stone-600">{edu.institution}</p>
                      {edu.field && <p className="text-xs text-stone-500">{edu.field}</p>}
                      {(edu.startDate || edu.endDate || edu.isCurrent) && (
                        <p className="text-xs text-stone-500">
                          {edu.startDate ? formatDate(edu.startDate) : ''} - {edu.isCurrent ? 'Devam ediyor' : edu.endDate ? formatDate(edu.endDate) : ''}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {workExperience.length > 0 && workExperience[0]?.company && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3 border-b border-stone-200 pb-1">İş Deneyimi</h2>
                <div className="space-y-4">
                  {workExperience.filter(we => we.company).map((exp, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-stone-900">{exp.position}</h3>
                      <p className="text-sm text-stone-600">{exp.company}</p>
                      <p className="text-xs text-stone-500">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Devam ediyor'}
                      </p>
                      {exp.description && <p className="text-sm text-stone-600 mt-1">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {skills.length > 0 && skills[0] && (
              <div>
                <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3 border-b border-stone-200 pb-1">Yetenekler</h2>
                <ul className="space-y-1 text-sm text-stone-600">
                  {skills.filter(Boolean).map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
            {certifications && certifications.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3 border-b border-stone-200 pb-1">Sertifikalar</h2>
                <div className="space-y-2">
                  {certifications.map((cert, i) => (
                    <div key={i} className="text-sm">
                      <div className="font-medium text-stone-900">{cert.name}</div>
                      {cert.issuer && <div className="text-stone-600">{cert.issuer}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {projects && projects.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3 border-b border-stone-200 pb-1">Projeler</h2>
                <div className="space-y-3">
                  {projects.map((project, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-stone-900">{project.name}</h3>
                      {project.description && <p className="text-sm text-stone-600 mt-1">{project.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {references && references.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-stone-700 uppercase mb-3 border-b border-stone-200 pb-1">Referanslar</h2>
                <div className="space-y-2">
                  {references.map((ref, i) => (
                    <div key={i} className="text-sm">
                      <div className="font-medium text-stone-900">{ref.name}</div>
                      <div className="text-stone-600">{ref.position} - {ref.company}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    default:
      return (
        <div className={cn} style={{ maxWidth: '210mm', margin: '0 auto' }}>
          <div className="h-2 bg-teal-600 w-full" />
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-stone-900 mb-2">{personalInfo.name || 'Ad Soyad'}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-stone-600">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.location && <span>{personalInfo.location}</span>}
              </div>
            </div>
            {summary && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-teal-700 uppercase mb-2">Özet</h2>
                <p className="text-sm text-stone-600 leading-relaxed">{summary}</p>
              </div>
            )}
            {workExperience.length > 0 && workExperience[0]?.company && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-teal-700 uppercase mb-3">İş Deneyimi</h2>
                <div className="space-y-4">
                  {workExperience.filter(we => we.company).map((exp, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-stone-900">{exp.position}</h3>
                      <p className="text-sm text-stone-600">{exp.company}</p>
                      <p className="text-xs text-stone-500">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Devam ediyor'}
                      </p>
                      {exp.description && <p className="text-sm text-stone-600 mt-1">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {education.length > 0 && education[0]?.institution && (
              <div>
                <h2 className="text-sm font-semibold text-teal-700 uppercase mb-3">Eğitim</h2>
                <div className="space-y-3">
                  {education.filter(edu => edu.institution).map((edu, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-stone-900">{edu.degree}</h3>
                      <p className="text-sm text-stone-600">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
  }
}
