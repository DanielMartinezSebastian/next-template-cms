/**
 * Editor Theme Configuration for Lexical
 * Defines CSS classes for different node types and states
 */
import type { EditorThemeClasses } from 'lexical';

export const editorTheme: EditorThemeClasses = {
  // Root styling
  root: 'relative focus:outline-none',

  // Paragraph styling
  paragraph: 'mb-4 text-foreground leading-relaxed',

  // Text formatting
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline line-through',
    code: 'bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-muted-foreground',
  },

  // Headings
  heading: {
    h1: 'text-4xl font-bold mb-6 text-foreground border-b border-border pb-2',
    h2: 'text-3xl font-semibold mb-5 text-foreground',
    h3: 'text-2xl font-semibold mb-4 text-foreground',
    h4: 'text-xl font-semibold mb-3 text-foreground',
    h5: 'text-lg font-semibold mb-2 text-foreground',
    h6: 'text-base font-semibold mb-2 text-foreground',
  },

  // Lists
  list: {
    nested: {
      listitem: 'list-none',
    },
    ol: 'list-decimal list-inside mb-4 space-y-1 ml-4',
    ul: 'list-disc list-inside mb-4 space-y-1 ml-4',
    listitem: 'text-foreground',
    listitemChecked: 'line-through opacity-60',
    listitemUnchecked: 'text-foreground',
  },

  // Links
  link: 'text-primary hover:text-primary/80 underline cursor-pointer',

  // Code blocks
  code: 'bg-muted border border-border rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4',
  codeHighlight: {
    atrule: 'text-purple-600',
    attr: 'text-blue-600',
    boolean: 'text-red-600',
    builtin: 'text-purple-600',
    cdata: 'text-gray-600',
    char: 'text-green-600',
    class: 'text-blue-600',
    'class-name': 'text-blue-600',
    comment: 'text-gray-500 italic',
    constant: 'text-red-600',
    deleted: 'text-red-600',
    doctype: 'text-gray-600',
    entity: 'text-red-600',
    function: 'text-purple-600',
    important: 'text-red-600',
    inserted: 'text-green-600',
    keyword: 'text-purple-600',
    namespace: 'text-blue-600',
    number: 'text-orange-600',
    operator: 'text-gray-700',
    prolog: 'text-gray-600',
    property: 'text-blue-600',
    punctuation: 'text-gray-700',
    regex: 'text-green-600',
    selector: 'text-green-600',
    string: 'text-green-600',
    symbol: 'text-red-600',
    tag: 'text-red-600',
    url: 'text-blue-600',
    variable: 'text-blue-600',
  },

  // Quote
  quote: 'border-l-4 border-primary pl-4 italic text-muted-foreground mb-4',

  // Tables
  table: 'border-collapse border border-border mb-4 w-full',
  tableCell: 'border border-border px-4 py-2 text-left',
  tableCellHeader: 'border border-border px-4 py-2 text-left font-semibold bg-muted',

  // Mark/Highlight
  mark: 'bg-yellow-200 dark:bg-yellow-800 px-1 rounded',
  markOverlap: 'bg-yellow-300 dark:bg-yellow-700 px-1 rounded',

  // Placeholder
  placeholder: 'text-muted-foreground pointer-events-none absolute top-0 left-0',

  // Layout containers
  layoutContainer: 'grid gap-4',
  layoutItem: 'min-h-[40px] border border-dashed border-border rounded-lg p-4',
};

export default editorTheme;
