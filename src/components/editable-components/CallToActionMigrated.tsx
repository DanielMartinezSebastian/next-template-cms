/**
 * Migrated Call to Action Component with withEditable
 */

import { Button } from '@/components/ui/button';
import { withEditableSSR } from '@/lib/component-registry';
import React from 'react';
import { z } from 'zod';

// Zod schema for runtime validation with defaults
const CallToActionSchema = z.object({
  title: z.string().min(1, 'Title is required').default('Ready to get started?'),
  description: z.string().optional().default('Join thousands of satisfied customers today'),
  buttonText: z.string().min(1, 'Button text is required').default('Get Started'),
  buttonLink: z.string().url('Must be a valid URL').default('https://example.com'),
  buttonVariant: z
    .enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'])
    .default('default'),
  backgroundColor: z.string().default('bg-primary'),
  textColor: z.string().default('text-primary-foreground'),
  centerAlign: z.boolean().default(true),
});

export interface CallToActionProps {
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

const CallToActionComponent: React.FC<CallToActionProps> = ({
  title = 'Ready to get started?',
  description = 'Join thousands of satisfied customers today',
  buttonText = 'Get Started',
  buttonLink = 'https://example.com',
  buttonVariant = 'default',
  backgroundColor = 'bg-primary',
  textColor = 'text-primary-foreground',
  centerAlign = true,
  editMode = false,
  componentId,
}) => {
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
};

// Export with withEditableSSR HOC for auto-registration
export default withEditableSSR(CallToActionComponent, {
  metadata: {
    category: 'marketing',
    description: 'Call to action section with title, description and button',
    icon: '📢',
    tags: ['cta', 'marketing', 'button', 'conversion'],
  },
  schema: CallToActionSchema,
  defaultProps: {
    title: 'Ready to get started?',
    description: 'Join thousands of satisfied customers today',
    buttonText: 'Get Started',
    buttonLink: 'https://example.com',
    buttonVariant: 'default',
    backgroundColor: 'bg-primary',
    textColor: 'text-primary-foreground',
    centerAlign: true,
  },
  validateInDev: true,
});
