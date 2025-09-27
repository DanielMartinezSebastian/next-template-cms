/**
 * Card Component - SSR/Client Conditional Implementation
 * Server Component by default, Client Component only in edit mode
 */

// NO 'use client' directive - Server Component by default
import React from 'react';
import { z } from 'zod';
import { withEditableSSR } from '@/lib/component-registry/with-editable-ssr';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// =============================================================================
// ZOD SCHEMA WITH VALIDATION
// =============================================================================

const CardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  image: z.string().url('Must be a valid URL').optional(),
  href: z.string().optional(),
  variant: z.enum(['default', 'elevated', 'outlined']).default('default'),
  imagePosition: z.enum(['top', 'left', 'right']).default('top'),
  showButton: z.boolean().default(false),
  buttonText: z.string().default('Learn More'),
  className: z.string().optional(),
});

// Infer type from schema
type CardProps = z.infer<typeof CardSchema>;

// =============================================================================
// BASE COMPONENT (Server Component)
// =============================================================================

const BaseCard: React.FC<CardProps> = ({
  title,
  description,
  image,
  href,
  variant = 'default',
  imagePosition = 'top',
  showButton = false,
  buttonText = 'Learn More',
  className,
}) => {
  const cardClasses = cn(
    'overflow-hidden transition-shadow duration-200',
    {
      'bg-card border border-border shadow-sm hover:shadow-md': variant === 'default',
      'bg-card border border-border shadow-lg hover:shadow-xl': variant === 'elevated',
      'bg-card border-2 border-border': variant === 'outlined',
    },
    {
      'rounded-lg': imagePosition === 'top',
      'rounded-lg flex': imagePosition === 'left' || imagePosition === 'right',
    },
    className
  );

  const imageElement = image ? (
    <div className={cn(
      'relative overflow-hidden',
      {
        'h-48 w-full': imagePosition === 'top',
        'h-full w-1/3': imagePosition === 'left' || imagePosition === 'right',
      }
    )}>
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  ) : null;

  const contentElement = (
    <div className={cn(
      'p-6',
      {
        'flex-1': imagePosition === 'left' || imagePosition === 'right',
      }
    )}>
      <h3 className="text-xl font-semibold text-card-foreground mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {description}
        </p>
      )}
      {showButton && href && (
        <Link
          href={href}
          className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
        >
          {buttonText}
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      )}
    </div>
  );

  const cardContent = (
    <>
      {imagePosition === 'top' && imageElement}
      {imagePosition === 'left' && (
        <>
          {imageElement}
          {contentElement}
        </>
      )}
      {imagePosition === 'right' && (
        <>
          {contentElement}
          {imageElement}
        </>
      )}
      {imagePosition === 'top' && contentElement}
    </>
  );

  if (href && !showButton) {
    return (
      <Link href={href} className="block">
        <div className={cardClasses}>
          {cardContent}
        </div>
      </Link>
    );
  }

  return (
    <div className={cardClasses}>
      {cardContent}
    </div>
  );
};

// =============================================================================
// SSR/CLIENT CONDITIONAL REGISTRATION
// =============================================================================

/**
 * Card component with SSR/Client conditional rendering
 * - Server Component by default (better SEO, performance)
 * - Client Component only in edit mode (admin panel)
 */
const Card = withEditableSSR(BaseCard, {
  metadata: {
    category: 'content',
    description: 'Content card with image, title, description and optional link',
    icon: '🃏',
    tags: ['card', 'content', 'image', 'ssr'],
    version: '3.0.0', // SSR version
  },
  schema: CardSchema,
  defaultProps: {
    title: 'Card Title',
    description: 'This is a sample card description that shows how the card component works.',
    variant: 'default',
    imagePosition: 'top',
    showButton: false,
    buttonText: 'Learn More',
  },
  // Custom validation
  customValidation: (props) => {
    if (props.showButton && !props.href) {
      return 'Button requires a valid href URL';
    }
    if (props.image && !props.image.startsWith('http')) {
      return 'Image must be a valid HTTP URL';
    }
    return null;
  },
  validateInDev: true,
  validateInProd: false,
});

// =============================================================================
// EXPORTS
// =============================================================================

export default Card;
export { CardSchema };
export type { CardProps };

// =============================================================================
// SSR/CLIENT CONDITIONAL BENEFITS
// =============================================================================

/*
CARD COMPONENT SSR/CLIENT BENEFITS:
✅ SEO Optimized:
   - Card content rendered on server
   - Search engines can index title and description
   - Better social media sharing
   - Improved Core Web Vitals

✅ Performance:
   - Images loaded with Next.js optimization
   - Minimal JavaScript footprint
   - Faster time to first contentful paint
   - Better on slow connections

✅ Accessibility:
   - Proper semantic structure
   - Keyboard navigation support
   - Screen reader friendly
   - Focus management

✅ Editor Integration:
   - Real-time preview in admin
   - Drag and drop support
   - Live prop editing
   - Visual feedback
*/