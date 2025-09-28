/**
 * Card Component
 * Simple card component with image, title, description and optional button
 */

import { Button } from '@/components/ui/button';
import { withEditableSSR } from '@/lib/component-registry';
import { cn } from '@/lib/utils';
import NextImage from 'next/image';
import Link from 'next/link';
import React from 'react';
import { z } from 'zod';

// Schema definition
const CardSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  image: z.string().url('Debe ser una URL válida').optional(),
  imageAlt: z.string(),
  buttonText: z.string().optional(),
  buttonLink: z.string().url('Debe ser una URL válida').optional(),
  layout: z.enum(['vertical', 'horizontal']),
  variant: z.enum(['default', 'bordered', 'elevated']),
  textAlign: z.enum(['left', 'center']),
});

interface CardProps {
  title: string;
  description?: string;
  image?: string;
  imageAlt: string;
  buttonText?: string;
  buttonLink?: string;
  layout: 'vertical' | 'horizontal';
  variant: 'default' | 'bordered' | 'elevated';
  textAlign: 'left' | 'center';
  locale?: string;
  editMode?: boolean;
  componentId?: string;
}

const CardComponent: React.FC<CardProps> = ({
  title,
  description,
  image,
  imageAlt,
  buttonText,
  buttonLink,
  layout,
  variant,
  textAlign,
  componentId,
  editMode,
}) => {
  const variantClasses = {
    default: 'bg-white shadow-sm',
    bordered: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg',
  };

  const layoutClasses = {
    vertical: 'flex-col',
    horizontal: 'flex-row',
  };

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
  };

  const renderImage = () => {
    if (!image) return null;

    return (
      <div
        className={cn(
          'relative overflow-hidden',
          layout === 'vertical' && 'w-full h-48',
          layout === 'horizontal' && 'w-1/3 h-full min-h-[200px]'
        )}
      >
        <NextImage
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          unoptimized={image.includes('placeholders.dev')}
        />
      </div>
    );
  };

  const renderContent = () => (
    <div
      className={cn(
        'p-6 flex flex-col',
        layout === 'horizontal' && 'flex-1',
        alignmentClasses[textAlign]
      )}
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {title}
      </h3>

      {description && (
        <p className="text-gray-600 mb-4 flex-grow">
          {description}
        </p>
      )}

      {buttonText && buttonLink && (
        <div className={cn(
          'mt-auto',
          textAlign === 'center' ? 'flex justify-center' : ''
        )}>
          <Button variant="outline" size="sm" asChild>
            <Link href={buttonLink}>
              {buttonText}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        'card relative overflow-hidden rounded-lg flex',
        variantClasses[variant],
        layoutClasses[layout]
      )}
      data-component-id={componentId}
    >
      {layout === 'horizontal' ? (
        <>
          {renderImage()}
          {renderContent()}
        </>
      ) : (
        <>
          {renderImage()}
          {renderContent()}
        </>
      )}

      {editMode && (
        <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs px-2 py-1 rounded">
          Card
        </div>
      )}
    </div>
  );
};

// Export with withEditableSSR
export default withEditableSSR(CardComponent, {
  metadata: {
    category: 'content',
    description: 'Tarjeta con imagen, título, descripción y botón opcional',
    icon: '🃏',
    tags: ['card', 'content', 'image', 'button'],
  },
  schema: CardSchema,
  defaultProps: {
    title: 'Título de la tarjeta',
    description: 'Esta es una descripción de ejemplo para la tarjeta. Puedes editarla desde el panel de administración.',
    image: 'https://images.placeholders.dev/400x250?text=Imagen%20de%20tarjeta&bgColor=%236b7280&textColor=%23ffffff',
    imageAlt: 'Imagen de la tarjeta',
    buttonText: 'Leer más',
    buttonLink: '#',
    layout: 'vertical',
    variant: 'default',
    textAlign: 'left',
  },
  validateInDev: true,
});

export { CardSchema };
export type { CardProps };