/**
 * Migrated Hero Section Component with withEditable
 * Dynamic hero component for pages
 */

import { Button } from '@/components/ui/button';
import React from 'react';
import { withEditable } from '@/lib/component-registry';
import { z } from 'zod';

// Zod schema for runtime validation
const HeroSectionSchema = z.object({
  title: z.string().min(1, 'Title is required').default('Welcome to Our Website'),
  subtitle: z.string().optional().default(''),
  description: z.string().optional().default('Discover amazing content and services'),
  backgroundImage: z.string().url('Must be a valid URL').optional().default(''),
  backgroundColor: z.string().default('bg-gradient-to-r from-blue-600 to-purple-600'),
  textAlign: z.enum(['left', 'center', 'right']).default('center'),
  ctaText: z.string().optional().default('Get Started'),
  ctaLink: z.string().url('Must be a valid URL').optional().default('#'),
  ctaType: z.enum(['default', 'secondary', 'outline']).default('default'),
  height: z.enum(['small', 'medium', 'large', 'full']).default('medium'),
  overlay: z.boolean().default(true),
  overlayOpacity: z.number().min(0).max(1).default(0.5)
});

export interface HeroSectionProps extends z.infer<typeof HeroSectionSchema> {
  locale?: string;
  componentId?: string;
}

const HeroSectionComponent: React.FC<HeroSectionProps> = ({
  title = 'Welcome to Our Website',
  subtitle = '',
  description = 'Discover amazing content and services',
  backgroundImage = '',
  backgroundColor = 'bg-gradient-to-r from-blue-600 to-purple-600',
  textAlign = 'center',
  ctaText = 'Get Started',
  ctaLink = '#',
  ctaType = 'default',
  height = 'medium',
  overlay = true,
  overlayOpacity = 0.5,
  locale = 'en',
  componentId,
}) => {
  const heightClass = {
    small: 'min-h-[300px]',
    medium: 'min-h-[500px]',
    large: 'min-h-[700px]',
    full: 'min-h-screen',
  }[height];

  const textAlignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[textAlign];

  const containerStyle: React.CSSProperties = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <section
      className={`hero-section relative flex items-center justify-center ${heightClass} ${!backgroundImage ? backgroundColor : ''}`}
      style={containerStyle}
      data-component-id={componentId}
    >
      {/* Overlay */}
      {overlay && (backgroundImage || !backgroundColor.includes('gradient')) && (
        <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
      )}

      {/* Content */}
      <div className={`relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 ${textAlignClass}`}>
        {subtitle && (
          <div className="mb-4 text-lg font-medium text-blue-200 sm:text-xl">{subtitle}</div>
        )}

        <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">{title}</h1>

        {description && <p className="mb-8 text-xl text-gray-200 sm:text-2xl">{description}</p>}

        {ctaText && (
          <div className="flex justify-center">
            <Button variant={ctaType} size="lg" className="px-8 py-3 text-lg" asChild>
              <a href={ctaLink}>{ctaText}</a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

// Export with withEditable HOC for auto-registration
export default withEditable(HeroSectionComponent, {
  metadata: {
    category: 'marketing',
    description: 'Hero section with title, subtitle, description and call-to-action',
    icon: '🎯',
    tags: ['hero', 'banner', 'marketing', 'landing']
  },
  schema: HeroSectionSchema,
  defaultProps: {
    title: 'Welcome to Our Website',
    subtitle: '',
    description: 'Discover amazing content and services',
    backgroundImage: '',
    backgroundColor: 'bg-gradient-to-r from-blue-600 to-purple-600',
    textAlign: 'center',
    ctaText: 'Get Started',
    ctaLink: '#',
    ctaType: 'default',
    height: 'medium',
    overlay: true,
    overlayOpacity: 0.5
  },
  validateInDev: true
});
