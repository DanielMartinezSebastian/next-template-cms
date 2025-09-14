import { notFound } from 'next/navigation';

/**
 * Catch-all route for unknown pages within locale routing
 * This ensures that any unmatched route like /en/unknown-page
 * will trigger the localized not-found page
 * 
 * Based on official next-intl documentation:
 * https://next-intl.dev/docs/environments/error-files#catching-unknown-routes
 */
export default function CatchAllPage() {
  // This will trigger the closest not-found.tsx page
  // which is src/app/[locale]/not-found.tsx
  notFound();
}
