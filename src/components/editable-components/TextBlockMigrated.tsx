/**
 * Migrated Text Block Component with withEditable
 * Dynamic text content component
 */

import React from 'react';
import { withEditable } from '@/lib/component-registry';
import { z } from 'zod';

// Zod schema for runtime validation
const TextBlockSchema = z.object({
  content: z.string().optional().default(''),
  title: z.string().optional().default(''),
  subtitle: z.string().optional().default(''),
  textAlign: z.enum(['left', 'center', 'right', 'justify']).default('left'),
  fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
  fontWeight: z.enum(['normal', 'medium', 'bold']).default('normal'),
  color: z.string().optional().default(''),
  backgroundColor: z.string().optional().default(''),
  padding: z.enum(['none', 'small', 'medium', 'large']).default('medium'),
  margin: z.enum(['none', 'small', 'medium', 'large']).default('medium'),
  maxWidth: z.enum(['none', 'prose', 'container']).default('prose'),
  allowHtml: z.boolean().default(false)
});

export interface TextBlockProps extends z.infer<typeof TextBlockSchema> {
  locale?: string;
  editMode?: boolean;
  componentId?: string;
  nodeKey?: string;
  isInEditMode?: boolean;
}

const TextBlockComponent: React.FC<TextBlockProps> = ({
  content = '',
  title = '',
  subtitle = '',
  textAlign = 'left',
  fontSize = 'medium',
  fontWeight = 'normal',
  color = '',
  backgroundColor = '',
  padding = 'medium',
  margin = 'medium',
  maxWidth = 'prose',
  allowHtml = false,
  editMode = false,
  componentId,
  nodeKey,
  isInEditMode,
}) => {
  // Determinar si mostrar indicadores de edición
  const showEditIndicators = editMode || isInEditMode;
  const textAlignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  }[textAlign];

  const fontSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[fontSize];

  const fontWeightClass = {
    normal: 'font-normal',
    medium: 'font-medium',
    bold: 'font-bold',
  }[fontWeight];

  const paddingClass = {
    none: 'p-0',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  }[padding];

  const marginClass = {
    none: 'm-0',
    small: 'my-4',
    medium: 'my-6',
    large: 'my-8',
  }[margin];

  const maxWidthClass = {
    none: 'w-full',
    prose: 'max-w-prose mx-auto',
    container: 'max-w-6xl mx-auto',
  }[maxWidth];

  const customStyles: React.CSSProperties = {
    color: color || undefined,
    backgroundColor: backgroundColor || undefined,
  };

  return (
    <div
      className={`text-block ${paddingClass} ${marginClass} ${showEditIndicators ? 'relative ring-2 ring-blue-500 ring-opacity-50' : ''}`}
      style={backgroundColor ? customStyles : undefined}
      data-component-id={componentId}
      data-node-key={nodeKey}
    >
      {/* Edit Mode Indicator */}
      {showEditIndicators && (
        <div className="absolute left-1 top-1 z-10 rounded bg-blue-500 px-2 py-1 text-xs text-white shadow">
          Text Block {nodeKey ? `(${nodeKey})` : ''}
        </div>
      )}

      <div className={`${maxWidthClass} ${textAlignClass}`}>
        {title && (
          <h2
            className={`mb-4 text-2xl font-bold ${color ? '' : 'text-foreground'}`}
            style={color ? { color } : undefined}
          >
            {title}
          </h2>
        )}

        {subtitle && (
          <h3
            className={`mb-6 text-xl font-semibold ${color ? '' : 'text-muted-foreground'}`}
            style={color ? { color } : undefined}
          >
            {subtitle}
          </h3>
        )}

        {content && (
          <div
            className={`prose prose-gray dark:prose-invert ${fontSizeClass} ${fontWeightClass} ${textAlignClass} max-w-none`}
            style={color ? { color } : undefined}
          >
            {allowHtml ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <div className="whitespace-pre-wrap">{content}</div>
            )}
          </div>
        )}

        {/* Empty state for edit mode */}
        {showEditIndicators && !content && !title && !subtitle && (
          <div className="rounded border-2 border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-600 dark:text-gray-400">
            <div className="text-lg font-medium">Empty Text Block</div>
            <div className="text-sm">Add title, subtitle, or content to this text block</div>
          </div>
        )}

        {/* Show placeholder content when not in edit mode and no content */}
        {!showEditIndicators && !content && !title && !subtitle && (
          <div className="rounded border border-gray-200 p-6 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <div className="text-lg font-medium">Text Block</div>
            <div className="text-sm">Configure this component to add content</div>
          </div>
        )}
      </div>
    </div>
  );
};

// Export with withEditable HOC for auto-registration
export default withEditable(TextBlockComponent, {
  metadata: {
    category: 'content',
    description: 'Text block component with title, subtitle and rich content support',
    icon: '📝',
    tags: ['text', 'content', 'typography', 'prose']
  },
  schema: TextBlockSchema,
  defaultProps: {
    content: '',
    title: '',
    subtitle: '',
    textAlign: 'left',
    fontSize: 'medium',
    fontWeight: 'normal',
    color: '',
    backgroundColor: '',
    padding: 'medium',
    margin: 'medium',
    maxWidth: 'prose',
    allowHtml: false
  },
  validateInDev: true
});