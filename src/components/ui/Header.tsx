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
    <header className="border-b border-gray-200 dark:border-gray-800 bg-background shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-foreground">
              Next.js Template
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-foreground/70 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
            >
              {t('navigation.home')}
            </Link>
            <Link 
              href="/admin" 
              className="text-foreground/70 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
            >
              {t('navigation.admin')}
            </Link>
            <Link 
              href="/docs" 
              className="text-foreground/70 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
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
