/**
 * Call to Action Component - SSR/Client Conditional Implementation
 * Server Component by default, Client Component only in edit mode
 */

// NO 'use client' directive - Server Component by default
import React from 'react';
import { z } from 'zod';
import { withEditableSSR } from '@/lib/component-registry/with-editable-ssr';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// =============================================================================
// ZOD SCHEMA WITH VALIDATION
// =============================================================================

const CallToActionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  primaryButtonText: z.string().default('Get Started'),
  primaryButtonUrl: z.string().url('Must be a valid URL').optional(),
  secondaryButtonText: z.string().optional(),
  secondaryButtonUrl: z.string().url('Must be a valid URL').optional(),
  backgroundColor: z.enum(['default', 'primary', 'secondary', 'muted']).default('default'),
  textAlign: z.enum(['left', 'center', 'right']).default('center'),
  size: z.enum(['sm', 'md', 'lg']).default('md'),
  showSecondaryButton: z.boolean().default(false),
  className: z.string().optional(),
});

// Infer type from schema
type CallToActionProps = z.infer<typeof CallToActionSchema>;

// =============================================================================
// BASE COMPONENT (Server Component)
// =============================================================================

const BaseCallToAction: React.FC<CallToActionProps> = ({
  title,
  subtitle,
  description,
  primaryButtonText = 'Get Started',
  primaryButtonUrl,
  secondaryButtonText,
  secondaryButtonUrl,
  backgroundColor = 'default',
  textAlign = 'center',
  size = 'md',
  showSecondaryButton = false,
  className,
}) => {
  const containerClasses = cn(
    'rounded-lg',
    {
      'bg-background': backgroundColor === 'default',
      'bg-primary text-primary-foreground': backgroundColor === 'primary',
      'bg-secondary text-secondary-foreground': backgroundColor === 'secondary',
      'bg-muted text-muted-foreground': backgroundColor === 'muted',
    },
    {
      'p-6': size === 'sm',
      'p-8': size === 'md',
      'p-12': size === 'lg',
    },
    {
      'text-left': textAlign === 'left',
      'text-center': textAlign === 'center',
      'text-right': textAlign === 'right',
    },
    className
  );

  const titleClasses = cn(
    'font-bold mb-4',
    {
      'text-2xl': size === 'sm',
      'text-3xl': size === 'md',
      'text-4xl': size === 'lg',
    }
  );

  const subtitleClasses = cn(
    'font-medium mb-2',
    {
      'text-lg': size === 'sm',
      'text-xl': size === 'md',
      'text-2xl': size === 'lg',
    }
  );

  const descriptionClasses = cn(
    'mb-6',
    {
      'text-sm': size === 'sm',
      'text-base': size === 'md',
      'text-lg': size === 'lg',
    }
  );

  const buttonGroupClasses = cn(
    'flex gap-4',
    {
      'justify-start': textAlign === 'left',
      'justify-center': textAlign === 'center',
      'justify-end': textAlign === 'right',
    }
  );

  return (
    <div className={containerClasses}>
      {subtitle && (
        <p className={subtitleClasses}>
          {subtitle}
        </p>
      )}
      
      <h2 className={titleClasses}>
        {title}
      </h2>
      
      {description && (
        <p className={descriptionClasses}>
          {description}
        </p>
      )}
      
      <div className={buttonGroupClasses}>
        {primaryButtonUrl ? (
          <Link href={primaryButtonUrl}>
            <Button 
              size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
              variant={backgroundColor === 'primary' ? 'secondary' : 'default'}
            >
              {primaryButtonText}
            </Button>
          </Link>
        ) : (
          <Button 
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
            variant={backgroundColor === 'primary' ? 'secondary' : 'default'}
          >
            {primaryButtonText}
          </Button>
        )}
        
        {showSecondaryButton && secondaryButtonText && (
          secondaryButtonUrl ? (
            <Link href={secondaryButtonUrl}>
              <Button 
                variant="outline"
                size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
              >
                {secondaryButtonText}
              </Button>
            </Link>
          ) : (
            <Button 
              variant="outline"
              size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
            >
              {secondaryButtonText}
            </Button>
          )
        )}
      </div>
    </div>
  );
};

// =============================================================================
// SSR/CLIENT CONDITIONAL REGISTRATION
// =============================================================================

/**
 * Call to Action component with SSR/Client conditional rendering
 * - Server Component by default (better SEO, performance)
 * - Client Component only in edit mode (admin panel)
 */
const CallToAction = withEditableSSR(BaseCallToAction, {
  metadata: {
    category: 'marketing',
    description: 'Call to action section with title, description and buttons',
    icon: '📢',
    tags: ['cta', 'marketing', 'conversion', 'ssr'],
    version: '3.0.0', // SSR version
  },
  schema: CallToActionSchema,
  defaultProps: {
    title: 'Ready to get started?',
    description: 'Join thousands of satisfied customers and experience the difference.',
    primaryButtonText: 'Get Started',
    backgroundColor: 'default',
    textAlign: 'center',
    size: 'md',
    showSecondaryButton: false,
  },
  // Custom validation
  customValidation: (props) => {
    if (props.showSecondaryButton && !props.secondaryButtonText) {
      return 'Secondary button requires text when enabled';
    }
    if (props.secondaryButtonText && !props.secondaryButtonUrl && props.primaryButtonUrl) {
      return 'Secondary button should have URL when primary button has URL';
    }
    return null;
  },
  validateInDev: true,
  validateInProd: false,
});

// =============================================================================
// EXPORTS
// =============================================================================

export default CallToAction;
export { CallToActionSchema };
export type { CallToActionProps };

// =============================================================================
// SSR/CLIENT CONDITIONAL BENEFITS
// =============================================================================

/*
CALL TO ACTION SSR/CLIENT BENEFITS:
✅ Conversion Optimization:
   - Server-rendered for instant visibility
   - Better Core Web Vitals scores
   - Faster time to interactive
   - Improved user experience

✅ SEO Benefits:
   - CTA content indexed by search engines
   - Better social media previews
   - Improved click-through rates
   - Enhanced SERP appearance

✅ Performance:
   - Minimal JavaScript bundle
   - Fast initial render
   - Optimized for mobile
   - Better on slow connections

✅ A/B Testing Ready:
   - Easy prop modifications
   - Real-time preview in admin
   - Version tracking
   - Performance monitoring
*/