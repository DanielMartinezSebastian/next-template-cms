/**
 * Hero Section Component
 * Dynamic hero component for pages
 */

import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  ctaText?: string;
  ctaLink?: string;
  ctaType?: 'default' | 'secondary' | 'outline';
  height?: 'small' | 'medium' | 'large' | 'full';
  overlay?: boolean;
  overlayOpacity?: number;
  locale?: string;
  editMode?: boolean;
  componentId?: string;
}

export function HeroSection({
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
  editMode = false,
  componentId,
}: HeroSectionProps) {
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
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      <div className={`relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 ${textAlignClass}`}>
        {subtitle && (
          <div className="mb-4 text-lg font-medium text-blue-200 sm:text-xl">
            {subtitle}
          </div>
        )}

        <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        {description && (
          <p className="mb-8 text-xl text-gray-200 sm:text-2xl">
            {description}
          </p>
        )}

        {ctaText && (
          <div className="flex justify-center">
            <Button
              variant={ctaType}
              size="lg"
              className="px-8 py-3 text-lg"
              asChild
            >
              <a href={ctaLink}>{ctaText}</a>
            </Button>
          </div>
        )}
      </div>

      {/* Edit Mode Indicator */}
      {editMode && (
        <div className="absolute bottom-4 right-4 rounded bg-black/70 px-2 py-1 text-xs text-white">
          Hero Section
        </div>
      )}
    </section>
  );
}

export default HeroSection;
