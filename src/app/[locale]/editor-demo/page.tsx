/**
 * Visual Editor Demo Page
 * Demonstrates the Lexical visual editor with all components
 */
'use client';

import { VisualEditor } from '../../../components/editor';

export default function EditorDemoPage() {
  const handleEditorChange = (content: string) => {
    // TODO: Save content to store or database
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('Editor content changed:', content);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Simple Header for Demo */}
      <header className="border-border bg-card/50 supports-[backdrop-filter]:bg-card/60 border-b backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-foreground text-xl font-semibold">
            Next.js Template - Visual Editor Demo
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-4 text-4xl font-bold">Visual Editor Demo</h1>
          <p className="text-muted-foreground mb-2 text-lg">
            Interactive Lexical editor with custom components
          </p>
          <p className="text-muted-foreground">
            Use the toolbar to format text and insert components. Click on components to edit them.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            <div className="bg-card border-border rounded-lg border p-6">
              <h2 className="text-card-foreground mb-4 text-2xl font-semibold">Editor</h2>
              <VisualEditor
                placeholder="Start creating your content..."
                onChange={handleEditorChange}
                className="shadow-sm"
              />
            </div>
          </div>

          {/* Component Palette */}
          <div className="lg:col-span-1">
            <div className="bg-card border-border rounded-lg border p-6">
              <h2 className="text-card-foreground mb-4 text-2xl font-semibold">Components</h2>
              <div className="space-y-3">
                <div className="bg-muted rounded-lg p-3">
                  <h3 className="text-muted-foreground mb-2 font-medium">Text Components</h3>
                  <div className="text-muted-foreground space-y-1 text-sm">
                    <div>• Headings (H1, H2, H3)</div>
                    <div>• Paragraphs</div>
                    <div>• Lists (Ordered/Unordered)</div>
                    <div>• Quotes</div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-3">
                  <h3 className="text-muted-foreground mb-2 font-medium">Interactive Components</h3>
                  <div className="text-muted-foreground space-y-1 text-sm">
                    <div>• Buttons</div>
                    <div>• Images</div>
                    <div>• Cards</div>
                    <div>• Hero Sections</div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-3">
                  <h3 className="text-muted-foreground mb-2 font-medium">Layout Components</h3>
                  <div className="text-muted-foreground space-y-1 text-sm">
                    <div>• Sections</div>
                    <div>• Spacers</div>
                    <div>• Text Blocks</div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 border-primary/20 mt-6 rounded-lg border p-4">
                <h3 className="text-primary mb-2 font-medium">💡 Pro Tips</h3>
                <div className="text-primary/80 space-y-1 text-sm">
                  <div>• Use markdown shortcuts like # for headings</div>
                  <div>• Drag components from toolbar to insert</div>
                  <div>• Click components to edit properties</div>
                  <div>• Use Ctrl+Z/Y for undo/redo</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card border-border rounded-lg border p-6">
            <h3 className="text-card-foreground mb-3 text-xl font-semibold">
              🎨 Rich Text Editing
            </h3>
            <p className="text-muted-foreground mb-4">
              Full WYSIWYG editing with bold, italic, underline, strikethrough, and more.
            </p>
            <div className="text-muted-foreground text-sm">
              ✓ Keyboard shortcuts
              <br />
              ✓ Markdown support
              <br />✓ Copy/paste rich content
            </div>
          </div>

          <div className="bg-card border-border rounded-lg border p-6">
            <h3 className="text-card-foreground mb-3 text-xl font-semibold">
              🧩 Custom Components
            </h3>
            <p className="text-muted-foreground mb-4">
              Insert and edit custom components like buttons, cards, and hero sections.
            </p>
            <div className="text-muted-foreground text-sm">
              ✓ Visual component editing
              <br />
              ✓ Live preview
              <br />✓ Property panels
            </div>
          </div>

          <div className="bg-card border-border rounded-lg border p-6">
            <h3 className="text-card-foreground mb-3 text-xl font-semibold">
              💾 Auto-save & History
            </h3>
            <p className="text-muted-foreground mb-4">
              Automatic content saving with full undo/redo history support.
            </p>
            <div className="text-muted-foreground text-sm">
              ✓ Real-time saving
              <br />
              ✓ Version history
              <br />✓ Collaboration ready
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
