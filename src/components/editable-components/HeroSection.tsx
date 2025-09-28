/**
 * Hero Section Component
 * Simple hero section with title, description and call-to-action button
 */

import { Button } from '@/components/ui/button';
import { withEditableSSR } from '@/lib/component-registry';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import { z } from 'zod';

// Schema definition
const HeroSectionSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().url('Debe ser una URL válida').optional(),
  backgroundType: z.enum(['color', 'gradient']),
  backgroundColor: z.string(),
  gradientFrom: z.string(),
  gradientTo: z.string(),
  textColor: z.string(),
  centered: z.boolean(),
  size: z.enum(['small', 'medium', 'large']),
});

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundType: 'color' | 'gradient';
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  textColor: string;
  centered: boolean;
  size: 'small' | 'medium' | 'large';
  locale?: string;
  componentId?: string;
}

const HeroSectionComponent: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  ctaText,
  ctaLink,
  backgroundType,
  backgroundColor,
  gradientFrom,
  gradientTo,
  textColor,
  centered,
  size,
  componentId,
}) => {
  const sizeClasses = {
    small: 'py-16 px-6',
    medium: 'py-24 px-6',
    large: 'py-32 px-8',
  };

  const titleSizes = {
    small: 'text-3xl md:text-4xl',
    medium: 'text-4xl md:text-5xl lg:text-6xl',
    large: 'text-5xl md:text-6xl lg:text-7xl',
  };

  const backgroundStyle =
    backgroundType === 'gradient'
      ? { background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)` }
      : { backgroundColor };

  return (
    <section
      className={cn(
        'relative flex min-h-[400px] w-full items-center justify-center',
        sizeClasses[size]
      )}
      style={backgroundStyle}
      data-component-id={componentId}
    >
      <div className={cn('w-full max-w-4xl', centered ? 'text-center' : 'text-left')}>
        {subtitle && (
          <p
            className="mb-4 text-lg font-medium opacity-90 md:text-xl"
            style={{ color: textColor }}
          >
            {subtitle}
          </p>
        )}

        <h1 className={cn('mb-6 font-bold', titleSizes[size])} style={{ color: textColor }}>
          {title}
        </h1>

        {description && (
          <p
            className="mx-auto mb-8 max-w-2xl text-lg opacity-80 md:text-xl"
            style={{ color: textColor }}
          >
            {description}
          </p>
        )}

        {ctaText && ctaLink && (
          <div className={cn('flex gap-4', centered ? 'justify-center' : 'justify-start')}>
            <Button size="lg" asChild>
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

// Export with withEditableSSR
export default withEditableSSR(HeroSectionComponent, {
  metadata: {
    category: 'marketing',
    description: 'Sección hero principal con título, descripción y llamada a la acción',
    icon: '🎯',
    tags: ['hero', 'banner', 'marketing', 'cta'],
  },
  schema: HeroSectionSchema,
  defaultProps: {
    title: 'Bienvenido a nuestro sitio',
    description: 'Descubre contenido increíble y servicios únicos',
    ctaText: 'Comenzar',
    ctaLink: 'https://nextjs.org/',
    backgroundType: 'gradient',
    backgroundColor: '#f8fafc',
    gradientFrom: '#3b82f6',
    gradientTo: '#8b5cf6',
    textColor: '#ffffff',
    centered: true,
    size: 'medium',
  },
  validateInDev: true,
});

export { HeroSectionSchema };
export type { HeroSectionProps };
