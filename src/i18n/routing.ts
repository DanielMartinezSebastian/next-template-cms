import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'es'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Cookie configuration for persistent locale preference
  localeCookie: {
    // Custom cookie name for user locale preference
    name: 'USER_LOCALE',
    // Expire in one year to remember user preference long-term
    maxAge: 60 * 60 * 24 * 365, // 365 days
    // Secure settings
    sameSite: 'lax',
  },
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
