/**
 * Migrated Card Component with withEditable
 * A flexible card component with image, title, description and optional button
 */

import { Button } from '@/components/ui/button';
import { withEditableSSR } from '@/lib/component-registry';
import { cn } from '@/lib/utils';
import NextImage from 'next/image';
import Link from 'next/link';
import React from 'react';
import { z } from 'zod';

// Zod schema for runtime validation with defaults
const CardSchema = z.object({
  title: z.string().min(1, 'Title is required').default('Card Title'),
  description: z
    .string()
    .optional()
    .default(
      'This is a sample card description that shows how content will be displayed in the card component.'
    ),
  image: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .default(
      'https://images.placeholders.dev/400x250?text=Card%20Image&bgColor=%236b7280&textColor=%23ffffff'
    ),
  imageAlt: z.string().optional().default('Card image'),
  buttonText: z.string().optional().default('Learn More'),
  buttonLink: z.string().url('Must be a valid URL').optional().default('https://example.com'),
  variant: z.enum(['default', 'outlined', 'elevated']).default('default'),
  imagePosition: z.enum(['top', 'left', 'right']).default('top'),
  className: z.string().optional(),
});

export interface CardProps {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  buttonText?: string;
  buttonLink?: string;
  variant?: 'default' | 'outlined' | 'elevated';
  imagePosition?: 'top' | 'left' | 'right';
  className?: string;
  locale?: string;
  editMode?: boolean;
  componentId?: string;
}

const CardComponent: React.FC<CardProps> = ({
  title = 'Card Title',
  description = 'This is a sample card description that shows how content will be displayed in the card component.',
  image = 'https://images.placeholders.dev/400x250?text=Card%20Image&bgColor=%236b7280&textColor=%23ffffff',
  imageAlt = 'Card image',
  buttonText = 'Learn More',
  buttonLink = 'https://example.com',
  variant = 'default',
  imagePosition = 'top',
  className,
}) => {
  const cardClasses = cn(
    'card overflow-hidden rounded-lg',
    {
      'bg-card border': variant === 'default',
      'border-border border-2': variant === 'outlined',
      'bg-card shadow-lg': variant === 'elevated',
    },
    {
      flex: imagePosition === 'left' || imagePosition === 'right',
      'flex-col': imagePosition === 'top',
    },
    className
  );

  const renderImage = () => {
    if (!image) return null;

    return (
      <div
        className={cn(
          'relative overflow-hidden',
          imagePosition === 'top' && 'h-48 w-full',
          (imagePosition === 'left' || imagePosition === 'right') && 'h-full min-h-[200px] w-1/3'
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
        'flex flex-col p-6',
        (imagePosition === 'left' || imagePosition === 'right') && 'flex-1'
      )}
    >
      {title && <h3 className="text-foreground mb-2 text-xl font-semibold">{title}</h3>}
      {description && <p className="text-muted-foreground mb-4 flex-1">{description}</p>}
      {buttonText && buttonLink && (
        <div className="mt-auto">
          <Link href={buttonLink}>
            <Button variant="default" size="sm">
              {buttonText}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className={cardClasses}>
      {imagePosition === 'left' && renderImage()}
      {imagePosition === 'top' && renderImage()}
      {renderContent()}
      {imagePosition === 'right' && renderImage()}
    </div>
  );
};

// Export with withEditable HOC for auto-registration
export default withEditableSSR(CardComponent, {
  metadata: {
    category: 'content',
    description: 'Flexible card component with image, title, description and optional button',
    icon: '🃏',
    tags: ['card', 'content', 'image', 'button'],
  },
  schema: CardSchema,
  defaultProps: {
    title: 'Card Title',
    description:
      'This is a sample card description that shows how content will be displayed in the card component.',
    image:
      'https://images.placeholders.dev/400x250?text=Card%20Image&bgColor=%236b7280&textColor=%23ffffff',
    imageAlt: 'Card image',
    buttonText: 'Learn More',
    buttonLink: 'https://example.com',
    variant: 'default',
    imagePosition: 'top',
  },
  validateInDev: true,
});
