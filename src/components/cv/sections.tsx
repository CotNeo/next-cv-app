'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import type { CVFormData } from '@/components/CVForm';
import type { CVLabels } from '@/i18n/cv-labels';
import {
  dateRange,
  hasSection,
  nonEmpty,
  safeHref,
  type SectionKey,
} from '@/components/cv/section-data';

export {
  ALL_SECTIONS,
  ASIDE_SECTIONS,
  MAIN_SECTIONS,
  hasSection,
  nonEmpty,
  safeHref,
  type SectionKey,
} from '@/components/cv/section-data';

/**
 * Typography tokens a template hands to the shared section renderers.
 *
 * Every template used to inline its own copy of each section, which is how
 * languages, certifications, projects and references quietly went missing from
 * most designs. Sections now live here once and templates only supply styling,
 * so adding a field cannot silently skip a layout.
 */
export interface Tone {
  heading: string;
  title: string;
  subtitle: string;
  meta: string;
  body: string;
  link: string;
  chip: string;
  /** Applied to each item wrapper — `text-center` for the centred layouts. */
  align?: string;
  /** Skills as a bulleted list or as accent chips. */
  skillStyle?: 'list' | 'chips';
  /** Vertical rhythm between items inside a section. */
  itemGap?: string;
}

export interface RenderContext {
  data: CVFormData;
  L: CVLabels;
  fmt: (value?: string) => string;
}

export function Section({
  title,
  tone,
  className = '',
  children,
}: {
  title: string;
  tone: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={className}>
      <h2 className={tone.heading}>{title}</h2>
      {children}
    </section>
  );
}

export function ProfilePhoto({
  src,
  alt,
  size,
  className,
}: {
  src?: string;
  alt: string;
  size: number;
  className: string;
}) {
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      unoptimized
    />
  );
}

function SummarySection({ ctx, tone }: { ctx: RenderContext; tone: Tone }) {
  return (
    <Section title={ctx.L.summary} tone={tone}>
      <p className={tone.body}>{ctx.data.summary}</p>
    </Section>
  );
}

function ExperienceSection({ ctx, tone }: { ctx: RenderContext; tone: Tone }) {
  const items = ctx.data.workExperience.filter(
    (item) => nonEmpty(item.company) || nonEmpty(item.position)
  );
  return (
    <Section title={ctx.L.experience} tone={tone}>
      <div className={tone.itemGap ?? 'space-y-4'}>
        {items.map((item, index) => {
          const range = dateRange(item.startDate, item.endDate, item.isCurrent, ctx.fmt, ctx.L.present);
          return (
            <div key={index} className={tone.align}>
              {nonEmpty(item.position) && <h3 className={tone.title}>{item.position}</h3>}
              {nonEmpty(item.company) && <p className={tone.subtitle}>{item.company}</p>}
              {range && <p className={tone.meta}>{range}</p>}
              {nonEmpty(item.description) && (
                <p className={`${tone.body} mt-1 whitespace-pre-line`}>{item.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function EducationSection({ ctx, tone }: { ctx: RenderContext; tone: Tone }) {
  const items = ctx.data.education.filter(
    (item) => nonEmpty(item.institution) || nonEmpty(item.degree)
  );
  return (
    <Section title={ctx.L.education} tone={tone}>
      <div className={tone.itemGap ?? 'space-y-3'}>
        {items.map((item, index) => {
          const range = dateRange(item.startDate, item.endDate, item.isCurrent, ctx.fmt, ctx.L.present);
          return (
            <div key={index} className={tone.align}>
              {nonEmpty(item.degree) && <h3 className={tone.title}>{item.degree}</h3>}
              {nonEmpty(item.institution) && <p className={tone.subtitle}>{item.institution}</p>}
              {nonEmpty(item.field) && <p className={tone.meta}>{item.field}</p>}
              {range && <p className={tone.meta}>{range}</p>}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function SkillsSection({ ctx, tone }: { ctx: RenderContext; tone: Tone }) {
  const skills = ctx.data.skills.filter(nonEmpty);
  return (
    <Section title={ctx.L.skills} tone={tone}>
      {tone.skillStyle === 'chips' ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className={tone.chip}>
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <ul className={`space-y-1 ${tone.align ?? ''}`}>
          {skills.map((skill, index) => (
            <li key={index} className={tone.body}>
              {skill}
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

function LanguagesSection({ ctx, tone }: { ctx: RenderContext; tone: Tone }) {
  const items = (ctx.data.languages ?? []).filter((item) => nonEmpty(item.language));
  return (
    <Section title={ctx.L.languages} tone={tone}>
      <ul className={`space-y-1 ${tone.align ?? ''}`}>
        {items.map((item, index) => (
          <li key={index} className={tone.body}>
            {item.language}
            {nonEmpty(item.level) && <span className={tone.meta}> — {item.level}</span>}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function CertificationsSection({ ctx, tone }: { ctx: RenderContext; tone: Tone }) {
  const items = (ctx.data.certifications ?? []).filter((item) => nonEmpty(item.name));
  return (
    <Section title={ctx.L.certifications} tone={tone}>
      <div className={tone.itemGap ?? 'space-y-2'}>
        {items.map((item, index) => (
          <div key={index} className={tone.align}>
            <h3 className={tone.title}>
              {safeHref(item.credentialUrl) ? (
                <a
                  href={safeHref(item.credentialUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={tone.link}
                >
                  {item.name}
                </a>
              ) : (
                item.name
              )}
            </h3>
            {nonEmpty(item.issuer) && <p className={tone.subtitle}>{item.issuer}</p>}
            {ctx.fmt(item.date) && <p className={tone.meta}>{ctx.fmt(item.date)}</p>}
            {nonEmpty(item.credentialId) && (
              <p className={tone.meta}>
                {ctx.L.credentialId}: {item.credentialId}
              </p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

function ProjectsSection({ ctx, tone }: { ctx: RenderContext; tone: Tone }) {
  const items = (ctx.data.projects ?? []).filter((item) => nonEmpty(item.name));
  return (
    <Section title={ctx.L.projects} tone={tone}>
      <div className={tone.itemGap ?? 'space-y-3'}>
        {items.map((item, index) => {
          const range = dateRange(item.startDate, item.endDate, item.isCurrent, ctx.fmt, ctx.L.present);
          const technologies = (item.technologies ?? []).filter(nonEmpty);
          return (
            <div key={index} className={tone.align}>
              <h3 className={tone.title}>
                {safeHref(item.url) ? (
                  <a
                    href={safeHref(item.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={tone.link}
                  >
                    {item.name}
                  </a>
                ) : (
                  item.name
                )}
              </h3>
              {range && <p className={tone.meta}>{range}</p>}
              {nonEmpty(item.description) && (
                <p className={`${tone.body} whitespace-pre-line`}>{item.description}</p>
              )}
              {technologies.length > 0 && (
                <p className={tone.meta}>
                  {ctx.L.technologies}: {technologies.join(', ')}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function ReferencesSection({ ctx, tone }: { ctx: RenderContext; tone: Tone }) {
  const items = (ctx.data.references ?? []).filter((item) => nonEmpty(item.name));
  return (
    <Section title={ctx.L.references} tone={tone}>
      <div className={tone.itemGap ?? 'space-y-2'}>
        {items.map((item, index) => (
          <div key={index} className={tone.align}>
            <h3 className={tone.title}>{item.name}</h3>
            {(nonEmpty(item.position) || nonEmpty(item.company)) && (
              <p className={tone.subtitle}>
                {[item.position, item.company].filter(nonEmpty).join(' — ')}
              </p>
            )}
            {(nonEmpty(item.email) || nonEmpty(item.phone)) && (
              <p className={tone.meta}>{[item.email, item.phone].filter(nonEmpty).join(' · ')}</p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

const RENDERERS: Record<
  SectionKey,
  (props: { ctx: RenderContext; tone: Tone }) => ReactNode
> = {
  summary: SummarySection,
  experience: ExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  languages: LanguagesSection,
  certifications: CertificationsSection,
  projects: ProjectsSection,
  references: ReferencesSection,
};

/**
 * Renders the requested sections in order, skipping the ones with no data.
 * Templates call this instead of hand-rolling each block.
 */
export function Sections({
  keys,
  ctx,
  tone,
  className = 'space-y-6',
}: {
  keys: readonly SectionKey[];
  ctx: RenderContext;
  tone: Tone;
  className?: string;
}) {
  const visible = keys.filter((key) => hasSection(key, ctx.data));
  if (visible.length === 0) return null;

  return (
    <div className={className}>
      {visible.map((key) => {
        const Renderer = RENDERERS[key];
        return <Renderer key={key} ctx={ctx} tone={tone} />;
      })}
    </div>
  );
}

