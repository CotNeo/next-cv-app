'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import type { ReactNode } from 'react';
import { LocaleProvider } from '@/i18n/LocaleProvider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <LocaleProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#1c1917',
              border: '1px solid #e7e5e4',
              borderRadius: '8px',
              padding: '12px 16px',
            },
            success: { iconTheme: { primary: '#0f766e', secondary: '#fff' } },
            error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
          }}
        />
      </LocaleProvider>
    </SessionProvider>
  );
}
