/**
 * Button Component
 * Standalone button component with customizable properties
 */

import { Button as UIButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

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

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  text = 'Button',
  href,
  variant = 'default',
  size = 'default',
  disabled = false,
  fullWidth = false,
  centerAlign = false,
  className,
  onClick,
}) => {
  const buttonElement = (
    <UIButton
      variant={variant}
      size={size}
      disabled={disabled}
      className={cn(fullWidth && 'w-full', className)}
      onClick={onClick}
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

export default ButtonComponent;
