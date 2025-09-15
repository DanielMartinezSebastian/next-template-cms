/**
 * Visual Editor Component using Lexical
 * Main editor component with all plugins and functionality
 */
'use client';

import { TRANSFORMERS } from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useEffect, useState } from 'react';

// Lexical nodes
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { EditableComponentNode } from './nodes/EditableComponentNode';

// Plugins
import { EditableComponentsPlugin } from './plugins/EditableComponentsPlugin';
import { ToolbarPlugin } from './plugins/ToolbarPlugin';

// Theme
import editorTheme from './themes/editor-theme';

// TODO: Import stores when component selection is implemented
// import { useEditModeActions } from '../../stores';

import type { EditorState } from 'lexical';

interface VisualEditorProps {
  initialContent?: string;
  placeholder?: string;
  onChange?: (content: string) => void;
  className?: string;
  readOnly?: boolean;
}

// Error boundary component
function LexicalErrorBoundaryComponent({ children }: { children: React.ReactNode }) {
  return <div className="rounded border border-red-300 p-4 text-red-500">{children}</div>;
}

// Auto-save plugin
function AutoSavePlugin({ onChange }: { onChange?: (content: string) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editor.read(() => {
        const content = JSON.stringify(editorState.toJSON());
        onChange?.(content);
      });
    });
  }, [editor, onChange]);

  return null;
}

// Placeholder component
function Placeholder({ text }: { text: string }) {
  return (
    <div className="text-muted-foreground pointer-events-none absolute left-4 top-4 select-none">
      {text}
    </div>
  );
}

export function VisualEditor({
  placeholder = 'Start writing...',
  onChange,
  className = '',
  readOnly = false,
}: Omit<VisualEditorProps, 'initialContent'>) {
  const [isClient, setIsClient] = useState(false);

  // TODO: Implement handleComponentClick when component selection is needed
  // const { setSelectedComponent } = useEditModeActions();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const initialConfig = {
    namespace: 'VisualEditor',
    theme: editorTheme,
    onError: (error: Error) => {
      console.error('Lexical error:', error);
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      EditableComponentNode,
    ],
    editable: !readOnly,
  };

  const handleEditorChange = (editorState: EditorState) => {
    const content = JSON.stringify(editorState.toJSON());
    onChange?.(content);

    // TODO: Clear component selection when editor content changes
    // setSelectedComponent(null);
  };

  // TODO: Implement when component selection is needed
  // const handleComponentClick = (componentId: string) => {
  //   setSelectedComponent(componentId);
  // };

  // Hydration guard
  if (!isClient) {
    return (
      <div className={`bg-card border-border min-h-[400px] rounded-lg border ${className}`}>
        <div className="text-muted-foreground flex h-full items-center justify-center">
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border-border overflow-hidden rounded-lg border ${className}`}>
      <LexicalComposer initialConfig={initialConfig}>
        {/* Toolbar */}
        {!readOnly && <ToolbarPlugin />}

        {/* Main Editor */}
        <div className="relative min-h-[400px]">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="text-foreground resize-none overflow-hidden p-4 outline-none"
                style={{ minHeight: '400px' }}
                aria-label="Rich text editor"
              />
            }
            placeholder={<Placeholder text={placeholder} />}
            ErrorBoundary={LexicalErrorBoundaryComponent}
          />

          {/* Plugins */}
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <EditableComponentsPlugin />
          <AutoSavePlugin onChange={onChange} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin onChange={handleEditorChange} />
        </div>
      </LexicalComposer>
    </div>
  );
}

export default VisualEditor;
