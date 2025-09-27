/**
 * Page Preview Component (Legacy - Deprecated)
 * @deprecated Use SimplePagePreview for new editor system
 */
'use client';

import { Button } from '../ui/button';

interface PagePreviewProps {
  page?: {
    title?: string;
    slug?: string;
    isActive?: boolean;
  };
  locale?: string;
}

export function PagePreview({ page, locale = 'en' }: PagePreviewProps) {
  return (
    <div className="bg-card border-border flex h-full flex-col rounded-lg border">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <div className="text-muted-foreground text-sm font-medium">
            Preview - {locale.toUpperCase()}
          </div>
          {page?.slug && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={`/${locale}/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`Open /${page.slug} in new tab`}
              >
                /{page.slug}
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-background rounded-lg p-6">
          <div className="text-muted-foreground text-center">
            <h3 className="mb-2 text-lg font-medium">Page Preview</h3>
            <p className="mb-4">
              Use the new SimplePagePreview component for enhanced preview functionality.
            </p>
            {page && (
              <div className="text-left">
                <p>
                  <strong>Title:</strong> {page.title || 'Untitled'}
                </p>
                <p>
                  <strong>Slug:</strong> {page.slug || 'new-page'}
                </p>
                <p>
                  <strong>Status:</strong> {page.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PagePreview;
