import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Private areas and share links must never end up in a search index.
      disallow: ['/api/', '/dashboard/', '/cv/', '/auth/'],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
