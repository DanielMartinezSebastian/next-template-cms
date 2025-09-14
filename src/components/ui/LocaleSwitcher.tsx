'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { useTransition } from 'react';

/**
 * LocaleSwitcher component with persistent user preference
 * Based on next-intl official examples and documentation
 * https://next-intl.dev/docs/routing/navigation
 *
 * Features:
 * - Persists user preference via cookies (configured in routing.ts)
 * - Smooth transitions with loading state
 * - Accessible with proper labels
 * - Styled with Tailwind CSS
 */
export default function LocaleSwitcher() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleLocaleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;

    startTransition(() => {
      // Use router.replace to change locale while maintaining current path
      // The localeCookie configuration will automatically persist the choice
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="relative">
      <label htmlFor="locale-select" className="sr-only">
        {t('locale_switcher.label')}
      </label>
      <select
        id="locale-select"
        value={locale}
        onChange={handleLocaleChange}
        disabled={isPending}
        className={
          'bg-background text-foreground inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-800'
        }
        title={t('locale_switcher.current_locale', { locale })}
      >
        {routing.locales.map(localeOption => (
          <option key={localeOption} value={localeOption}>
            {localeOption === 'en'
              ? `🇺🇸 ${t('locale_switcher.locale_en')}`
              : `🇪🇸 ${t('locale_switcher.locale_es')}`}
          </option>
        ))}
      </select>
      {isPending && (
        <div className="bg-background absolute inset-0 flex items-center justify-center rounded-md bg-opacity-75">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
