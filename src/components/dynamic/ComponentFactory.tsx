/**
 * Component Factory - NEW SYSTEM ONL    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[ComponentFactory] Looking for component: "${originalType}" (normalized: "${normalizedType}")`
      );
    }* Uses the new registry system with auto-detection
 * NO LEGACY COMPONENTS - All use withEditableSSR
 */

import { detectEditMode } from '@/lib/component-registry/client-wrapper';
import { componentRegistry } from '@/lib/component-registry/registry';
import React, { createElement } from 'react';

// CRITICAL: Import initialize to ensure components are registered on client-side
import '@/lib/component-registry/initialize';

// Component not found placeholder
const UnknownComponent = ({ type, ...props }: { type: string; [key: string]: unknown }) => (
  <div className="rounded border border-red-300 bg-red-50 p-4">
    <p className="font-medium text-red-800">Unknown component: {type}</p>
    <p className="text-sm text-red-600">This component may have been removed or renamed.</p>
    {process.env.NODE_ENV === 'development' && (
      <details className="mt-2">
        <summary className="cursor-pointer text-xs text-red-600">Debug Info</summary>
        <pre className="mt-1 overflow-auto text-xs text-red-500">
          Type: {type}
          {'\n'}Props: {JSON.stringify(props, null, 2)}
        </pre>
      </details>
    )}
  </div>
);

/**
 * Component Factory Class - NEW REGISTRY SYSTEM ONLY
 */
export class ComponentFactory {
  /**
   * Get a component by type using new registry system
   */
  static getComponent(type: string): React.ComponentType<Record<string, unknown>> | null {
    const originalType = type.trim();
    const normalizedType = type.toLowerCase().trim();

    console.log(
      `[ComponentFactory] Looking for component: "${originalType}" (normalized: "${normalizedType}")`
    );

    // First try the exact type name (new registry system uses exact names)
    let registeredComponent = componentRegistry.get(originalType);
    if (registeredComponent) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[ComponentFactory] Found exact match: ${originalType}`);
      }
      return registeredComponent.component;
    }

    // Try normalized lowercase
    registeredComponent = componentRegistry.get(normalizedType);
    if (registeredComponent) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[ComponentFactory] Found normalized match: ${normalizedType}`);
      }
      return registeredComponent.component;
    }

    // All components now use the NEW SYSTEM

    // Common type aliases
    const typeAliases: Record<string, string> = {
      hero: 'HeroSectionComponent',
      'hero-section': 'HeroSectionComponent',
      herosection: 'HeroSectionComponent',
      herosectioncomponent: 'HeroSectionComponent',
      text: 'TextBlockComponent',
      'text-block': 'TextBlockComponent',
      textblock: 'TextBlockComponent',
      textblockcomponent: 'TextBlockComponent',
      content: 'TextBlockComponent',
      cta: 'CallToActionComponent',
      'call-to-action': 'CallToActionComponent',
      calltoaction: 'CallToActionComponent',
      calltoactioncomponent: 'CallToActionComponent',
      card: 'CardComponent',
      cardcomponent: 'CardComponent',
      button: 'ButtonComponent',
      buttoncomponent: 'ButtonComponent',
      editablebutton: 'EditableButtonComponent',
      editablebuttoncomponent: 'EditableButtonComponent',
    };

    // Try aliases
    const aliasedType = typeAliases[normalizedType];
    if (aliasedType) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[ComponentFactory] Trying alias: ${normalizedType} -> ${aliasedType}`);
      }
      const aliasedComponent = componentRegistry.get(aliasedType);
      if (aliasedComponent) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[ComponentFactory] Found alias match: ${aliasedType}`);
        }
        return aliasedComponent.component;
      }
    }

    console.warn(`[ComponentFactory] Component not found: "${originalType}"`);
    console.warn('[ComponentFactory] Available components:', componentRegistry.getNames());
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

    // All components use NEW SYSTEM, include editMode
    return createElement(Component, { ...props, editMode });
  }

  /**
   * Get all available component types from registry
   */
  static getAvailableTypes(): string[] {
    return componentRegistry.getComponents().map(c => c.metadata.name);
  }

  /**
   * Check if a component type is available
   */
  static hasComponent(type: string): boolean {
    return componentRegistry.has(type) || componentRegistry.has(type.toLowerCase().trim());
  }

  /**
   * Get component info for admin interfaces
   */
  static getComponentInfo() {
    const registryComponents = componentRegistry.getComponents();

    // Group by category
    const grouped: Record<
      string,
      Array<{
        type: string;
        name: string;
        category: string;
        icon?: string;
        version?: string;
        tags?: string[];
      }>
    > = {};

    registryComponents.forEach(comp => {
      const category = comp.metadata.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push({
        type: comp.metadata.name,
        name: comp.metadata.description || comp.metadata.name,
        category,
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
      systemType: 'NEW_SYSTEM_ONLY',
    };
  }

  /**
   * Initialize component system (trigger component imports for registration)
   */
  static initialize() {
    // Import components to trigger auto-registration
    // This is already done at the top of the file

    if (process.env.NODE_ENV === 'development') {
      console.warn('[ComponentFactory] Initialized with registry system');
      console.warn('[ComponentFactory] Available components:', this.getAvailableTypes());
    }
  }
}
