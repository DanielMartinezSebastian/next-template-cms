/**
 * Breadcrumb Navigation Component
 * Shows hierarchical navigation path for pages
 */
'use client';

import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  id?: string;
  title: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <div className="flex items-center space-x-2">
        {items.map((item, index) => (
          <div key={item.id || index} className="flex items-center space-x-2">
            {index > 0 && <span className="text-muted-foreground select-none">/</span>}

            {item.href && !item.isActive ? (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:text-primary h-auto p-1 text-sm font-medium"
              >
                <a href={item.href}>{item.title}</a>
              </Button>
            ) : (
              <span
                className={`px-1 ${
                  item.isActive
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground cursor-default'
                }`}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {item.title}
              </span>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
