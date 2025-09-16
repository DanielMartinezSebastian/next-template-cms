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
import { ContainerNode } from './nodes/ContainerNode';
import { DynamicComponentNode } from './nodes/DynamicComponentNode';
import { EditableComponentNode } from './nodes/EditableComponentNode';

// Plugins
import { EditableComponentsPlugin } from './plugins/EditableComponentsPlugin';
import { StoreSyncPlugin } from './plugins/StoreSyncPlugin';
import { ToolbarPlugin } from './plugins/ToolbarPlugin';

// Theme
import editorTheme from './themes/editor-theme';

// Store integration
import { useEditModeActions, useEditModeEnabled, useSelectedComponent } from '../../stores';

import type { EditorState } from 'lexical';

interface VisualEditorProps {
  initialContent?: string;
  placeholder?: string;
  onChange?: (content: string) => void;
  className?: string;
  readOnly?: boolean;
  width?: number; // Width for responsive layout adjustments
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
        const editorJson = editorState.toJSON();
        const content = JSON.stringify(editorJson);

        console.warn('🔍 [AutoSavePlugin] Editor state changed');
        console.warn('📄 Editor JSON:', editorJson);
        console.warn('📏 JSON content length:', content.length);
        console.warn('🔍 Content preview:', content.substring(0, 200));

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
  initialContent,
  placeholder = 'Start writing...',
  onChange,
  className = '',
  readOnly = false,
  width,
}: VisualEditorProps) {
  const [isClient, setIsClient] = useState(false);

  // Store integration
  const { setSelectedComponent, addHistoryAction } = useEditModeActions();
  const selectedComponentId = useSelectedComponent();
  const isEditMode = useEditModeEnabled();

  useEffect(() => {
    setIsClient(true);

    // Listen for component selection events
    const handleComponentSelected = (event: CustomEvent) => {
      const { componentId } = event.detail;
      if (isEditMode) {
        setSelectedComponent(componentId);
      }
    };

    const handleContainerSelected = (event: CustomEvent) => {
      const { containerId } = event.detail;
      if (isEditMode) {
        setSelectedComponent(containerId);
      }
    };

    window.addEventListener('component-selected', handleComponentSelected as EventListener);
    window.addEventListener('container-selected', handleContainerSelected as EventListener);

    return () => {
      window.removeEventListener('component-selected', handleComponentSelected as EventListener);
      window.removeEventListener('container-selected', handleContainerSelected as EventListener);
    };
  }, [isEditMode, setSelectedComponent]);

  // Parse initial content if provided
  const getInitialEditorState = () => {
    if (initialContent && initialContent.trim() !== '') {
      try {
        const parsedContent = JSON.parse(initialContent);
        console.warn('🎯 Parsed initial content:', parsedContent);

        // Validate that parsed content has Lexical structure
        if (parsedContent && parsedContent.root && parsedContent.root.children) {
          return parsedContent;
        } else {
          console.warn('⚠️ Parsed content does not have valid Lexical structure, using default');
          return null;
        }
      } catch (error) {
        console.warn('Failed to parse initialContent as JSON, treating as plain text:', error);
        return null;
      }
    }
    return null;
  };

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
      ContainerNode,
      DynamicComponentNode,
    ],
    // Use editorState for initial content instead of JSON
    ...(getInitialEditorState() && { editorState: JSON.stringify(getInitialEditorState()) }),
    editable: !readOnly,
  };

  const handleEditorChange = (editorState: EditorState) => {
    const editorJson = editorState.toJSON();
    const content = JSON.stringify(editorJson);

    console.warn('🔍 [VisualEditor.handleEditorChange] OnChangePlugin triggered');
    console.warn('📄 Editor JSON:', editorJson);
    console.warn('📏 JSON content length:', content.length);
    console.warn('🔍 Content preview:', content.substring(0, 200));

    onChange?.(content);

    // Clear component selection when editor content changes
    if (selectedComponentId) {
      setSelectedComponent(null);
    }

    // Add to history if in edit mode
    if (isEditMode) {
      addHistoryAction({
        type: 'update',
        componentId: 'editor-content',
        newValue: { content },
      });
    }
  };

  const handleComponentClick = (componentId: string) => {
    if (isEditMode) {
      setSelectedComponent(componentId);
    }
  };

  // Component click handler for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleComponentInteraction = handleComponentClick;

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
    <div
      className={`bg-card border-border overflow-hidden rounded-lg border ${className} ${
        isEditMode ? 'ring-primary/20 ring-2' : ''
      }`}
      style={{ width: width ? `${width - 32}px` : '100%' }} // Responsive container width
    >
      <LexicalComposer initialConfig={initialConfig}>
        {/* Edit Mode Indicator */}
        {isEditMode && (
          <div className="bg-primary text-primary-foreground border-border flex items-center gap-2 border-b px-4 py-2 text-sm">
            <div className="bg-primary-foreground/20 h-2 w-2 rounded-full"></div>
            Edit Mode Active
            {selectedComponentId && (
              <span className="bg-primary-foreground/20 rounded px-2 py-1 text-xs">
                Selected: {selectedComponentId}
              </span>
            )}
          </div>
        )}

        {/* Toolbar */}
        {!readOnly && <ToolbarPlugin width={width} />}

        {/* Main Editor */}
        <div
          className="relative min-h-[400px]"
          style={{ width: '100%' }} // Use full width of parent container
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="text-foreground resize-none overflow-hidden p-4 outline-none"
                style={{
                  minHeight: '400px',
                  width: '100%',
                  maxWidth: '100%',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                }}
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
          <StoreSyncPlugin />
          <AutoSavePlugin onChange={onChange} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin onChange={handleEditorChange} />
        </div>
      </LexicalComposer>
    </div>
  );
}

export default VisualEditor;
