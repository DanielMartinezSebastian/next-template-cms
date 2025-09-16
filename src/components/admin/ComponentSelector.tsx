/**
 * Component Selector
 * Shows available components organized by category with schemas
 */

import { Button } from '@/components/ui/button';
import {
  getAllComponentSchemas,
  getSchemasByCategory,
  type ComponentSchema,
} from '@/lib/component-schemas';
import { useState } from 'react';

interface ComponentSelectorProps {
  onSelectComponent: (type: string, defaults: Record<string, unknown>) => void;
  selectedCategory?: string;
  className?: string;
}

interface ComponentCardProps {
  schema: ComponentSchema;
  onSelect: (type: string, defaults: Record<string, unknown>) => void;
}

function ComponentCard({ schema, onSelect }: ComponentCardProps) {
  const handleSelect = () => {
    onSelect(schema.type, schema.defaults);
  };

  return (
    <div
      className="border-border bg-card hover:bg-accent group cursor-pointer space-y-3 rounded-lg border p-4 transition-all duration-200 hover:shadow-md"
      onClick={handleSelect}
    >
      {/* Component Icon and Name */}
      <div className="flex items-center space-x-3">
        <div className="text-2xl transition-transform duration-200 group-hover:scale-110">
          {schema.icon}
        </div>
        <div>
          <h3 className="text-foreground group-hover:text-accent-foreground font-medium">
            {schema.name}
          </h3>
          <p className="text-muted-foreground text-xs">{schema.category}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground line-clamp-2 text-sm">{schema.description}</p>

      {/* Properties Preview */}
      <div className="space-y-1">
        <p className="text-muted-foreground text-xs font-medium">Properties:</p>
        <div className="flex flex-wrap gap-1">
          {Object.keys(schema.properties)
            .slice(0, 4)
            .map(prop => (
              <span key={prop} className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs">
                {prop}
              </span>
            ))}
          {Object.keys(schema.properties).length > 4 && (
            <span className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs">
              +{Object.keys(schema.properties).length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Add Button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        onClick={e => {
          e.stopPropagation();
          handleSelect();
        }}
      >
        Add Component
      </Button>
    </div>
  );
}

export function ComponentSelector({
  onSelectComponent,
  selectedCategory,
  className = '',
}: ComponentSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategory || 'all');
  const [searchTerm, setSearchTerm] = useState('');

  const allSchemas = getAllComponentSchemas();
  const schemasByCategory = getSchemasByCategory();
  const categories = ['all', ...Object.keys(schemasByCategory)];

  // Filter schemas based on active category and search term
  const filteredSchemas = allSchemas.filter(schema => {
    const matchesCategory = activeCategory === 'all' || schema.category === activeCategory;
    const matchesSearch =
      searchTerm === '' ||
      schema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schema.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schema.type.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      all: '🔧',
      layout: '📐',
      content: '📝',
      media: '🖼️',
      interactive: '⚡',
      marketing: '📢',
      ui: '🎨',
    };
    return icons[category] || '📦';
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-foreground text-xl font-semibold">Add Component</h2>
          <p className="text-muted-foreground text-sm">
            Choose from {allSchemas.length} available components
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border py-2 pl-4 pr-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
            <svg
              className="text-muted-foreground h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-border border-b">
        <div className="scrollbar-hide flex space-x-1 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex items-center space-x-2 whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:border-muted-foreground border-transparent'
              }`}
            >
              <span>{getCategoryIcon(category)}</span>
              <span>{getCategoryLabel(category)}</span>
              {category !== 'all' && (
                <span className="bg-muted rounded px-1.5 py-0.5 text-xs">
                  {schemasByCategory[category]?.length || 0}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {filteredSchemas.length} component{filteredSchemas.length !== 1 ? 's' : ''} found
          {searchTerm && ` for "${searchTerm}"`}
          {activeCategory !== 'all' && ` in ${activeCategory}`}
        </p>

        {(searchTerm || activeCategory !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setActiveCategory('all');
            }}
            className="text-xs"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Component Grid */}
      {filteredSchemas.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSchemas.map(schema => (
            <ComponentCard key={schema.type} schema={schema} onSelect={onSelectComponent} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="mb-4 text-4xl">🔍</div>
          <h3 className="text-foreground mb-2 text-lg font-medium">No components found</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            {searchTerm
              ? `No components match "${searchTerm}"`
              : `No components in ${activeCategory} category`}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setActiveCategory('all');
            }}
          >
            Show all components
          </Button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="border-border grid grid-cols-2 gap-4 border-t pt-6 md:grid-cols-4">
        {Object.entries(schemasByCategory).map(([category, schemas]) => (
          <div
            key={category}
            className="bg-muted/50 hover:bg-muted cursor-pointer rounded-lg p-3 text-center transition-colors"
            onClick={() => setActiveCategory(category)}
          >
            <div className="mb-1 text-2xl">{getCategoryIcon(category)}</div>
            <div className="text-foreground text-sm font-medium">{schemas.length}</div>
            <div className="text-muted-foreground text-xs">{getCategoryLabel(category)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComponentSelector;
