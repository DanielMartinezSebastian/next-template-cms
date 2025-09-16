/**
 * Dynamic Component Utilities
 * Helper functions for working with DynamicComponentNode in the editor
 */
'use client';

import type { ComponentProps, ComponentType } from '@/types/components';
import { $getSelection, $insertNodes, $isRangeSelection } from 'lexical';
import {
  $createDynamicComponentNode,
  INSERT_DYNAMIC_COMPONENT_COMMAND,
  type DynamicComponentPayload,
} from '../nodes/DynamicComponentNode';

/**
 * Utility to insert a dynamic component at the current selection
 */
export function $insertDynamicComponent(
  componentType: ComponentType,
  componentProps: ComponentProps = {},
  isEditable: boolean = true
): boolean {
  const selection = $getSelection();

  if ($isRangeSelection(selection)) {
    const dynamicComponentNode = $createDynamicComponentNode(
      componentType,
      componentProps,
      isEditable
    );
    $insertNodes([dynamicComponentNode]);
    return true;
  }

  return false;
}

/**
 * Create a DynamicComponentPayload for use with commands
 */
export function createDynamicComponentPayload(
  componentType: ComponentType,
  componentProps: ComponentProps = {},
  isEditable: boolean = true
): DynamicComponentPayload {
  return {
    componentType,
    componentProps,
    isEditable,
  };
}

/**
 * Common component configurations for quick insertion
 */
export const COMMON_COMPONENT_CONFIGS = {
  // Text Components
  textBlock: {
    componentType: 'text-block' as ComponentType,
    componentProps: {
      content: 'Enter your text here...',
      variant: 'paragraph',
      size: 'medium',
    } as ComponentProps,
  },

  // Hero Section
  heroSection: {
    componentType: 'hero' as ComponentType,
    componentProps: {
      title: 'Welcome to Our Site',
      subtitle: 'Discover something amazing',
      description: 'This is a compelling description that draws users in.',
      ctaText: 'Get Started',
      ctaType: 'primary',
      alignment: 'center',
    } as ComponentProps,
  },

  // Feature Grid
  featureGrid: {
    componentType: 'features' as ComponentType,
    componentProps: {
      title: 'Our Features',
      features: [
        {
          title: 'Feature 1',
          description: 'Description of the first feature.',
          icon: '⭐',
        },
        {
          title: 'Feature 2',
          description: 'Description of the second feature.',
          icon: '🚀',
        },
        {
          title: 'Feature 3',
          description: 'Description of the third feature.',
          icon: '💎',
        },
      ],
      columns: 3,
      layout: 'grid',
    } as ComponentProps,
  },

  // Call to Action
  callToAction: {
    componentType: 'cta' as ComponentType,
    componentProps: {
      title: 'Ready to Get Started?',
      description: 'Join thousands of satisfied customers today.',
      buttonText: 'Sign Up Now',
      buttonVariant: 'primary',
      backgroundColor: '#f8fafc',
    } as ComponentProps,
  },

  // Image Gallery
  imageGallery: {
    componentType: 'image-gallery' as ComponentType,
    componentProps: {
      images: [
        { src: '/placeholder-image-1.jpg', alt: 'Sample Image 1' },
        { src: '/placeholder-image-2.jpg', alt: 'Sample Image 2' },
        { src: '/placeholder-image-3.jpg', alt: 'Sample Image 3' },
      ],
      layout: 'grid',
      columns: 3,
    } as ComponentProps,
  },

  // Contact Form
  contactForm: {
    componentType: 'contact-form' as ComponentType,
    componentProps: {
      title: 'Get in Touch',
      description: 'We would love to hear from you.',
      fields: [
        { type: 'text', name: 'name', label: 'Name', required: true },
        { type: 'email', name: 'email', label: 'Email', required: true },
        { type: 'textarea', name: 'message', label: 'Message', required: true },
      ],
      submitText: 'Send Message',
    } as ComponentProps,
  },

  // Testimonials
  testimonials: {
    componentType: 'testimonials' as ComponentType,
    componentProps: {
      title: 'What Our Customers Say',
      testimonials: [
        {
          text: 'Amazing service and great results!',
          author: 'John Doe',
          role: 'CEO, Example Corp',
          avatar: '/placeholder-avatar-1.jpg',
        },
        {
          text: 'Highly recommended for anyone looking for quality.',
          author: 'Jane Smith',
          role: 'Marketing Director',
          avatar: '/placeholder-avatar-2.jpg',
        },
      ],
      layout: 'grid',
    } as ComponentProps,
  },

  // Newsletter
  newsletter: {
    componentType: 'newsletter' as ComponentType,
    componentProps: {
      title: 'Stay Updated',
      description: 'Subscribe to our newsletter for the latest updates.',
      placeholder: 'Enter your email address',
      buttonText: 'Subscribe',
      privacyText: 'We respect your privacy and never share your email.',
    } as ComponentProps,
  },
} as const;

/**
 * Get all available component types from ComponentFactory
 */
export const AVAILABLE_COMPONENT_TYPES: ComponentType[] = [
  'hero',
  'hero-section',
  'text',
  'text-block',
  'content',
  'image',
  'image-gallery',
  'gallery',
  'form',
  'contact-form',
  'contact',
  'features',
  'feature-grid',
  'feature-list',
  'cta',
  'call-to-action',
  'testimonials',
  'newsletter',
  'placeholder',
  'unknown',
];

/**
 * Component categories for UI organization
 */
export const COMPONENT_CATEGORIES = {
  layout: ['hero', 'hero-section'],
  content: ['text', 'text-block', 'content'],
  media: ['image', 'image-gallery', 'gallery'],
  interactive: ['form', 'contact-form', 'contact', 'newsletter'],
  marketing: ['features', 'feature-grid', 'feature-list', 'cta', 'call-to-action', 'testimonials'],
  utility: ['placeholder', 'unknown'],
} as const;

export { INSERT_DYNAMIC_COMPONENT_COMMAND };
