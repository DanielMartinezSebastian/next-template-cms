/**
 * Button Component
 * Simple button component with text, variants and optional link
 */

import { Button as UIButton } from '@/components/ui/button';
import { withEditableSSR } from '@/lib/component-registry';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import { z } from 'zod';

// Schema definition
const ButtonSchema = z.object({
  text: z.string(),
  href: z.string().optional(),
  variant: z.enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']),
  size: z.enum(['default', 'sm', 'lg', 'icon']),
  disabled: z.boolean(),
  fullWidth: z.boolean(),
  alignment: z.enum(['left', 'center', 'right']),
});

interface ButtonProps {
  text: string;
  href?: string;
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size: 'default' | 'sm' | 'lg' | 'icon';
  disabled: boolean;
  fullWidth: boolean;
  alignment: 'left' | 'center' | 'right';
  locale?: string;
  componentId?: string;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  text,
  href,
  variant,
  size,
  disabled,
  fullWidth,
  alignment,
  componentId,
}) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  const buttonElement = (
    <UIButton
      variant={variant}
      size={size}
      disabled={disabled}
      className={cn(fullWidth && 'w-full')}
    >
      {text}
    </UIButton>
  );

  const content = href ? (
    <Link href={href} className={fullWidth ? 'w-full' : undefined}>
      {buttonElement}
    </Link>
  ) : (
    buttonElement
  );

  return (
    <div
      className={cn(
        'button-wrapper relative flex',
        alignmentClasses[alignment],
        fullWidth && 'w-full'
      )}
      data-component-id={componentId}
    >
      {content}
    </div>
  );
};

// Export with withEditableSSR
export default withEditableSSR(ButtonComponent, {
  metadata: {
    category: 'interactive',
    description: 'Botón interactivo con texto personalizable y estilos variables',
    icon: '🔘',
    tags: ['button', 'interactive', 'cta', 'action'],
  },
  schema: ButtonSchema,
  defaultProps: {
    text: 'Hacer clic',
    variant: 'default',
    size: 'default',
    disabled: false,
    fullWidth: false,
    alignment: 'left',
  },
  validateInDev: true,
});

export { ButtonSchema };
export type { ButtonProps };
