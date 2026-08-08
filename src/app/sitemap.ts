import type { MetadataRoute } from 'next';
import { templates } from '@/data/templates';
import { siteUrl } from '@/lib/site';

const STATIC_ROUTES = [
  { path: '', priority: 1 },
  { path: '/templates', priority: 0.9 },
  { path: '/pricing', priority: 0.8 },
  { path: '/about', priority: 0.6 },
  { path: '/contact', priority: 0.6 },
  { path: '/faq', priority: 0.6 },
  { path: '/privacy', priority: 0.3 },
  { path: '/terms', priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();

  return [
    ...STATIC_ROUTES.map(({ path, priority }) => ({
      url: `${base}${path}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority,
    })),
    ...templates.map((template) => ({
      url: `${base}/templates/${template.id}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
