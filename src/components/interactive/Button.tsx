/**
 * Button Component - SSR/Client Conditional Implementation
 * Server Component by default, Client Component only in edit mode
 */

// NO 'use client' directive - Server Component by default
import React from 'react';
import { z } from 'zod';
import { withEditableSSR } from '@/lib/component-registry/with-editable-ssr';
import { Button as UIButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// =============================================================================
// ZOD SCHEMA WITH DEFAULTS
// =============================================================================

const ButtonSchema = z.object({
  text: z.string().default('Button'),
  href: z.string().optional(),
  variant: z.enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']).default('default'),
  size: z.enum(['default', 'sm', 'lg', 'icon']).default('default'),
  disabled: z.boolean().default(false),
  fullWidth: z.boolean().default(false),
  centerAlign: z.boolean().default(false),
  className: z.string().optional(),
});

// Infer type from schema
type ButtonProps = z.infer<typeof ButtonSchema>;

// =============================================================================
// BASE COMPONENT (Server Component)
// =============================================================================

const BaseButton: React.FC<ButtonProps> = ({
  text = 'Button',
  href,
  variant = 'default',
  size = 'default',
  disabled = false,
  fullWidth = false,
  centerAlign = false,
  className,
}) => {
  const buttonElement = (
    <UIButton
      variant={variant}
      size={size}
      disabled={disabled}
      className={cn(fullWidth && 'w-full', className)}
    >
      {text}
    </UIButton>
  );

  const wrapperClasses = cn(centerAlign && 'flex justify-center', fullWidth && 'w-full');

  if (href) {
    return (
      <div className={wrapperClasses}>
        <Link href={href}>{buttonElement}</Link>
      </div>
    );
  }

  return <div className={wrapperClasses}>{buttonElement}</div>;
};

// =============================================================================
// SSR/CLIENT CONDITIONAL REGISTRATION
// =============================================================================

/**
 * Button component with SSR/Client conditional rendering
 * - Server Component by default (better SEO, performance)
 * - Client Component only in edit mode (admin panel)
 */
const Button = withEditableSSR(BaseButton, {
  metadata: {
    category: 'interactive',
    description: 'Interactive button with conditional SSR/Client rendering',
    icon: '🔘',
    tags: ['button', 'interactive', 'ssr', 'conditional'],
    version: '3.0.0', // SSR version
  },
  schema: ButtonSchema,
  defaultProps: {
    text: 'Click me',
    variant: 'default',
    size: 'default',
    disabled: false,
    fullWidth: false,
    centerAlign: false,
  },
  // Custom validation for security
  customValidation: (props) => {
    if (props.href && props.href.startsWith('javascript:')) {
      return 'JavaScript URLs are not allowed for security reasons';
    }
    return null;
  },
  validateInDev: true,
  validateInProd: false,
});

// =============================================================================
// EXPORTS
// =============================================================================

export default Button;
export { ButtonSchema };
export type { ButtonProps };

// =============================================================================
// SSR/CLIENT BENEFITS
// =============================================================================

/*
SSR/CLIENT CONDITIONAL BENEFITS:
✅ Server-Side Rendering by default:
   - Better SEO (search engines see content)
   - Faster initial page load
   - Reduced JavaScript bundle size
   - Better performance on slow connections

✅ Client-Side Rendering in edit mode:
   - Interactive editing capabilities
   - Real-time prop validation
   - Component auto-registration
   - Editor UI generation

✅ Automatic detection:
   - Detects admin/editor routes
   - Switches rendering mode automatically
   - No manual configuration required
   - Works with existing pages

✅ Performance optimized:
   - Minimal JavaScript in production
   - Full interactivity in admin
   - Best of both worlds
*/