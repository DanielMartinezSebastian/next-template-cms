/**
 * Section Component
 * Generic container section with customizable background and padding
 */

import { cn } from '@/lib/utils';
import React from 'react';

export interface SectionProps {
  children?: React.ReactNode;
  title?: string;
  backgroundColor?: string;
  textColor?: string;
  padding?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  centerContent?: boolean;
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  children,
  title,
  backgroundColor = 'transparent',
  textColor = 'inherit',
  padding = 'medium',
  fullWidth = false,
  centerContent = false,
  className,
}) => {
  const paddingClasses = {
    small: 'py-8 px-4',
    medium: 'py-16 px-6',
    large: 'py-24 px-8',
  }[padding];

  return (
    <section
      className={cn(
        'section',
        paddingClasses,
        fullWidth ? 'w-full' : 'mx-auto max-w-7xl',
        centerContent && 'text-center',
        className
      )}
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      {title && <h2 className="mb-8 text-3xl font-bold">{title}</h2>}
      <div className={cn(centerContent && 'flex flex-col items-center')}>
        {children || (
          <p className="text-muted-foreground">
            Esta es una sección genérica. Añade contenido editando las propiedades del componente.
          </p>
        )}
      </div>
    </section>
  );
};

export default Section;
