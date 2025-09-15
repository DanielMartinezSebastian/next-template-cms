/**
 * Page Tree View Component
 * Muestra la jerarquía de páginas en formato de árbol con drag & drop
 */
'use client';

import { Button } from '@/components/ui/button';
import { usePageStore } from '@/stores';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

interface TreeNode {
  id: string;
  title: string;
  slug: string;
  fullPath: string;
  isPublished: boolean;
  locale: string;
  children: TreeNode[];
  level: number;
  routeType: 'static' | 'dynamic' | 'hybrid';
}

interface PageTreeViewProps {
  selectedPages: Set<string>;
  onSelectPage: (pageId: string, checked: boolean) => void;
}

export function PageTreeView({ selectedPages, onSelectPage }: PageTreeViewProps) {
  const t = useTranslations('Admin');
  const { pages, updatePage } = usePageStore();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  // Build tree structure from flat pages array
  const treeData = useMemo(() => {
    const pageMap = new Map<string, TreeNode>();
    const rootNodes: TreeNode[] = [];

    // First pass: create all nodes
    pages.forEach(page => {
      pageMap.set(page.id, {
        id: page.id,
        title: page.title,
        slug: page.slug,
        fullPath: page.fullPath || `/${page.slug}`,
        isPublished: page.isPublished,
        locale: page.locale,
        children: [],
        level: page.level || 0,
        routeType: (page.routeType as 'static' | 'dynamic' | 'hybrid') || 'dynamic',
      });
    });

    // Second pass: build hierarchy
    pages.forEach(page => {
      const node = pageMap.get(page.id);
      if (!node) return;

      if (page.parentId) {
        const parent = pageMap.get(page.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          rootNodes.push(node);
        }
      } else {
        rootNodes.push(node);
      }
    });

    // Sort children by order
    const sortChildren = (node: TreeNode) => {
      node.children.sort((a, b) => a.title.localeCompare(b.title));
      node.children.forEach(sortChildren);
    };
    rootNodes.forEach(sortChildren);

    return rootNodes;
  }, [pages]);

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleDragStart = (nodeId: string) => {
    setDraggedNode(nodeId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetNodeId: string) => {
    if (!draggedNode || draggedNode === targetNodeId) return;

    // TODO: Implement reordering logic with parent relationship updates
    // This would update the parentId of the dragged node to the target
    setDraggedNode(null);
  };

  const getRouteTypeIcon = (routeType: string) => {
    switch (routeType) {
      case 'static':
        return '🔧'; // Static Next.js route
      case 'hybrid':
        return '🔀'; // Hybrid route
      case 'dynamic':
      default:
        return '📄'; // Dynamic CMS page
    }
  };

  const getRouteTypeColor = (routeType: string) => {
    switch (routeType) {
      case 'static':
        return 'text-blue-600 dark:text-blue-400';
      case 'hybrid':
        return 'text-purple-600 dark:text-purple-400';
      case 'dynamic':
      default:
        return 'text-green-600 dark:text-green-400';
    }
  };

  const renderTreeNode = (node: TreeNode, depth = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children.length > 0;
    const isSelected = selectedPages.has(node.id);

    return (
      <div key={node.id} className="select-none">
        {/* Node Row */}
        <div
          className={`hover:bg-accent/50 flex items-center gap-2 rounded-md p-2 ${
            isSelected ? 'bg-accent' : ''
          }`}
          style={{ paddingLeft: `${depth * 24 + 8}px` }}
          draggable
          onDragStart={() => handleDragStart(node.id)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(node.id)}
        >
          {/* Expand/Collapse Button */}
          <button
            onClick={() => toggleExpanded(node.id)}
            className="hover:bg-accent flex h-4 w-4 items-center justify-center rounded text-xs"
            disabled={!hasChildren}
          >
            {hasChildren ? (isExpanded ? '▼' : '▶') : '•'}
          </button>

          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={e => onSelectPage(node.id, e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />

          {/* Route Type Icon */}
          <span className={`text-sm ${getRouteTypeColor(node.routeType)}`} title={node.routeType}>
            {getRouteTypeIcon(node.routeType)}
          </span>

          {/* Page Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium">{node.title}</span>
              <span className="bg-muted rounded px-1 py-0.5 text-xs">
                {node.locale.toUpperCase()}
              </span>
              <span
                className={`rounded px-1 py-0.5 text-xs ${
                  node.isPublished
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}
              >
                {node.isPublished ? t('editor.published') : t('editor.draft')}
              </span>
            </div>
            <div className="text-muted-foreground truncate text-xs">{node.fullPath}</div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" asChild>
              <a href={`/admin/editor/${node.locale}/${node.id}`} className="text-xs">
                ✏️
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updatePage(node.id, { isPublished: !node.isPublished })}
              className="text-xs"
            >
              {node.isPublished ? '👁️' : '👀'}
            </Button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="ml-2">{node.children.map(child => renderTreeNode(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  if (treeData.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-foreground mb-2 text-lg font-medium">{t('editor.noPages')}</h3>
        <p className="text-muted-foreground mb-4">{t('editor.createFirstPage')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tree Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const allNodeIds = new Set<string>();
              const collectIds = (nodes: TreeNode[]) => {
                nodes.forEach(node => {
                  allNodeIds.add(node.id);
                  collectIds(node.children);
                });
              };
              collectIds(treeData);
              setExpandedNodes(allNodeIds);
            }}
          >
            {t('editor.expandAll')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setExpandedNodes(new Set())}>
            {t('editor.collapseAll')}
          </Button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-blue-600 dark:text-blue-400">🔧</span>
            <span>{t('editor.staticRoute')}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-purple-600 dark:text-purple-400">🔀</span>
            <span>{t('editor.hybridRoute')}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-600 dark:text-green-400">📄</span>
            <span>{t('editor.dynamicRoute')}</span>
          </div>
        </div>
      </div>

      {/* Tree Structure */}
      <div className="bg-card rounded-lg border p-4">
        {treeData.map(node => renderTreeNode(node))}
      </div>
    </div>
  );
}
