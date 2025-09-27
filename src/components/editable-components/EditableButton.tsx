/**
 * Editable Button Component - Example using new withEditable system
 * This demonstrates the new auto-registration pattern with Zod schemas
 */

import React from 'react';
import { z } from 'zod';
import { withEditable } from '@/lib/component-registry';
import { Button as UIButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// =============================================================================
// ZOD SCHEMA DEFINITION
// =============================================================================

const EditableButtonSchema = z.object({
  text: z.string().min(1, 'Button text is required'),
  href: z.string().optional(),
  variant: z.enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']).default('default'),
  size: z.enum(['default', 'sm', 'lg', 'icon']).default('default'),
  disabled: z.boolean().default(false),
  fullWidth: z.boolean().default(false),
  centerAlign: z.boolean().default(false),
  className: z.string().optional(),
});

type EditableButtonProps = z.infer<typeof EditableButtonSchema>;

// =============================================================================
// COMPONENT IMPLEMENTATION
// =============================================================================

const EditableButtonComponent: React.FC<EditableButtonProps> = ({
  text,
  href,
  variant,
  size,
  disabled,
  fullWidth,
  centerAlign,
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
// EDITABLE COMPONENT REGISTRATION
// =============================================================================

/**
 * Auto-registered editable button component
 * Uses the new withEditable HOC for automatic schema detection and validation
 */
const EditableButton = withEditable(EditableButtonComponent, {
  metadata: {
    category: 'interactive',
    description: 'Interactive button component with customizable appearance and behavior',
    icon: '🔘',
    tags: ['button', 'interactive', 'cta', 'action'],
  },
  schema: EditableButtonSchema,
  defaultProps: {
    text: 'Click me',
    variant: 'default',
    size: 'default',
    disabled: false,
    fullWidth: false,
    centerAlign: false,
  },
  validateInDev: true,
  validateInProd: false,
});

// =============================================================================
// EXPORTS
// =============================================================================

export default EditableButton;
export { EditableButtonSchema };
export type { EditableButtonProps };
