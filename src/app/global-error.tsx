'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#0A0A0A', color: 'white', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0 }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Something went wrong</h1>
          <p style={{ color: '#999', marginBottom: '2rem' }}>Please try refreshing the page.</p>
          <button
            onClick={() => reset()}
            style={{ backgroundColor: '#F5C000', color: '#0A0A0A', border: 'none', padding: '0.75rem 2rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}
