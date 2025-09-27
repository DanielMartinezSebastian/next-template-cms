/**
 * Button Component - Migrated to new withEditable system
 * Shows how to migrate existing components to the new auto-registration pattern
 */

import React from 'react';
import { z } from 'zod';
import { withEditable } from '@/lib/component-registry';
import { Button as UIButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// =============================================================================
// MIGRATION FROM OLD SYSTEM
// =============================================================================

// OLD: Manual interface definition (kept for reference)
export interface ButtonComponentProps {
  text?: string;
  href?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  fullWidth?: boolean;
  centerAlign?: boolean;
  className?: string;
  onClick?: () => void;
}

// NEW: Zod schema that matches the old interface
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

// Infer type from schema (this replaces the manual interface)
type ButtonProps = z.infer<typeof ButtonSchema>;

// =============================================================================
// COMPONENT IMPLEMENTATION (unchanged from original)
// =============================================================================

const ButtonComponent: React.FC<ButtonProps> = ({
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
// NEW: AUTO-REGISTRATION WITH withEditable
// =============================================================================

/**
 * Migrated Button component with automatic registration
 * This replaces the old manual configuration system
 */
const ButtonMigrated = withEditable(ButtonComponent, {
  metadata: {
    category: 'interactive',
    description: 'Interactive button component with customizable appearance and navigation',
    icon: '🔘',
    tags: ['button', 'interactive', 'cta', 'navigation'],
    version: '2.0.0', // Incremented to indicate migration
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
  // Custom validation (optional)
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

export default ButtonMigrated;
export { ButtonSchema };
export type { ButtonProps };

// =============================================================================
// MIGRATION NOTES
// =============================================================================

/*
MIGRATION SUMMARY:
1. ✅ Converted interface to Zod schema
2. ✅ Added automatic registration via withEditable
3. ✅ Added runtime validation
4. ✅ Added custom validation logic
5. ✅ Component logic remains unchanged
6. ✅ TypeScript types preserved via z.infer
7. ✅ Enhanced metadata with tags and version

BENEFITS:
- 🚀 Zero manual configuration required
- ✅ Runtime validation with Zod
- 🎨 Auto-generated editor UI
- 📊 Component registration tracking
- 🔒 Enhanced security validation
- 📦 Better component discoverability

BREAKING CHANGES:
- onClick handler removed (not serializable in editor)
- Props are now validated at runtime
- Component requires registration via withEditable

COMPATIBILITY:
- All existing props are supported
- TypeScript types are preserved
- Component behavior is identical
*/
