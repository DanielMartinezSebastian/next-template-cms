'use client';

import { cn } from '@/lib/utils';
import { usePreferencesActions, useTheme } from '@/stores/user-preferences-store';
import { Switch as BaseSwitch } from '@base-ui-components/react/switch';
import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import { forwardRef, useEffect, useState } from 'react';

/**
 * Theme Toggle Component
 * A switch component for toggling between light and dark themes
 * Uses Base UI Switch with custom styling via CVA
 */

// Theme toggle variants using CVA
const themeToggleVariants = cva(
  // Base styles for the switch root
  'focus-visible:ring-primary relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-muted data-[state=checked]:bg-primary',
        outline:
          'border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary bg-transparent',
      },
      size: {
        default: 'h-6 w-11',
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
        lg: 'h-7 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const themeToggleThumbVariants = cva(
  // Base styles for the switch thumb
  'bg-background pointer-events-none block rounded-full shadow-lg ring-0 transition-transform duration-200 ease-in-out',
  {
    variants: {
      size: {
        default: 'h-5 w-5',
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

interface ThemeToggleProps extends VariantProps<typeof themeToggleVariants> {
  className?: string;
  showLabel?: boolean;
  disabled?: boolean;
}

const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ className, variant, size, showLabel = false, disabled = false, ...props }, ref) => {
    const t = useTranslations();
    const theme = useTheme();
    const { setTheme } = usePreferencesActions();

    // State to track system preference and hydration
    const [systemPrefersDark, setSystemPrefersDark] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // Detect system preference and mark as hydrated
    useEffect(() => {
      if (typeof window === 'undefined') return;

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setSystemPrefersDark(mediaQuery.matches);
      setIsHydrated(true);

      const handleChange = (e: MediaQueryListEvent) => {
        setSystemPrefersDark(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Determine the effective theme (what's actually being displayed)
    const getEffectiveTheme = () => {
      if (!isHydrated) {
        // Durante SSR, asumir light mode pero sin cambiar la estructura del DOM
        return 'light';
      }

      if (theme === 'system') {
        return systemPrefersDark ? 'dark' : 'light';
      }
      return theme;
    };

    const effectiveTheme = getEffectiveTheme();
    const isDark = effectiveTheme === 'dark';

    const handleThemeChange = () => {
      // Cambio más simple: alternar entre light y dark únicamente
      const currentEffectiveTheme = getEffectiveTheme();

      if (currentEffectiveTheme === 'dark') {
        setTheme('light');
      } else {
        setTheme('dark');
      }
    };

    return (
      <div className="flex items-center space-x-2">
        {showLabel && (
          <label
            htmlFor="theme-toggle"
            className="text-foreground cursor-pointer text-sm font-medium"
          >
            {isHydrated ? t('theme') : ''}
          </label>
        )}

        <BaseSwitch.Root
          id="theme-toggle"
          ref={ref}
          checked={isDark}
          onCheckedChange={() => handleThemeChange()}
          disabled={disabled || !isHydrated}
          className={cn(
            themeToggleVariants({ variant, size }),
            className,
            'relative inline-flex items-center',
            'outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            // Transparencia durante hydration para evitar layout shift
            !isHydrated && 'pointer-events-none opacity-50'
          )}
          aria-label={isHydrated ? t('toggleTheme') : 'Cargando switch de tema...'}
          {...props}
        >
          <BaseSwitch.Thumb
            className={cn(
              themeToggleThumbVariants({ size }),
              // Manual transform control con corrección para diferentes tamaños
              !isHydrated
                ? 'translate-x-0'
                : isDark
                  ? size === 'sm'
                    ? 'translate-x-4' // Ajuste para tamaño pequeño
                    : size === 'md'
                      ? 'translate-x-5' // Ajuste para tamaño medio
                      : size === 'lg'
                        ? 'translate-x-6' // Ajuste para tamaño grande
                        : 'translate-x-5' // Default para tamaño normal
                  : 'translate-x-0',
              'flex items-center justify-center',
              'relative z-10'
            )}
          >
            {/* Icono dinámico - tamaños responsivos según el tamaño del switch */}
            {!isHydrated || !isDark ? (
              /* Sun icon para light mode o estado de carga */
              <svg
                className={cn(
                  'text-yellow-600 transition-all duration-200',
                  size === 'sm'
                    ? 'h-2 w-2'
                    : size === 'md'
                      ? 'h-3 w-3'
                      : size === 'lg'
                        ? 'h-4 w-4'
                        : 'h-3 w-3'
                )}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
            ) : (
              /* Moon icon para dark mode */
              <svg
                className={cn(
                  'text-white transition-all duration-200',
                  size === 'sm'
                    ? 'h-2 w-2'
                    : size === 'md'
                      ? 'h-3 w-3'
                      : size === 'lg'
                        ? 'h-4 w-4'
                        : 'h-3 w-3'
                )}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </BaseSwitch.Thumb>

          {/* Background icons en el track - ocultos durante hydration */}
          <div
            className={cn(
              'pointer-events-none absolute inset-0 flex items-center justify-between px-1',
              !isHydrated && 'opacity-0'
            )}
          >
            {/* Sun icon a la izquierda (lado light) */}
            <svg
              className={cn(
                'transition-all duration-200',
                !isDark ? 'text-yellow-400/15' : 'text-yellow-400/30',
                size === 'sm'
                  ? 'h-2 w-2'
                  : size === 'md'
                    ? 'h-2.5 w-2.5'
                    : size === 'lg'
                      ? 'h-4 w-4'
                      : 'h-3 w-3'
              )}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>

            {/* Moon icon a la derecha (lado dark) */}
            <svg
              className={cn(
                'transition-all duration-200',
                isDark ? 'text-blue-300/15' : 'text-blue-400/30',
                size === 'sm'
                  ? 'h-2 w-2'
                  : size === 'md'
                    ? 'h-2.5 w-2.5'
                    : size === 'lg'
                      ? 'h-4 w-4'
                      : 'h-3 w-3'
              )}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </div>
        </BaseSwitch.Root>
      </div>
    );
  }
);

ThemeToggle.displayName = 'ThemeToggle';

export { ThemeToggle, themeToggleVariants };
export type { ThemeToggleProps };
