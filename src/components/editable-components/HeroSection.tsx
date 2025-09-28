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
  editMode?: boolean;
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
  editMode,
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

  const backgroundStyle = backgroundType === 'gradient' 
    ? { background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)` }
    : { backgroundColor };

  return (
    <section
      className={cn(
        'relative flex items-center justify-center min-h-[400px] w-full',
        sizeClasses[size]
      )}
      style={backgroundStyle}
      data-component-id={componentId}
    >
      <div className={cn(
        'max-w-4xl w-full',
        centered ? 'text-center' : 'text-left'
      )}>
        {subtitle && (
          <p 
            className="text-lg md:text-xl font-medium mb-4 opacity-90"
            style={{ color: textColor }}
          >
            {subtitle}
          </p>
        )}
        
        <h1
          className={cn('font-bold mb-6', titleSizes[size])}
          style={{ color: textColor }}
        >
          {title}
        </h1>

        {description && (
          <p
            className="text-lg md:text-xl mb-8 opacity-80 max-w-2xl mx-auto"
            style={{ color: textColor }}
          >
            {description}
          </p>
        )}

        {ctaText && ctaLink && (
          <div className={cn(
            'flex gap-4',
            centered ? 'justify-center' : 'justify-start'
          )}>
            <Button size="lg" asChild>
              <Link href={ctaLink}>
                {ctaText}
              </Link>
            </Button>
          </div>
        )}
      </div>

      {editMode && (
        <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-2 py-1 rounded">
          Hero Section
        </div>
      )}
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
    ctaLink: '#',
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