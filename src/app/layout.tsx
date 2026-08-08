import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Providers from '@/app/providers';
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from '@/lib/site';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE_NAME} – AI-powered CV builder`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} – AI-powered CV builder`,
    description: SITE_DESCRIPTION,
    url: siteUrl(),
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} – AI-powered CV builder`,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f766e',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // lang/dir are corrected on the client by LocaleProvider once the stored
    // preference is known; suppressHydrationWarning keeps that from warning.
    <html lang="en" dir="ltr" className={plusJakarta.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-14">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
