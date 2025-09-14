'use client';

import Error from 'next/error';

/**
 * Global not-found page for non-localized requests
 * This handles requests that don't match the locale routing pattern
 * (e.g., /unknown.txt, /robots.txt, etc.)
 * 
 * Based on official next-intl documentation:
 * https://next-intl.dev/docs/environments/error-files#catching-non-localized-requests
 */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  );
}
