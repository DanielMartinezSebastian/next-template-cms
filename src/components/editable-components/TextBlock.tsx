/**
 * Text Block Component
 * Simple text content component with optional title
 */

import { withEditableSSR } from '@/lib/component-registry';
import { cn } from '@/lib/utils';
import React from 'react';
import { z } from 'zod';

// Schema definition
const TextBlockSchema = z.object({
  title: z.string().optional(),
  content: z.string(),
  textAlign: z.enum(['left', 'center', 'right']),
  textSize: z.enum(['small', 'medium', 'large']),
  titleSize: z.enum(['small', 'medium', 'large']),
  color: z.string(),
  backgroundColor: z.string().optional(),
  maxWidth: z.enum(['none', 'prose', 'container']),
  padding: z.enum(['none', 'small', 'medium', 'large']),
});

interface TextBlockProps {
  title?: string;
  content: string;
  textAlign: 'left' | 'center' | 'right';
  textSize: 'small' | 'medium' | 'large';
  titleSize: 'small' | 'medium' | 'large';
  color: string;
  backgroundColor?: string;
  maxWidth: 'none' | 'prose' | 'container';
  padding: 'none' | 'small' | 'medium' | 'large';
  locale?: string;
  editMode?: boolean;
  componentId?: string;
}

const TextBlockComponent: React.FC<TextBlockProps> = ({
  title,
  content,
  textAlign,
  textSize,
  titleSize,
  color,
  backgroundColor,
  maxWidth,
  padding,
  componentId,
  editMode,
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  const titleSizeClasses = {
    small: 'text-lg',
    medium: 'text-xl md:text-2xl',
    large: 'text-2xl md:text-3xl',
  };

  const maxWidthClasses = {
    none: 'w-full',
    prose: 'max-w-prose mx-auto',
    container: 'max-w-4xl mx-auto',
  };

  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };

  return (
    <div
      className={cn(
        'text-block relative',
        alignClasses[textAlign],
        maxWidthClasses[maxWidth],
        paddingClasses[padding]
      )}
      style={{
        color,
        backgroundColor: backgroundColor || undefined,
      }}
      data-component-id={componentId}
    >
      {title && (
        <h2
          className={cn(
            'font-bold mb-4',
            titleSizeClasses[titleSize]
          )}
          style={{ color }}
        >
          {title}
        </h2>
      )}

      <div
        className={cn(
          'whitespace-pre-wrap',
          textSizeClasses[textSize]
        )}
        style={{ color }}
      >
        {content}
      </div>

      {editMode && !content && (
        <div className="border-2 border-dashed border-gray-300 p-8 text-center text-gray-500 rounded">
          <div className="text-lg font-medium">Bloque de texto vacío</div>
          <div className="text-sm">Agrega contenido para mostrar aquí</div>
        </div>
      )}

      {editMode && (
        <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
          Text Block
        </div>
      )}
    </div>
  );
};

// Export with withEditableSSR
export default withEditableSSR(TextBlockComponent, {
  metadata: {
    category: 'content',
    description: 'Bloque de texto simple con título opcional y contenido personalizable',
    icon: '📝',
    tags: ['text', 'content', 'typography'],
  },
  schema: TextBlockSchema,
  defaultProps: {
    content: 'Este es un ejemplo de contenido de texto. Puedes editarlo desde el panel de administración.',
    textAlign: 'left',
    textSize: 'medium',
    titleSize: 'medium',
    color: '#374151',
    maxWidth: 'prose',
    padding: 'medium',
  },
  validateInDev: true,
});

export { TextBlockSchema };
export type { TextBlockProps };