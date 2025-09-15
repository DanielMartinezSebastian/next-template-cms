'use client';

import { useTheme } from '@/stores/user-preferences-store';
import { useEffect, useState } from 'react';

/**
 * UI Theme Provider Component
 *
 * This provider applies theme classes to the HTML element based on user preferences.
 * It handles:
 * - Dark/light mode switching
 * - System preference detection
 * - DOM manipulation for Tailwind CSS class-based theming
 * - Proper hydration to prevent SSR mismatches
 *
 * Note: This is a UI provider (not a data provider) that manages browser DOM state.
 * It belongs in the components layer as it's tightly coupled with UI rendering.
 */
export function UIThemeProvider() {
  const theme = useTheme();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated on client side
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Only apply theme changes after hydration to prevent SSR mismatches
    if (!isHydrated) return;

    const html = document.documentElement;

    // Remove any existing theme classes to avoid conflicts
    html.classList.remove('dark', 'light');

    if (theme === 'dark') {
      html.classList.add('dark');
    } else if (theme === 'light') {
      html.classList.add('light');
    } else if (theme === 'system') {
      // For system theme, detect user's OS preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.classList.add(prefersDark ? 'dark' : 'light');

      // Listen for system theme changes and update DOM immediately
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        html.classList.remove('dark', 'light');
        html.classList.add(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, isHydrated]);

  // This component doesn't render anything - it only manages DOM side effects
  return null;
}
