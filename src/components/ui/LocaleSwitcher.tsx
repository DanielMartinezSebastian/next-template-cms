'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { useTransition } from 'react';
import { Select, SelectItem } from './select';

/**
 * LocaleSwitcher component with persistent user preference
 * Based on next-intl official examples and documentation
 * https://next-intl.dev/docs/routing/navigation
 *
 * Features:
 * - Uses Base UI Select component for better UX
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

  function handleLocaleChange(nextLocale: string) {
    startTransition(() => {
      // Use router.replace to change locale while maintaining current path
      // The localeCookie configuration will automatically persist the choice
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="relative">
      <Select
        value={locale}
        onValueChange={handleLocaleChange}
        disabled={isPending}
        placeholder={t('locale_switcher.label')}
      >
        {routing.locales.map(localeOption => (
          <SelectItem key={localeOption} value={localeOption}>
            {localeOption === 'en'
              ? `🇺🇸 ${t('locale_switcher.locale_en')}`
              : `🇪🇸 ${t('locale_switcher.locale_es')}`}
          </SelectItem>
        ))}
      </Select>
      {isPending && (
        <div className="bg-background absolute inset-0 flex items-center justify-center rounded-md bg-opacity-75">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
