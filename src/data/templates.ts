/** Canonical template list. Keep this file free of client-only imports. */
export const TEMPLATE_IDS = [
  'modern',
  'classic',
  'professional',
  'executive',
  'elegant',
  'corporate',
  'minimal',
  'clean',
  'technical',
  'developer',
  'creative',
  'artistic',
  'portfolio',
  'innovative',
  'academic',
  'scholar',
] as const;

export type TemplateVariant = (typeof TEMPLATE_IDS)[number];

export const DEFAULT_TEMPLATE: TemplateVariant = 'modern';

export const TEMPLATE_CATEGORIES = [
  'Professional',
  'Minimalist',
  'Technical',
  'Creative',
  'Academic',
] as const;

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];

export interface TemplateMeta {
  id: TemplateVariant;
  /** i18n key suffix under `templates.items.*`; falls back to the English name. */
  name: string;
  category: TemplateCategory;
  popular: boolean;
}

export const templates: TemplateMeta[] = [
  { id: 'modern', name: 'Modern', category: 'Professional', popular: true },
  { id: 'classic', name: 'Classic', category: 'Professional', popular: true },
  { id: 'professional', name: 'Professional', category: 'Professional', popular: true },
  { id: 'executive', name: 'Executive', category: 'Professional', popular: false },
  { id: 'elegant', name: 'Elegant', category: 'Professional', popular: false },
  { id: 'corporate', name: 'Corporate', category: 'Professional', popular: false },
  { id: 'minimal', name: 'Minimal', category: 'Minimalist', popular: true },
  { id: 'clean', name: 'Clean', category: 'Minimalist', popular: false },
  { id: 'technical', name: 'Technical', category: 'Technical', popular: true },
  { id: 'developer', name: 'Developer', category: 'Technical', popular: true },
  { id: 'creative', name: 'Creative', category: 'Creative', popular: true },
  { id: 'artistic', name: 'Artistic', category: 'Creative', popular: false },
  { id: 'portfolio', name: 'Portfolio', category: 'Creative', popular: false },
  { id: 'innovative', name: 'Innovative', category: 'Creative', popular: false },
  { id: 'academic', name: 'Academic', category: 'Academic', popular: false },
  { id: 'scholar', name: 'Scholar', category: 'Academic', popular: false },
];

/** Category id 'all' means no filter; others match TemplateMeta.category */
export const categories = [
  { name: 'all', count: templates.length },
  ...TEMPLATE_CATEGORIES.map((category) => ({
    name: category,
    count: templates.filter((t) => t.category === category).length,
  })),
];

export function getTemplateById(id: string): TemplateMeta | undefined {
  return templates.find((t) => t.id === id);
}

export function isTemplateId(id: unknown): id is TemplateVariant {
  return typeof id === 'string' && (TEMPLATE_IDS as readonly string[]).includes(id);
}

/** Narrows arbitrary stored values to a renderable template id. */
export function toTemplateId(id: unknown): TemplateVariant {
  return isTemplateId(id) ? id : DEFAULT_TEMPLATE;
}
