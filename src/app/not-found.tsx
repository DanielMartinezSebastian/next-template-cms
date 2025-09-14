import Link from 'next/link';

/**
 * Global not-found page for non-localized requests
 * This handles requests that don't match the locale routing pattern
 * (e.g., /unknown.txt, /robots.txt, etc.)
 * 
 * According to Next.js 15 official documentation:
 * https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 * 
 * Must return full HTML document including <html> and <body> tags
 * for global not-found pages
 */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              404 - Page Not Found
            </h1>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              The page you are looking for does not exist.
            </p>
            <Link 
              href="/" 
              style={{ 
                color: '#0070f3', 
                textDecoration: 'underline' 
              }}
            >
              Go back home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
