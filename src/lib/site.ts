/**
 * Public origin of the deployment. Used for canonical URLs, sitemap entries and
 * Open Graph tags, all of which are resolved at build time — so this reads
 * process.env directly rather than going through the runtime env parser.
 */
export function siteUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  return (configured || 'http://localhost:3000').replace(/\/$/, '');
}

export const SITE_NAME = 'CV Builder';
export const SITE_DESCRIPTION =
  'Build an ATS-friendly CV in minutes. AI-assisted content, 16 professional templates, cover letters and shareable links — in six languages.';
