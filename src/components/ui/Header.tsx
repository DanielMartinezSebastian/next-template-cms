import { getTranslations } from 'next-intl/server';
import LocaleSwitcher from './LocaleSwitcher';
import { Link } from '@/i18n/navigation';

/**
 * Header component with navigation and language switcher
 * Demonstrates persistent language switching implementation
 */
export default async function Header() {
  const t = await getTranslations();

  return (
    <header className="bg-background border-b border-gray-200 shadow-sm dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-foreground text-xl font-bold">
              Next.js Template
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden space-x-8 md:flex">
            <Link
              href="/"
              className="text-foreground/70 px-3 py-2 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              {t('navigation.home')}
            </Link>
            <Link
              href="/admin"
              className="text-foreground/70 px-3 py-2 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              {t('navigation.admin')}
            </Link>
            <Link
              href="/docs"
              className="text-foreground/70 px-3 py-2 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              {t('navigation.docs')}
            </Link>
          </nav>

          {/* Language Switcher */}
          <div className="flex items-center space-x-4">
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
