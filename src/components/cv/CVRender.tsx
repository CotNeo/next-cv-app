'use client';

import type { CVFormData } from '@/components/CVForm';
import {
  ProfilePhoto,
  Sections,
  type RenderContext,
  type Tone,
} from '@/components/cv/sections';
import {
  ALL_SECTIONS,
  ASIDE_SECTIONS,
  MAIN_SECTIONS,
  hasSection,
  nonEmpty,
  safeHref,
} from '@/components/cv/section-data';
import { DEFAULT_TEMPLATE, type TemplateVariant } from '@/data/templates';
import { formatCVDate, getCVLabels } from '@/i18n/cv-labels';
import { defaultLocale, textDirection, type ValidLocale } from '@/i18n/settings';

interface CVRenderProps {
  data: CVFormData;
  templateId?: TemplateVariant;
  className?: string;
  /** Language the CV content is written in; drives section labels and dates. */
  locale?: ValidLocale;
}

const PAGE_STYLE = { maxWidth: '210mm', margin: '0 auto' } as const;

/* -------------------------------------------------------------------------- */
/* Typography tones                                                           */
/* -------------------------------------------------------------------------- */

const tealTone: Tone = {
  heading: 'text-sm font-semibold text-teal-700 uppercase tracking-wide mb-2',
  title: 'font-semibold text-stone-900',
  subtitle: 'text-sm text-stone-600',
  meta: 'text-xs text-stone-500',
  body: 'text-sm text-stone-600 leading-relaxed',
  link: 'text-teal-700 hover:underline',
  chip: 'px-2 py-1 bg-teal-600 text-white text-xs rounded',
};

const stoneTone: Tone = {
  ...tealTone,
  heading: 'text-sm font-semibold text-stone-700 uppercase tracking-wide mb-2',
  link: 'text-teal-600 hover:underline',
  chip: 'px-2 py-1 bg-stone-200 text-stone-700 text-xs rounded',
};

const borderedTone: Tone = {
  ...stoneTone,
  heading:
    'text-lg font-semibold text-stone-900 mb-3 border-b border-stone-300 pb-1',
};

const compactBorderedTone: Tone = {
  ...stoneTone,
  heading:
    'text-base font-semibold text-stone-900 mb-2 border-b border-stone-300 pb-1',
  itemGap: 'space-y-3',
};

const centeredTone: Tone = {
  ...stoneTone,
  heading:
    'text-xs font-semibold text-stone-900 uppercase tracking-widest mb-4 text-center',
  title: 'font-medium text-stone-900',
  subtitle: 'text-sm text-stone-500',
  meta: 'text-xs text-stone-400',
  body: 'text-sm text-stone-600 leading-relaxed',
  align: 'text-center',
  itemGap: 'space-y-5',
};

const elegantTone: Tone = {
  ...stoneTone,
  heading:
    'text-sm font-semibold text-stone-700 uppercase tracking-widest mb-3 border-b border-stone-200 pb-1',
  title: 'font-medium text-stone-900',
};

const monoTone: Tone = {
  ...stoneTone,
  heading:
    'text-sm font-mono font-semibold text-stone-700 uppercase tracking-wider mb-2',
  meta: 'text-xs font-mono text-stone-500',
  skillStyle: 'chips',
  chip: 'px-2 py-1 bg-stone-800 text-white text-xs font-mono rounded',
};

const technicalTone: Tone = {
  ...stoneTone,
  skillStyle: 'chips',
  chip: 'px-2 py-1 bg-teal-600 text-white text-xs rounded',
};

/* -------------------------------------------------------------------------- */
/* Header building blocks                                                     */
/* -------------------------------------------------------------------------- */

type ContactVariant = 'inline' | 'stacked' | 'bullets';

function ContactDetails({
  info,
  variant,
  className = '',
  itemClass = '',
  linkClass = '',
  showLocation = true,
}: {
  info: CVFormData['personalInfo'];
  variant: ContactVariant;
  className?: string;
  itemClass?: string;
  linkClass?: string;
  showLocation?: boolean;
}) {
  const entries: { key: string; node: React.ReactNode }[] = [];

  if (nonEmpty(info.email)) entries.push({ key: 'email', node: info.email });
  if (nonEmpty(info.phone)) entries.push({ key: 'phone', node: info.phone });
  if (showLocation && nonEmpty(info.location)) {
    entries.push({ key: 'location', node: info.location });
  }
  const website = safeHref(info.website);
  if (website) {
    entries.push({
      key: 'website',
      node: (
        <a href={website} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {website.replace(/^https?:\/\//, '')}
        </a>
      ),
    });
  }
  const linkedin = safeHref(info.linkedin);
  if (linkedin) {
    entries.push({
      key: 'linkedin',
      node: (
        <a href={linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
          LinkedIn
        </a>
      ),
    });
  }

  if (entries.length === 0) return null;

  if (variant === 'stacked') {
    return (
      <div className={className}>
        {entries.map((entry) => (
          <p key={entry.key} className={itemClass}>
            {entry.node}
          </p>
        ))}
      </div>
    );
  }

  if (variant === 'bullets') {
    return (
      <div className={className}>
        {entries.map((entry, index) => (
          <span key={entry.key} className={itemClass}>
            {index > 0 && <span className="mx-2">•</span>}
            {entry.node}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {entries.map((entry) => (
        <span key={entry.key} className={itemClass}>
          {entry.node}
        </span>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section splits                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Splits the section list across two columns while guaranteeing that nothing is
 * dropped: anything the preferred column cannot show still lands in the other.
 */
function splitSections(data: CVFormData) {
  const aside = ASIDE_SECTIONS.filter((key) => hasSection(key, data));
  const main = MAIN_SECTIONS.filter((key) => hasSection(key, data));
  return { aside, main };
}

/* -------------------------------------------------------------------------- */
/* Templates                                                                  */
/* -------------------------------------------------------------------------- */

interface TemplateProps {
  ctx: RenderContext;
  cn: string;
  dir: 'ltr' | 'rtl';
}

function Modern({ ctx, cn, dir }: TemplateProps) {
  const { personalInfo } = ctx.data;
  const { aside, main } = splitSections(ctx.data);

  return (
    <div className={cn} dir={dir} style={PAGE_STYLE}>
      <div className="h-2 bg-teal-600 w-full" />
      <div className="p-8">
        <header className="mb-6 flex items-start gap-6">
          <ProfilePhoto
            src={personalInfo.profilePhoto}
            alt={personalInfo.name || ctx.L.namePlaceholder}
            size={120}
            className="h-28 w-28 flex-shrink-0 rounded-full object-cover border-2 border-teal-600"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-stone-900 mb-2">
              {personalInfo.name || ctx.L.namePlaceholder}
            </h1>
            <ContactDetails
              info={personalInfo}
              variant="inline"
              className="text-sm text-stone-600"
              linkClass="text-teal-600 hover:underline"
            />
          </div>
        </header>
        <div className="grid grid-cols-3 gap-6">
          <Sections keys={aside} ctx={ctx} tone={tealTone} className="col-span-1 space-y-5" />
          <Sections keys={main} ctx={ctx} tone={tealTone} className="col-span-2 space-y-6" />
        </div>
      </div>
    </div>
  );
}

function Classic({ ctx, cn, dir }: TemplateProps) {
  const { personalInfo } = ctx.data;

  return (
    <div className={cn} dir={dir} style={PAGE_STYLE}>
      <div className="flex min-h-full">
        <div className="w-2 flex-shrink-0 bg-teal-700" />
        <div className="flex-1 p-8">
          <header className="mb-6 flex items-start gap-5">
            <ProfilePhoto
              src={personalInfo.profilePhoto}
              alt={personalInfo.name || ctx.L.namePlaceholder}
              size={96}
              className="h-24 w-24 flex-shrink-0 rounded-full object-cover border-2 border-teal-700"
            />
            <div>
              <h1 className="text-3xl font-bold text-stone-900 mb-1">
                {personalInfo.name || ctx.L.namePlaceholder}
              </h1>
              <ContactDetails
                info={personalInfo}
                variant="inline"
                className="text-sm text-stone-600"
                linkClass="text-teal-700 hover:underline"
              />
            </div>
          </header>
          <Sections keys={ALL_SECTIONS} ctx={ctx} tone={tealTone} />
        </div>
      </div>
    </div>
  );
}

function Minimal({ ctx, cn, dir }: TemplateProps) {
  const { personalInfo } = ctx.data;

  return (
    <div className={cn} dir={dir} style={PAGE_STYLE}>
      <div className="p-12">
        <header className="text-center">
          <ProfilePhoto
            src={personalInfo.profilePhoto}
            alt={personalInfo.name || ctx.L.namePlaceholder}
            size={112}
            className="mx-auto mb-6 h-28 w-28 rounded-full object-cover border border-stone-300"
          />
          <h1 className="text-4xl font-light text-stone-900 mb-2">
            {personalInfo.name || ctx.L.namePlaceholder}
          </h1>
          <ContactDetails
            info={personalInfo}
            variant="inline"
            className="justify-center text-sm text-stone-500"
            linkClass="text-teal-600 hover:underline"
          />
        </header>
        <div className="h-px bg-stone-200 w-full my-8" />
        <div className="max-w-2xl mx-auto">
          <Sections keys={ALL_SECTIONS} ctx={ctx} tone={stoneTone} />
        </div>
      </div>
    </div>
  );
}

function Professional({ ctx, cn, dir }: TemplateProps) {
  const { personalInfo } = ctx.data;

  return (
    <div className={cn} dir={dir} style={PAGE_STYLE}>
      <div className="p-8">
        <header className="flex items-start gap-6 mb-6">
          <ProfilePhoto
            src={personalInfo.profilePhoto}
            alt={personalInfo.name || ctx.L.namePlaceholder}
            size={96}
            className="h-24 w-24 flex-shrink-0 rounded-full object-cover border-2 border-stone-300"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-stone-900 mb-2">
              {personalInfo.name || ctx.L.namePlaceholder}
            </h1>
            <ContactDetails
              info={personalInfo}
              variant="inline"
              className="text-sm text-stone-600"
              linkClass="text-teal-600 hover:underline"
            />
          </div>
        </header>
        <div className="h-px bg-stone-300 mb-6" />
        <Sections keys={ALL_SECTIONS} ctx={ctx} tone={borderedTone} />
      </div>
    </div>
  );
}

function Executive({ ctx, cn, dir }: TemplateProps) {
  const { personalInfo } = ctx.data;
  const { aside, main } = splitSections(ctx.data);

  return (
    <div className={cn} dir={dir} style={PAGE_STYLE}>
      <div className="h-3 bg-stone-900 w-full" />
      <div className="p-8">
        <header className="text-center mb-8">
          <ProfilePhoto
            src={personalInfo.profilePhoto}
            alt={personalInfo.name || ctx.L.namePlaceholder}
            size={112}
            className="mx-auto mb-4 h-28 w-28 rounded-full object-cover border-4 border-stone-900"
          />
          <h1 className="text-4xl font-bold text-stone-900 mb-2">
            {personalInfo.name || ctx.L.namePlaceholder}
          </h1>
          <ContactDetails
            info={personalInfo}
            variant="inline"
            className="justify-center text-sm text-stone-600"
            linkClass="text-teal-600 hover:underline"
          />
        </header>
        <div className="grid grid-cols-2 gap-8">
          <Sections keys={aside} ctx={ctx} tone={stoneTone} />
          <Sections keys={main} ctx={ctx} tone={stoneTone} />
        </div>
      </div>
    </div>
  );
}

function Technical({ ctx, cn, dir }: TemplateProps) {
  const { personalInfo, skills } = ctx.data;
  const topSkills = skills.filter(nonEmpty).slice(0, 8);
  const bodySections = ALL_SECTIONS.filter((key) => key !== 'skills');

  return (
    <div className={cn} dir={dir} style={PAGE_STYLE}>
      <div className="p-8 bg-stone-50">
        <header className="flex justify-between items-start gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 mb-2">
              {personalInfo.name || ctx.L.namePlaceholder}
            </h1>
            <ContactDetails
              info={personalInfo}
              variant="stacked"
              className="text-sm text-stone-600"
              linkClass="text-teal-600 hover:underline"
            />
          </div>
          {topSkills.length > 0 && (
            <div className="flex flex-wrap justify-end gap-2 max-w-xs">
              {topSkills.map((skill, index) => (
                <span key={index} className={technicalTone.chip}>
                  {skill}
                </span>
              ))}
            </div>
          )}
        </header>
        <Sections keys={bodySections} ctx={ctx} tone={technicalTone} />
      </div>
    </div>
  );
}

function Developer({ ctx, cn, dir }: TemplateProps) {
  const { personalInfo } = ctx.data;

  return (
    <div className={cn} dir={dir} style={PAGE_STYLE}>
      <div className="h-2 bg-stone-800 w-full" />
      <div className="p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-mono font-bold text-stone-900 mb-2">
            {personalInfo.name || ctx.L.namePlaceholder}
          </h1>
          <ContactDetails
            info={personalInfo}
            variant="bullets"
            className="text-sm font-mono text-stone-600"
            linkClass="text-teal-600 hover:underline"
          />
        </header>
        <Sections keys={ALL_SECTIONS} ctx={ctx} tone={monoTone} />
      </div>
    </div>
  );
}

function Elegant({ ctx, cn, dir }: TemplateProps) {
  const { personalInfo } = ctx.data;

  return (
    <div className={cn} dir={dir} style={PAGE_STYLE}>
      <div className="flex min-h-full">
        <div className="w-3 flex-shrink-0 bg-stone-100" />
        <div className="flex-1 p-8 border-l border-stone-200">
          <header className="mb-6 flex items-start gap-5">
            <ProfilePhoto
              src={personalInfo.profilePhoto}
              alt={personalInfo.name || ctx.L.namePlaceholder}
              size={96}
              className="h-24 w-24 flex-shrink-0 rounded-full object-cover border border-stone-300"
            />
            <div>
              <h1 className="text-3xl font-light tracking-wide text-stone-900 mb-2">
                {personalInfo.name || ctx.L.namePlaceholder}
              </h1>
              <ContactDetails
                info={personalInfo}
                variant="inline"
                className="text-sm text-stone-500"
                linkClass="text-teal-600 hover:underline"
              />
            </div>
          </header>
          <Sections keys={ALL_SECTIONS} ctx={ctx} tone={elegantTone} />
        </div>
      </div>
    </div>
  );
}

function Corporate({ ctx, cn, dir }: TemplateProps) {
  const { personalInfo } = ctx.data;
  const { aside, main } = splitSections(ctx.data);

  return (
    <div className={cn} dir={dir} style={PAGE_STYLE}>
      <div className="p-8">
        <header>
          <h1 className="text-2xl font-bold text-stone-900 mb-1">
            {personalInfo.name || ctx.L.namePlaceholder}
          </h1>
          <ContactDetails
            info={personalInfo}
            variant="bullets"
            className="text-sm text-stone-500"
            linkClass="text-teal-600 hover:underline"
          />
        </header>
        <div className="h-px bg-stone-300 my-4" />
        <div className="grid grid-cols-2 gap-6">
          <Sections keys={main} ctx={ctx} tone={compactBorderedTone} />
          <Sections keys={aside} ctx={ctx} tone={compactBorderedTone} />
        </div>
      </div>
    </div>
  );
}

function Clean({ ctx, cn, dir }: TemplateProps) {
  const { personalInfo } = ctx.data;

  return (
    <div className={cn} dir={dir} style={PAGE_STYLE}>
      <div className="p-12">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-light text-stone-900 mb-3">
            {personalInfo.name || ctx.L.namePlaceholder}
          </h1>
          <ContactDetails
            info={personalInfo}
            variant="inline"
            className="justify-center gap-6 text-sm text-stone-500"
            linkClass="text-teal-600 hover:underline"
          />
        </header>
        <div className="h-px bg-stone-200 w-3/4 mx-auto mb-8" />
        <div className="max-w-2xl mx-auto">
          <Sections keys={ALL_SECTIONS} ctx={ctx} tone={centeredTone} className="space-y-8" />
        </div>
      </div>
    </div>
  );
}

function Creative({ ctx, cn, dir }: TemplateProps) {
  const { personalInfo } = ctx.data;
  const { aside, main } = splitSections(ctx.data);

  return (
    <div className={cn} dir={dir} style={PAGE_STYLE}>
      <div className="p-8">
        <header className="flex gap-4 mb-6">
          <ProfilePhoto
            src={personalInfo.profilePhoto}
            alt={personalInfo.name || ctx.L.namePlaceholder}
            size={80}
            className="h-20 w-20 flex-shrink-0 rounded-full object-cover border-2 border-teal-500"
          />
          <div className="w-2 flex-shrink-0 rounded-full bg-teal-500" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-stone-900 mb-1">
              {personalInfo.name || ctx.L.namePlaceholder}
            </h1>
            <ContactDetails
              info={personalInfo}
              variant="bullets"
              className="text-sm text-stone-500"
              linkClass="text-teal-600 hover:underline"
            />
          </div>
        </header>
        <div className="border-l-2 border-stone-200 pl-4 grid grid-cols-3 gap-6">
          <Sections keys={aside} ctx={ctx} tone={tealTone} className="col-span-1 space-y-5" />
          <Sections keys={main} ctx={ctx} tone={tealTone} className="col-span-2 space-y-6" />
        </div>
      </div>
    </div>
  );
}

function Artistic({ ctx, cn, dir }: TemplateProps) {
  const { personalInfo } = ctx.data;
  const { aside, main } = splitSections(ctx.data);

  return (
    <div className={cn} dir={dir} style={PAGE_STYLE}>
      <div className="h-6 bg-teal-600 w-full" />
      <div className="p-8">
        <header className="flex gap-6 mb-6">
          <div className="w-1/3 flex-shrink-0">
            <ProfilePhoto
              src={personalInfo.profilePhoto}
              alt={personalInfo.name || ctx.L.namePlaceholder}
              size={200}
              className="w-full rounded object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-stone-900 mb-2">
              {personalInfo.name || ctx.L.namePlaceholder}
            </h1>
            <ContactDetails
              info={personalInfo}
              variant="stacked"
              className="text-sm text-stone-500"
              linkClass="text-teal-600 hover:underline"
            />
          </div>
        </header>
        <div className="grid grid-cols-3 gap-6">
          <Sections keys={aside} ctx={ctx} tone={tealTone} className="col-span-1 space-y-5" />
          <Sections keys={main} ctx={ctx} tone={tealTone} className="col-span-2 space-y-6" />
        </div>
      </div>
    </div>
  );
}

function Innovative({ ctx, cn, dir }: TemplateProps) {
  const { personalInfo } = ctx.data;

  return (
    <div className={cn} dir={dir} style={PAGE_STYLE}>
      <div className="p-8">
        <header className="flex gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-stone-900 mb-2">
              {personalInfo.name || ctx.L.namePlaceholder}
            </h1>
            <ContactDetails
              info={personalInfo}
              variant="inline"
              className="text-sm text-stone-500"
              linkClass="text-teal-600 hover:underline"
            />
          </div>
          <div className="w-2 self-stretch rounded bg-teal-500" />
          <ProfilePhoto
            src={personalInfo.profilePhoto}
            alt={personalInfo.name || ctx.L.namePlaceholder}
            size={80}
            className="h-20 w-20 flex-shrink-0 rounded object-cover"
          />
        </header>
        <Sections keys={ALL_SECTIONS} ctx={ctx} tone={tealTone} />
      </div>
    </div>
  );
}

function Portfolio({ ctx, cn, dir }: TemplateProps) {
  const { personalInfo } = ctx.data;

  return (
    <div className={cn} dir={dir} style={PAGE_STYLE}>
      <div className="flex min-h-full">
        <div className="w-24 flex-shrink-0 bg-stone-300">
          <ProfilePhoto
            src={personalInfo.profilePhoto}
            alt={personalInfo.name || ctx.L.namePlaceholder}
            size={96}
            className="h-24 w-24 object-cover"
          />
        </div>
        <div className="flex-1 p-8">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-stone-900 mb-2">
              {personalInfo.name || ctx.L.namePlaceholder}
            </h1>
            <ContactDetails
              info={personalInfo}
              variant="stacked"
              className="text-sm text-stone-600"
              linkClass="text-teal-600 hover:underline"
            />
          </header>
          <Sections keys={ALL_SECTIONS} ctx={ctx} tone={stoneTone} />
        </div>
      </div>
    </div>
  );
}

function Academic({ ctx, cn, dir }: TemplateProps) {
  const { personalInfo } = ctx.data;

  return (
    <div className={cn} dir={dir} style={PAGE_STYLE}>
      <div className="p-8">
        <header className="text-center mb-6">
          <ProfilePhoto
            src={personalInfo.profilePhoto}
            alt={personalInfo.name || ctx.L.namePlaceholder}
            size={112}
            className="mx-auto mb-4 h-28 w-28 rounded-full object-cover border border-stone-300"
          />
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            {personalInfo.name || ctx.L.namePlaceholder}
          </h1>
          <ContactDetails
            info={personalInfo}
            variant="bullets"
            className="text-sm text-stone-500"
            linkClass="text-teal-600 hover:underline"
          />
        </header>
        <div className="h-px bg-stone-300 mb-6" />
        <Sections keys={ALL_SECTIONS} ctx={ctx} tone={stoneTone} />
      </div>
    </div>
  );
}

function Scholar({ ctx, cn, dir }: TemplateProps) {
  const { personalInfo } = ctx.data;

  return (
    <div className={cn} dir={dir} style={PAGE_STYLE}>
      <div className="p-10">
        <header className="text-center mb-4">
          <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">
            {personalInfo.name || ctx.L.namePlaceholder}
          </h1>
          <ContactDetails
            info={personalInfo}
            variant="bullets"
            className="text-sm text-stone-500"
            linkClass="text-teal-600 hover:underline"
          />
        </header>
        <div className="h-px bg-stone-300 mb-6" />
        <Sections keys={ALL_SECTIONS} ctx={ctx} tone={elegantTone} />
      </div>
    </div>
  );
}

const TEMPLATES: Record<TemplateVariant, (props: TemplateProps) => React.ReactElement> = {
  modern: Modern,
  classic: Classic,
  minimal: Minimal,
  professional: Professional,
  executive: Executive,
  technical: Technical,
  developer: Developer,
  elegant: Elegant,
  corporate: Corporate,
  clean: Clean,
  creative: Creative,
  artistic: Artistic,
  innovative: Innovative,
  portfolio: Portfolio,
  academic: Academic,
  scholar: Scholar,
};

export default function CVRender({
  data,
  templateId = DEFAULT_TEMPLATE,
  className = '',
  locale = defaultLocale,
}: CVRenderProps) {
  const ctx: RenderContext = {
    data,
    L: getCVLabels(locale),
    fmt: (value?: string) => formatCVDate(value, locale),
  };

  const Template = TEMPLATES[templateId] ?? TEMPLATES[DEFAULT_TEMPLATE];
  const cn = `bg-white text-stone-900 ${className}`.trim();

  return <Template ctx={ctx} cn={cn} dir={textDirection(locale)} />;
}
