/**
 * Component Factory - SSR/Client Conditional System
 * Uses the new registry system with auto-detection
 */

import React, { createElement } from 'react';
import { componentRegistry } from '@/lib/component-registry/registry';
import { detectEditMode } from '@/lib/component-registry/client-wrapper';

// Import legacy editable components (for backward compatibility)
import {
  ButtonMigrated,
  EditableButton,
  CardMigrated,
  CallToActionMigrated,
  HeroSectionMigrated,
  TextBlockMigrated,
} from '../editable-components';

// Legacy placeholder for unknown components
const UnknownComponent = ({ type, ...props }: any) => (
  <div className="p-4 border border-red-300 bg-red-50 rounded">
    <p className="text-red-800 font-medium">Unknown component: {type}</p>
    <p className="text-red-600 text-sm">This component may have been removed or renamed.</p>
    {process.env.NODE_ENV === 'development' && (
      <details className="mt-2">
        <summary className="text-red-600 text-xs cursor-pointer">Debug Info</summary>
        <pre className="text-red-500 text-xs mt-1 overflow-auto">
          Type: {type}
          {'\n'}Props: {JSON.stringify(props, null, 2)}
        </pre>
      </details>
    )}
  </div>
);

const PlaceholderComponent = ({ message = 'Component not yet migrated to SSR system', type, ...props }: any) => (
  <div className="p-4 border border-amber-300 bg-amber-50 rounded">
    <p className="text-amber-800 font-medium">{message}</p>
    <p className="text-amber-600 text-sm">
      Component "{type}" needs to be migrated to the new withEditableSSR system.
    </p>
    {process.env.NODE_ENV === 'development' && (
      <details className="mt-2">
        <summary className="text-amber-600 text-xs cursor-pointer">Migration Guide</summary>
        <div className="text-amber-700 text-xs mt-1">
          <p>1. Create component in appropriate category folder</p>
          <p>2. Use withEditableSSR instead of withEditable</p>
          <p>3. Remove 'use client' directive</p>
          <p>4. Add to ComponentFactory mapping</p>
        </div>
      </details>
    )}
  </div>
);

/**
 * Component Factory Class - New Registry System
 * Automatically detects editMode and uses appropriate rendering
 */
export class ComponentFactory {
  // Legacy mapping for backward compatibility
  private static legacyComponentMap: Record<string, React.ComponentType<any>> = {
    // Migrated components (legacy names)
    'button-migrated': ButtonMigrated,
    'editable-button': EditableButton,
    'card-migrated': CardMigrated,
    'call-to-action-migrated': CallToActionMigrated,
    'hero-section-migrated': HeroSectionMigrated,
    'text-block-migrated': TextBlockMigrated,

    // Legacy placeholders
    section: PlaceholderComponent,
    spacer: PlaceholderComponent,
    form: PlaceholderComponent,
    'contact-form': PlaceholderComponent,
    contactform: PlaceholderComponent,
    features: PlaceholderComponent,
    'feature-grid': PlaceholderComponent,
    featuregrid: PlaceholderComponent,
    testimonials: PlaceholderComponent,
    testimonial: PlaceholderComponent,
    pricing: PlaceholderComponent,
    newsletter: PlaceholderComponent,
    image: PlaceholderComponent,
    'image-gallery': PlaceholderComponent,
    imagegallery: PlaceholderComponent,
    gallery: PlaceholderComponent,
  };

  /**
   * Get a component by type using new registry system
   */
  static getComponent(type: string): React.ComponentType<any> | null {
    const normalizedType = type.toLowerCase().trim();
    
    // First try the new registry system
    const registeredComponent = componentRegistry.get(normalizedType);
    if (registeredComponent) {
      return registeredComponent.component;
    }

    // Then try legacy mapping for backward compatibility
    if (this.legacyComponentMap[normalizedType]) {
      return this.legacyComponentMap[normalizedType];
    }

    // Common type aliases
    const typeAliases: Record<string, string> = {
      'hero': 'HeroSection',
      'hero-section': 'HeroSection',
      'herosection': 'HeroSection',
      'text': 'TextBlock',
      'text-block': 'TextBlock',
      'textblock': 'TextBlock',
      'content': 'TextBlock',
      'cta': 'CallToAction',
      'call-to-action': 'CallToAction',
      'calltoaction': 'CallToAction',
    };

    // Try aliases
    const aliasedType = typeAliases[normalizedType];
    if (aliasedType) {
      const aliasedComponent = componentRegistry.get(aliasedType);
      if (aliasedComponent) {
        return aliasedComponent.component;
      }
    }

    return null;
  }

  /**
   * Create component with automatic editMode detection
   */
  static createComponent(type: string, props: Record<string, unknown> = {}): React.ReactNode {
    const Component = this.getComponent(type);

    if (!Component) {
      console.warn(`[ComponentFactory] Unknown component type: ${type}`);
      return createElement(UnknownComponent, { type, ...props });
    }

    // Auto-detect edit mode
    const editMode = detectEditMode();
    
    // For legacy components, pass the props as-is
    if (this.legacyComponentMap[type.toLowerCase().trim()]) {
      return createElement(Component, { type, ...props });
    }

    // For new SSR components, include editMode
    return createElement(Component, { ...props, editMode });
  }

  /**
   * Get all available component types from registry + legacy
   */
  static getAvailableTypes(): string[] {
    const registryTypes = componentRegistry.getComponents().map(c => c.metadata.name);
    const legacyTypes = Object.keys(this.legacyComponentMap);
    return [...new Set([...registryTypes, ...legacyTypes])];
  }

  /**
   * Check if a component type is available
   */
  static hasComponent(type: string): boolean {
    const normalizedType = type.toLowerCase().trim();
    return componentRegistry.has(normalizedType) || 
           normalizedType in this.legacyComponentMap;
  }

  /**
   * Get component info for admin interfaces
   */
  static getComponentInfo() {
    const registryComponents = componentRegistry.getComponents();
    
    // Group by category
    const grouped: Record<string, any[]> = {};
    
    registryComponents.forEach(comp => {
      const category = comp.metadata.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push({
        type: comp.metadata.name,
        name: comp.metadata.description || comp.metadata.name,
        category: category,
        icon: comp.metadata.icon,
        version: comp.metadata.version,
        tags: comp.metadata.tags,
      });
    });

    return grouped;
  }

  /**
   * Get registry statistics
   */
  static getRegistryStats() {
    const components = componentRegistry.getComponents();
    return {
      total: components.length,
      categories: Array.from(new Set(components.map(c => c.metadata.category))),
      lastUpdate: new Date().toISOString(),
      legacyComponents: Object.keys(this.legacyComponentMap).length,
    };
  }

  /**
   * Initialize component system (trigger component imports for registration)
   */
  static initialize() {
    // Import components to trigger auto-registration
    // This is already done at the top of the file
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[ComponentFactory] Initialized with registry system');
      console.log('[ComponentFactory] Available components:', this.getAvailableTypes());
    }
  }
}
