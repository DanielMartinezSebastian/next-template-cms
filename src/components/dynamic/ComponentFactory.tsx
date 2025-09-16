/**
 * Component Factory
 * Maps component types to React components for dynamic rendering
 */

import { ComponentFactoryMapping } from '@/types/pages';
import React from 'react';

// Import available components
import ButtonComponent from './components/Button';
import { CallToAction } from './components/CallToAction';
import Card from './components/Card';
import { ContactForm } from './components/ContactForm';
import { FeatureGrid } from './components/FeatureGrid';
import { HeroSection } from './components/HeroSection';
import Image from './components/Image';
import { ImageGallery } from './components/ImageGallery';
import Section from './components/Section';
import Spacer from './components/Spacer';
import { Newsletter, Testimonials } from './components/Testimonials';
import { TextBlock } from './components/TextBlock';

// Demo/Fallback components
import { PlaceholderComponent } from './components/PlaceholderComponent';
import { UnknownComponent } from './components/UnknownComponent';

/**
 * Component Factory Class
 * Manages the mapping between component types and React components
 */
export class ComponentFactory {
  private static componentMap: ComponentFactoryMapping = {
    // Layout Components
    hero: HeroSection,
    'hero-section': HeroSection,
    section: Section,

    // Content Components
    text: TextBlock,
    'text-block': TextBlock,
    content: TextBlock,

    // Media Components
    image: Image, // Single image component
    'image-gallery': ImageGallery,
    gallery: ImageGallery,

    // UI Components
    button: ButtonComponent,
    card: Card,
    spacer: Spacer,

    // Interactive Components
    form: ContactForm,
    'contact-form': ContactForm,
    contact: ContactForm,

    // Marketing Components
    features: FeatureGrid,
    'feature-grid': FeatureGrid,
    'feature-list': FeatureGrid,

    cta: CallToAction,
    'call-to-action': CallToAction,

    testimonials: Testimonials,
    reviews: Testimonials,

    newsletter: Newsletter,
    'newsletter-signup': Newsletter,

    // Fallback components
    placeholder: PlaceholderComponent,
    unknown: UnknownComponent,
  };

  /**
   * Get a component by type
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getComponent(type: string): React.ComponentType<any> | null {
    const normalizedType = type.toLowerCase().trim();
    return this.componentMap[normalizedType] || null;
  }

  /**
   * Register a new component type
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static registerComponent(type: string, component: React.ComponentType<any>): void {
    const normalizedType = type.toLowerCase().trim();
    this.componentMap[normalizedType] = component;
  }

  /**
   * Unregister a component type
   */
  static unregisterComponent(type: string): void {
    const normalizedType = type.toLowerCase().trim();
    delete this.componentMap[normalizedType];
  }

  /**
   * Get all available component types
   */
  static getAvailableTypes(): string[] {
    return Object.keys(this.componentMap);
  }

  /**
   * Check if a component type is registered
   */
  static hasComponent(type: string): boolean {
    const normalizedType = type.toLowerCase().trim();
    return normalizedType in this.componentMap;
  }

  /**
   * Get component mapping for admin/editor use
   */
  static getComponentMapping(): ComponentFactoryMapping {
    return { ...this.componentMap };
  }

  /**
   * Get component info for admin/editor interfaces
   */
  static getComponentInfo() {
    return {
      layout: [
        { type: 'hero', name: 'Hero Section', category: 'layout' },
        { type: 'hero-section', name: 'Hero Section', category: 'layout' },
        { type: 'section', name: 'Section', category: 'layout' },
      ],
      content: [
        { type: 'text', name: 'Text Block', category: 'content' },
        { type: 'text-block', name: 'Text Block', category: 'content' },
      ],
      media: [
        { type: 'image', name: 'Image', category: 'media' },
        { type: 'image-gallery', name: 'Image Gallery', category: 'media' },
      ],
      ui: [
        { type: 'button', name: 'Button', category: 'ui' },
        { type: 'card', name: 'Card', category: 'ui' },
        { type: 'spacer', name: 'Spacer', category: 'ui' },
      ],
      interactive: [
        { type: 'form', name: 'Contact Form', category: 'interactive' },
        { type: 'contact-form', name: 'Contact Form', category: 'interactive' },
      ],
      marketing: [
        { type: 'features', name: 'Feature Grid', category: 'marketing' },
        { type: 'cta', name: 'Call to Action', category: 'marketing' },
        { type: 'testimonials', name: 'Testimonials', category: 'marketing' },
        { type: 'newsletter', name: 'Newsletter Signup', category: 'marketing' },
      ],
    };
  }

  /**
   * Validate component props against expected schema
   */
  static validateProps(
    type: string,
    props: Record<string, unknown>
  ): {
    isValid: boolean;
    errors: string[];
    sanitizedProps: Record<string, unknown>;
  } {
    // Basic validation - can be extended with Zod schemas
    const normalizedType = type.toLowerCase().trim();

    if (!this.hasComponent(normalizedType)) {
      return {
        isValid: false,
        errors: [`Unknown component type: ${type}`],
        sanitizedProps: {},
      };
    }

    // TODO: Implement per-component validation schemas
    // For now, just sanitize basic props
    const sanitizedProps = { ...props };

    // Remove potentially dangerous props
    delete sanitizedProps.dangerouslySetInnerHTML;
    delete sanitizedProps.ref;
    delete sanitizedProps.key;

    return {
      isValid: true,
      errors: [],
      sanitizedProps,
    };
  }
}
