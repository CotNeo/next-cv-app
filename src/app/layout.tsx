'use client';

import { SessionProvider } from 'next-auth/react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="font-sans antialiased">
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-grow pt-14">
              {children}
            </main>
            
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
