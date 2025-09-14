import { routing } from './routing';
import { createNavigation } from 'next-intl/navigation';

/**
 * Localized navigation wrappers
 * Based on next-intl official documentation:
 * https://next-intl.dev/docs/routing/navigation
 * 
 * These components and hooks automatically handle locale routing
 * and work with the persistent cookie configuration.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
