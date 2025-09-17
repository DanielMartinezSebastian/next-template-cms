/**
 * Enhanced Page Editor Toolbar
 * Provides comprehensive controls for page editing
 */
'use client';

import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface EditorToolbarProps {
  pageTitle: string;
  pageSlug: string;
  isPublished: boolean;
  locale: string;
  breadcrumbPath: Array<{
    id: string;
    title: string;
    href?: string;
  }>;
  onSave: () => void;
  onPublishToggle: () => void;
  onPreview: () => void;
  onMetadataEdit: () => void;
  isSaving?: boolean;
  lastSaved?: Date;
}

export function EditorToolbar({
  pageTitle,
  pageSlug,
  isPublished,
  locale,
  breadcrumbPath,
  onSave,
  onPublishToggle,
  onPreview,
  onMetadataEdit,
  isSaving = false,
  lastSaved,
}: EditorToolbarProps) {
  const t = useTranslations('Admin');

  const breadcrumbItems = [
    { title: t('navigation.pages'), href: '/admin/pages' },
    ...breadcrumbPath,
    { title: pageTitle, isActive: true },
  ];

  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
      {/* Main Toolbar */}
      <div className="flex items-center justify-between p-4">
        {/* Left: Navigation and Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {/* Back Button */}
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/editor">←</Link>
            </Button>

            {/* Page Status Indicator */}
            <div className="flex items-center space-x-2">
              <div
                className={`h-2 w-2 rounded-full ${isPublished ? 'bg-green-500' : 'bg-yellow-500'}`}
                title={isPublished ? t('editor.published') : t('editor.draft')}
              />
              <span className="text-sm font-medium">{pageTitle}</span>
              <span className="text-muted-foreground text-xs">({locale.toUpperCase()})</span>
            </div>
          </div>

          {/* Last Saved Indicator */}
          {lastSaved && (
            <div className="text-muted-foreground text-xs">
              {t('editor.lastSaved')}: {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* SEO/Metadata Button */}
          <Button variant="outline" size="sm" onClick={onMetadataEdit} className="hidden sm:flex">
            🏷️ {t('editor.metadata')}
          </Button>

          {/* Preview Button */}
          <Button variant="outline" size="sm" onClick={onPreview}>
            👁️ {t('editor.preview')}
          </Button>

          {/* Publish/Unpublish Button */}
          <Button
            variant={isPublished ? 'outline' : 'default'}
            size="sm"
            onClick={onPublishToggle}
            className={isPublished ? 'border-green-300' : ''}
          >
            {isPublished ? <>📤 {t('editor.unpublish')}</> : <>📢 {t('editor.publish')}</>}
          </Button>

          {/* Save Button */}
          <Button
            variant="default"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? <>⏳ {t('editor.saving')}</> : <>💾 {t('editor.save')}</>}
          </Button>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-muted/30 border-t px-4 py-2">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-muted/50 border-t px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Page URL Preview */}
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">{t('editor.url')}:</span>
              <code className="bg-muted rounded px-2 py-1 text-xs">/{pageSlug}</code>
            </div>

            {/* Component Count */}
            <div className="text-muted-foreground text-sm">
              {t('editor.components')}: <span className="font-medium">0</span>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" title={t('editor.editMode')}>
              ✏️
            </Button>
            <Button variant="ghost" size="sm" title={t('editor.previewMode')}>
              👁️
            </Button>
            <Button variant="ghost" size="sm" title={t('editor.codeMode')}>
              💻
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
