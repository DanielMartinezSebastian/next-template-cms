/**
 * Call to Action Component
 */

import React from 'react';
import { Button } from '@/components/ui/button';

interface CallToActionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  backgroundColor?: string;
  textColor?: string;
  centerAlign?: boolean;
  locale?: string;
  editMode?: boolean;
  componentId?: string;
}

export function CallToAction({
  title = 'Ready to get started?',
  description = 'Join thousands of satisfied customers today',
  buttonText = 'Get Started',
  buttonLink = '#',
  buttonVariant = 'default',
  backgroundColor = 'bg-primary',
  textColor = 'text-primary-foreground',
  centerAlign = true,
  locale = 'en',
  editMode = false,
  componentId,
}: CallToActionProps) {
  return (
    <div className={`call-to-action py-16 ${backgroundColor}`} data-component-id={componentId}>
      <div className={`mx-auto max-w-4xl px-4 ${centerAlign ? 'text-center' : ''}`}>
        <h2 className={`mb-4 text-3xl font-bold ${textColor}`}>{title}</h2>

        <p className={`mb-8 text-lg ${textColor} opacity-90`}>{description}</p>

        <Button variant={buttonVariant} size="lg" asChild>
          <a href={buttonLink}>{buttonText}</a>
        </Button>

        {editMode && (
          <div className="mt-4 rounded bg-black/20 p-2 text-sm text-white">Call to Action</div>
        )}
      </div>
    </div>
  );
}

export default CallToAction;
