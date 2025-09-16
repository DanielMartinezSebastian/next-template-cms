/**
 * Simple Editor Demo Component (Updated)
 * Interactive demonstration of the new simple editor without Lexical
 */
'use client';

import { SimplePageManager } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { useEditModeActions, useEditModeEnabled } from '@/stores';
import { useState } from 'react';

export default function VisualEditorDemo() {
  const [showDemo, setShowDemo] = useState(false);

  // Edit mode state
  const { toggleEditMode } = useEditModeActions();
  const isEditMode = useEditModeEnabled();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-foreground mb-2 text-2xl font-bold">Simple Editor Demo</h2>
        <p className="text-muted-foreground">
          Test the new component-based page editor (without Lexical)
        </p>
      </div>

      {/* Controls */}
      <div className="bg-card border-border rounded-lg border p-4">
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={() => setShowDemo(!showDemo)} variant={showDemo ? 'default' : 'outline'}>
            {showDemo ? 'Hide' : 'Show'} Editor Demo
          </Button>

          <Button onClick={toggleEditMode} variant={isEditMode ? 'default' : 'outline'}>
            Edit Mode: {isEditMode ? 'ON' : 'OFF'}
          </Button>
        </div>
      </div>

      {/* Demo Content */}
      {showDemo && (
        <div className="bg-card border-border rounded-lg border">
          <div className="border-border border-b p-4">
            <h3 className="text-card-foreground text-lg font-semibold">Simple Page Manager Demo</h3>
            <p className="text-muted-foreground text-sm">
              Create and edit pages using the new component-based system
            </p>
          </div>

          <div className="p-4">
            <SimplePageManager className="h-[600px]" />
          </div>
        </div>
      )}

      {/* Status */}
      <div className="bg-muted rounded-lg p-4">
        <h4 className="text-muted-foreground mb-2 text-sm font-medium">Demo Status</h4>
        <div className="text-muted-foreground space-y-1 text-xs">
          <div>Editor System: Simple Component Editor (No Lexical)</div>
          <div>Edit Mode: {isEditMode ? 'Active' : 'Inactive'}</div>
          <div>Demo Visible: {showDemo ? 'Yes' : 'No'}</div>
          <div>Framework: React Hook Form + Zod + lucide-react</div>
        </div>
      </div>
    </div>
  );
}
