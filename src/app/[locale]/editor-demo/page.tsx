/**
 * Simple Editor Demo Page
 * Demonstrates the new simple editor without Lexical
 */
'use client';

import { SimplePageManager } from '@/components/admin/SimplePageManager';

export default function EditorDemoPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-foreground mb-4 text-3xl font-bold">Simple Editor Demo</h1>
        <p className="text-muted-foreground">
          New page editor without Lexical - simplified component-based editing
        </p>
      </div>

      {/* Simple Page Manager */}
      <SimplePageManager className="h-[80vh]" />
    </div>
  );
}
