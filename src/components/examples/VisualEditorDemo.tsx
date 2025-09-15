/**
 * Visual Editor Demo Component
 * Interactive demonstration of the Lexical visual editor
 */
'use client';

import { VisualEditor } from '@/components/editor/VisualEditor';
import { Button } from '@/components/ui/button';
import { useEditModeActions, useEditModeEnabled, useSelectedComponent } from '@/stores';
import { useState } from 'react';

export default function VisualEditorDemo() {
  const [editorContent, setEditorContent] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  // Edit mode state
  const { toggleEditMode } = useEditModeActions();
  const isEditMode = useEditModeEnabled();
  const selectedComponentId = useSelectedComponent();

  const handleContentChange = (content: string) => {
    setEditorContent(content);
    // Content changed - could trigger auto-save here
  };

  const handleSave = () => {
    // In a real app, this would save to your backend/database
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-alert
      window.alert('Content saved! Check the preview panel for details.');
    }
  };

  const handleClear = () => {
    if (
      typeof window !== 'undefined' &&
      // eslint-disable-next-line no-alert
      window.confirm('Are you sure you want to clear all content?')
    ) {
      setEditorContent('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Visual Editor Demo</h1>
          <p className="text-muted-foreground mt-2">
            Interactive demonstration of the Lexical visual editor with drag & drop components,
            real-time editing, and advanced layout features.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            <Button
              onClick={toggleEditMode}
              variant={isEditMode ? 'default' : 'outline'}
              className="relative"
            >
              {isEditMode ? (
                <>
                  <div className="bg-primary-foreground/20 mr-2 h-2 w-2 rounded-full"></div>
                  Exit Edit Mode
                </>
              ) : (
                'Enter Edit Mode'
              )}
            </Button>
            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant={showPreview ? 'default' : 'outline'}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
          </div>

          <div className="border-border flex gap-2 border-l pl-4">
            <Button onClick={handleSave} variant="outline" disabled={!editorContent}>
              Save Content
            </Button>
            <Button onClick={handleClear} variant="outline" disabled={!editorContent}>
              Clear All
            </Button>
          </div>

          {selectedComponentId && isEditMode && (
            <div className="bg-primary/10 border-primary rounded border px-3 py-1 text-sm">
              Selected: {selectedComponentId}
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor Panel */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Visual Editor</h2>
          <VisualEditor
            placeholder="Start building your page... Use the toolbar to add components and containers!"
            onChange={handleContentChange}
            className="min-h-[600px]"
          />
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Content Preview</h2>
            <div className="bg-muted/50 border-border min-h-[600px] rounded-lg border p-4">
              {editorContent ? (
                <pre className="overflow-auto whitespace-pre-wrap text-sm">
                  {JSON.stringify(JSON.parse(editorContent), null, 2)}
                </pre>
              ) : (
                <div className="text-muted-foreground py-20 text-center">
                  Start editing to see content preview
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Features Info */}
      <div className="border-border border-t pt-6">
        <h3 className="mb-4 text-lg font-semibold">Features Demonstrated</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <h4 className="text-primary font-medium">Rich Text Editing</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Bold, italic, underline, strikethrough</li>
              <li>• Headings (H1-H3)</li>
              <li>• Lists (ordered & unordered)</li>
              <li>• Code blocks and inline code</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-primary font-medium">Components</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Buttons with variants</li>
              <li>• Images with optimization</li>
              <li>• Cards and hero sections</li>
              <li>• Spacers and text blocks</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-primary font-medium">Layout Containers</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Row and column layouts</li>
              <li>• Grid containers (2+ columns)</li>
              <li>• Section containers</li>
              <li>• Card containers</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-primary font-medium">Edit Mode Features</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Visual component selection</li>
              <li>• Edit/delete component controls</li>
              <li>• History tracking (undo/redo)</li>
              <li>• Auto-save functionality</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-primary font-medium">Developer Tools</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• JSON content export</li>
              <li>• Real-time preview</li>
              <li>• TypeScript integration</li>
              <li>• Store state management</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-primary font-medium">Upcoming Features</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Drag & drop components</li>
              <li>• Component property editing</li>
              <li>• Template system</li>
              <li>• Advanced layouts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
