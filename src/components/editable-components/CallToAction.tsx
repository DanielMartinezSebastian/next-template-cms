/**
 * Call To Action Component
 * Simple CTA section with title, description and action button
 */

import { Button } from '@/components/ui/button';
import { withEditableSSR } from '@/lib/component-registry';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import { z } from 'zod';

// Schema definition
const CallToActionSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  buttonText: z.string(),
  buttonLink: z.string().url('Debe ser una URL válida'),
  buttonVariant: z.enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']),
  backgroundColor: z.string(),
  textColor: z.string(),
  centered: z.boolean(),
  size: z.enum(['small', 'medium', 'large']),
});

interface CallToActionProps {
  title: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  backgroundColor: string;
  textColor: string;
  centered: boolean;
  size: 'small' | 'medium' | 'large';
  locale?: string;
  editMode?: boolean;
  componentId?: string;
}

const CallToActionComponent: React.FC<CallToActionProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
  buttonVariant,
  backgroundColor,
  textColor,
  centered,
  size,
  componentId,
  editMode,
}) => {
  const sizeClasses = {
    small: 'py-12 px-6',
    medium: 'py-16 px-8',
    large: 'py-20 px-10',
  };

  const titleSizes = {
    small: 'text-2xl md:text-3xl',
    medium: 'text-3xl md:text-4xl',
    large: 'text-4xl md:text-5xl',
  };

  return (
    <section
      className={cn(
        'call-to-action relative',
        sizeClasses[size],
        centered ? 'text-center' : 'text-left'
      )}
      style={{ backgroundColor }}
      data-component-id={componentId}
    >
      <div className="mx-auto max-w-4xl">
        <h2 className={cn('mb-4 font-bold', titleSizes[size])} style={{ color: textColor }}>
          {title}
        </h2>

        {description && (
          <p className="mb-8 text-lg opacity-90 md:text-xl" style={{ color: textColor }}>
            {description}
          </p>
        )}

        <div className={cn('flex gap-4', centered ? 'justify-center' : 'justify-start')}>
          <Button variant={buttonVariant} size="lg" asChild>
            <Link href={buttonLink}>{buttonText}</Link>
          </Button>
        </div>
      </div>

      {editMode && (
        <div className="absolute right-4 top-4 rounded bg-red-600 px-2 py-1 text-xs text-white">
          Call To Action
        </div>
      )}
    </section>
  );
};

// Export with withEditableSSR
export default withEditableSSR(CallToActionComponent, {
  metadata: {
    category: 'marketing',
    description: 'Sección de llamada a la acción con título, descripción y botón',
    icon: '📢',
    tags: ['cta', 'marketing', 'conversion', 'action'],
  },
  schema: CallToActionSchema,
  defaultProps: {
    title: '¿Listo para comenzar?',
    description:
      'Únete a miles de clientes satisfechos y comienza tu viaje con nosotros hoy mismo.',
    buttonText: 'Empezar ahora',
    buttonLink: 'https://nextjs.org/',
    buttonVariant: 'default',
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
    centered: true,
    size: 'medium',
  },
  validateInDev: true,
});

export { CallToActionSchema };
export type { CallToActionProps };
