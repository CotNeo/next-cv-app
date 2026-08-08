'use client';

/**
 * Last-resort boundary: it replaces the root layout, so no provider — and
 * therefore no translation — is available here. Copy stays in English.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            padding: '2rem',
            textAlign: 'center',
            color: '#1c1917',
            background: '#fafaf9',
          }}
        >
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Something went wrong</h1>
          <p style={{ color: '#57534e', margin: 0 }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '0.25rem',
              border: 'none',
              background: '#0f766e',
              color: '#fff',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p style={{ fontSize: '0.75rem', color: '#a8a29e', margin: 0 }}>ref: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
