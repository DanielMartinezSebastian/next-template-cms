/**
 * Component Schema Definitions
 * Automatically generates editor options from TypeScript component interfaces
 * and component-config.json configuration
 */

import { AUTO_GENERATED_SCHEMAS } from './generated/component-schemas';
import {
  generateAllComponentSchemasFromConfig,
  generateComponentSchemaFromConfig,
} from './schema-config-generator';
import { createButtonInterfaceInfo, generateSchemaFromInterface } from './schema-inference';

// =============================================================================
// SCHEMA TYPES
// =============================================================================

export interface PropertySchema {
  type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'select'
    | 'array'
    | 'object'
    | 'color'
    | 'url'
    | 'textarea';
  label: string;
  description?: string;
  default?: unknown;
  options?: Array<{ value: unknown; label: string }>;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  validation?: {
    pattern?: string;
    message?: string;
  };
}

export interface ComponentSchema {
  type: string;
  name: string;
  description: string;
  category: 'layout' | 'content' | 'media' | 'interactive' | 'marketing' | 'ui';
  icon?: string;
  properties: Record<string, PropertySchema>;
  defaults: Record<string, unknown>;
}

// =============================================================================
// COMPONENT SCHEMAS
// =============================================================================

export const COMPONENT_SCHEMAS: Record<string, ComponentSchema> = {
  'hero-section': {
    type: 'hero-section',
    name: 'Hero Section',
    description: 'Large banner section with title, description and call-to-action',
    category: 'layout',
    icon: '🎯',
    properties: {
      title: {
        type: 'string',
        label: 'Title',
        description: 'Main heading text',
        default: 'Welcome to Our Website',
        required: true,
        placeholder: 'Enter main title...',
      },
      subtitle: {
        type: 'string',
        label: 'Subtitle',
        description: 'Optional subtitle above the main title',
        default: '',
        placeholder: 'Enter subtitle...',
      },
      description: {
        type: 'textarea',
        label: 'Description',
        description: 'Supporting text below the title',
        default: 'Discover amazing content and services',
        placeholder: 'Enter description...',
      },
      backgroundImage: {
        type: 'url',
        label: 'Background Image',
        description: 'URL of background image',
        default: '',
        placeholder: 'https://example.com/image.jpg',
      },
      backgroundColor: {
        type: 'string',
        label: 'Background Color',
        description: 'Background color or CSS class when no image is used',
        default: 'bg-gradient-to-r from-blue-600 to-purple-600',
        placeholder: 'bg-blue-500 or #000000',
      },
      textAlign: {
        type: 'select',
        label: 'Text Alignment',
        description: 'Text alignment within the hero section',
        default: 'center',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ],
      },
      height: {
        type: 'select',
        label: 'Height',
        description: 'Height of the hero section',
        default: 'medium',
        options: [
          { value: 'small', label: 'Small (300px)' },
          { value: 'medium', label: 'Medium (500px)' },
          { value: 'large', label: 'Large (700px)' },
          { value: 'full', label: 'Full Screen' },
        ],
      },
      ctaText: {
        type: 'string',
        label: 'Button Text',
        description: 'Text for the call-to-action button',
        default: 'Get Started',
        placeholder: 'Button text...',
      },
      ctaLink: {
        type: 'url',
        label: 'Button Link',
        description: 'URL or path for the button link',
        default: '#',
        placeholder: '/contact or https://example.com',
      },
      ctaType: {
        type: 'select',
        label: 'Button Style',
        description: 'Visual style of the button',
        default: 'default',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'secondary', label: 'Secondary' },
          { value: 'outline', label: 'Outline' },
        ],
      },
      overlay: {
        type: 'boolean',
        label: 'Show Overlay',
        description: 'Add dark overlay over background image',
        default: true,
      },
      overlayOpacity: {
        type: 'number',
        label: 'Overlay Opacity',
        description: 'Opacity of the dark overlay (0-1)',
        default: 0.5,
        min: 0,
        max: 1,
        step: 0.1,
      },
    },
    defaults: {
      title: 'Welcome to Our Website',
      subtitle: 'Innovation Starts Here',
      description:
        'Discover amazing content and services that will transform your experience and help you achieve your goals.',
      backgroundImage:
        'https://images.placeholders.dev/1200x600?text=Hero%20Background&bgColor=%234f46e5&textColor=%23ffffff',
      backgroundColor: 'bg-gradient-to-r from-blue-600 to-purple-600',
      textAlign: 'center',
      height: 'medium',
      ctaText: 'Get Started',
      ctaLink: '#',
      ctaType: 'default',
      overlay: true,
      overlayOpacity: 0.5,
    },
  },

  // ✅ REMOVED: 'image-gallery' hardcoded schema
  // Now using automatic generation from component-config.json

  'text-block': {
    type: 'text-block',
    name: 'Text Block',
    description: 'Formatted text content with styling options',
    category: 'content',
    icon: '📝',
    properties: {
      title: {
        type: 'string',
        label: 'Title',
        description: 'Optional title for the text block',
        default: '',
        placeholder: 'Section title...',
      },
      subtitle: {
        type: 'string',
        label: 'Subtitle',
        description: 'Optional subtitle',
        default: '',
        placeholder: 'Section subtitle...',
      },
      content: {
        type: 'textarea',
        label: 'Content',
        description: 'Main text content',
        default: '',
        required: true,
        placeholder: 'Enter your content here...',
      },
      textAlign: {
        type: 'select',
        label: 'Text Alignment',
        description: 'Alignment of the text',
        default: 'left',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
          { value: 'justify', label: 'Justify' },
        ],
      },
      fontSize: {
        type: 'select',
        label: 'Font Size',
        description: 'Size of the text',
        default: 'medium',
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ],
      },
      fontWeight: {
        type: 'select',
        label: 'Font Weight',
        description: 'Weight of the text',
        default: 'normal',
        options: [
          { value: 'normal', label: 'Normal' },
          { value: 'medium', label: 'Medium' },
          { value: 'bold', label: 'Bold' },
        ],
      },
      padding: {
        type: 'select',
        label: 'Padding',
        description: 'Internal spacing',
        default: 'medium',
        options: [
          { value: 'none', label: 'None' },
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ],
      },
      margin: {
        type: 'select',
        label: 'Margin',
        description: 'External spacing',
        default: 'medium',
        options: [
          { value: 'none', label: 'None' },
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ],
      },
      maxWidth: {
        type: 'select',
        label: 'Max Width',
        description: 'Maximum width constraint',
        default: 'prose',
        options: [
          { value: 'none', label: 'Full Width' },
          { value: 'prose', label: 'Reading Width' },
          { value: 'container', label: 'Container Width' },
        ],
      },
      color: {
        type: 'color',
        label: 'Text Color',
        description: 'Custom text color',
        default: '',
        placeholder: '#000000',
      },
      backgroundColor: {
        type: 'color',
        label: 'Background Color',
        description: 'Background color for the text block',
        default: '',
        placeholder: '#ffffff',
      },
      allowHtml: {
        type: 'boolean',
        label: 'Allow HTML',
        description: 'Render HTML tags in content (use with caution)',
        default: false,
      },
    },
    defaults: {
      title: 'Welcome to Our Content',
      subtitle: 'Explore our amazing features and services',
      content:
        'This is a sample text block that demonstrates how content can be displayed with various formatting options. You can customize the appearance, alignment, and styling to match your design needs.\n\nThis text block supports multiple paragraphs and provides flexible content presentation for your website or application.',
      textAlign: 'left',
      fontSize: 'medium',
      fontWeight: 'normal',
      padding: 'medium',
      margin: 'medium',
      maxWidth: 'prose',
      color: '',
      backgroundColor: '',
      allowHtml: false,
    },
  },

  'feature-grid': {
    type: 'feature-grid',
    name: 'Feature Grid',
    description: 'Grid of features with icons and descriptions',
    category: 'marketing',
    icon: '⭐',
    properties: {
      title: {
        type: 'string',
        label: 'Section Title',
        description: 'Title for the features section',
        default: 'Our Features',
        placeholder: 'Features title...',
      },
      subtitle: {
        type: 'string',
        label: 'Subtitle',
        description: 'Optional subtitle for the section',
        default: 'Discover what makes us special',
        placeholder: 'Subtitle text...',
      },
      columns: {
        type: 'select',
        label: 'Columns',
        description: 'Number of columns in the grid',
        default: 3,
        options: [
          { value: 1, label: '1 Column' },
          { value: 2, label: '2 Columns' },
          { value: 3, label: '3 Columns' },
          { value: 4, label: '4 Columns' },
        ],
      },
      showIcons: {
        type: 'boolean',
        label: 'Show Icons',
        description: 'Display icons for each feature',
        default: true,
      },
    },
    defaults: {
      title: 'Our Features',
      subtitle: 'Discover what makes us special',
      columns: 3,
      showIcons: true,
      features: [
        {
          title: 'Fast Performance',
          description:
            'Lightning-fast loading times and optimized performance for the best user experience.',
          icon: '⚡',
          link: '/features/performance',
        },
        {
          title: 'Secure & Reliable',
          description: 'Enterprise-grade security with 99.9% uptime guarantee and regular backups.',
          icon: '🔐',
          link: '/features/security',
        },
        {
          title: '24/7 Support',
          description:
            'Round-the-clock customer support from our expert team whenever you need help.',
          icon: '🛟',
          link: '/support',
        },
      ],
    },
  },

  testimonials: {
    type: 'testimonials',
    name: 'Testimonials',
    description: 'Customer testimonials and reviews',
    category: 'marketing',
    icon: '💬',
    properties: {
      title: {
        type: 'string',
        label: 'Section Title',
        description: 'Title for the testimonials section',
        default: 'What our customers say',
        placeholder: 'Testimonials title...',
      },
      layout: {
        type: 'select',
        label: 'Layout',
        description: 'How to display testimonials',
        default: 'grid',
        options: [
          { value: 'grid', label: 'Grid Layout' },
          { value: 'carousel', label: 'Carousel' },
          { value: 'list', label: 'List' },
        ],
      },
    },
    defaults: {
      title: 'What our customers say',
      layout: 'grid',
      testimonials: [
        {
          name: 'Sarah Johnson',
          role: 'CEO, TechStart',
          content:
            'This service has transformed our business operations. The team is professional and the results speak for themselves.',
          rating: 5,
          avatar:
            'https://images.placeholders.dev/100x100?text=SJ&bgColor=%234f46e5&textColor=%23ffffff',
        },
        {
          name: 'Michael Chen',
          role: 'Product Manager, InnovaCorp',
          content:
            'Outstanding quality and excellent customer support. I highly recommend this to anyone looking for reliable solutions.',
          rating: 5,
          avatar:
            'https://images.placeholders.dev/100x100?text=MC&bgColor=%2310b981&textColor=%23ffffff',
        },
        {
          name: 'Emma Rodriguez',
          role: 'Marketing Director, GrowthCo',
          content:
            "The best investment we've made this year. The ROI has exceeded our expectations significantly.",
          rating: 5,
          avatar:
            'https://images.placeholders.dev/100x100?text=ER&bgColor=%23f59e0b&textColor=%23ffffff',
        },
      ],
    },
  },

  'call-to-action': {
    type: 'call-to-action',
    name: 'Call to Action',
    description: 'Prominent section with title, description and action button',
    category: 'marketing',
    icon: '🚀',
    properties: {
      title: {
        type: 'string',
        label: 'Title',
        description: 'Main heading for the CTA',
        default: 'Ready to get started?',
        placeholder: 'CTA title...',
      },
      description: {
        type: 'textarea',
        label: 'Description',
        description: 'Supporting text below the title',
        default: 'Join thousands of satisfied customers today',
        placeholder: 'CTA description...',
      },
      buttonText: {
        type: 'string',
        label: 'Button Text',
        description: 'Text for the action button',
        default: 'Get Started',
        placeholder: 'Button text...',
      },
      buttonLink: {
        type: 'url',
        label: 'Button Link',
        description: 'URL or path for the button',
        default: '#',
        placeholder: '/contact or https://example.com',
      },
      buttonVariant: {
        type: 'select',
        label: 'Button Style',
        description: 'Visual style of the button',
        default: 'default',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'secondary', label: 'Secondary' },
          { value: 'outline', label: 'Outline' },
          { value: 'destructive', label: 'Destructive' },
          { value: 'ghost', label: 'Ghost' },
          { value: 'link', label: 'Link' },
        ],
      },
      backgroundColor: {
        type: 'string',
        label: 'Background Color',
        description: 'Background color CSS class',
        default: 'bg-primary',
        placeholder: 'bg-blue-500',
      },
      centerAlign: {
        type: 'boolean',
        label: 'Center Align',
        description: 'Center align the content',
        default: true,
      },
    },
    defaults: {
      title: 'Ready to get started?',
      description: 'Join thousands of satisfied customers today',
      buttonText: 'Get Started',
      buttonLink: '#',
      buttonVariant: 'default',
      backgroundColor: 'bg-primary',
      textColor: 'text-primary-foreground',
      centerAlign: true,
    },
  },

  card: {
    type: 'card',
    name: 'Card',
    description: 'Flexible card with image, title, description and button',
    category: 'ui',
    icon: '🃏',
    properties: {
      title: {
        type: 'string',
        label: 'Title',
        description: 'Card title',
        default: 'Card Title',
        placeholder: 'Enter card title...',
      },
      description: {
        type: 'textarea',
        label: 'Description',
        description: 'Card description',
        default:
          'This is a sample card description that shows how content will be displayed in the card component.',
        placeholder: 'Enter description...',
      },
      image: {
        type: 'url',
        label: 'Image URL',
        description: 'Card image URL',
        default:
          'https://images.placeholders.dev/400x250?text=Card%20Image&bgColor=%236b7280&textColor=%23ffffff',
        placeholder: 'https://example.com/image.jpg',
      },
      imageAlt: {
        type: 'string',
        label: 'Image Alt Text',
        description: 'Alternative text for the image',
        default: 'Card image',
        placeholder: 'Describe the image...',
      },
      buttonText: {
        type: 'string',
        label: 'Button Text',
        description: 'Text for the action button',
        default: 'Learn More',
        placeholder: 'Button text...',
      },
      buttonLink: {
        type: 'url',
        label: 'Button Link',
        description: 'URL or path for the button',
        default: '#',
        placeholder: '/page or https://example.com',
      },
      variant: {
        type: 'select',
        label: 'Card Style',
        description: 'Visual style of the card',
        default: 'default',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'outlined', label: 'Outlined' },
          { value: 'elevated', label: 'Elevated' },
        ],
      },
      imagePosition: {
        type: 'select',
        label: 'Image Position',
        description: 'Position of the image relative to content',
        default: 'top',
        options: [
          { value: 'top', label: 'Top' },
          { value: 'left', label: 'Left' },
          { value: 'right', label: 'Right' },
        ],
      },
    },
    defaults: {
      title: 'Card Title',
      description:
        'This is a sample card description that shows how content will be displayed in the card component.',
      image:
        'https://images.placeholders.dev/400x250?text=Card%20Image&bgColor=%236b7280&textColor=%23ffffff',
      imageAlt: 'Card image',
      buttonText: 'Learn More',
      buttonLink: '#',
      variant: 'default',
      imagePosition: 'top',
    },
  },

  image: {
    type: 'image',
    name: 'Image',
    description: 'Simple image component with configurable properties',
    category: 'media',
    icon: '🖼️',
    properties: {
      src: {
        type: 'url',
        label: 'Image URL',
        description: 'URL of the image',
        default:
          'https://images.placeholders.dev/800x600?text=Image&bgColor=%236b7280&textColor=%23ffffff',
        required: true,
        placeholder: 'https://example.com/image.jpg',
      },
      alt: {
        type: 'string',
        label: 'Alt Text',
        description: 'Alternative text for accessibility',
        default: 'Image description',
        required: true,
        placeholder: 'Describe the image...',
      },
      width: {
        type: 'number',
        label: 'Width',
        description: 'Image width in pixels',
        default: 800,
        min: 1,
        max: 2000,
      },
      height: {
        type: 'number',
        label: 'Height',
        description: 'Image height in pixels',
        default: 600,
        min: 1,
        max: 2000,
      },
      fit: {
        type: 'select',
        label: 'Object Fit',
        description: 'How the image should fit within its container',
        default: 'cover',
        options: [
          { value: 'cover', label: 'Cover' },
          { value: 'contain', label: 'Contain' },
          { value: 'fill', label: 'Fill' },
          { value: 'none', label: 'None' },
          { value: 'scale-down', label: 'Scale Down' },
        ],
      },
      priority: {
        type: 'boolean',
        label: 'Priority Loading',
        description: 'Load image with high priority (for above-the-fold images)',
        default: false,
      },
    },
    defaults: {
      src: 'https://images.placeholders.dev/800x600?text=Image&bgColor=%236b7280&textColor=%23ffffff',
      alt: 'Image description',
      width: 800,
      height: 600,
      fit: 'cover',
      priority: false,
    },
  },

  pricing: {
    type: 'pricing',
    name: 'Pricing Plan',
    description: 'Pricing plan card with features and call-to-action',
    category: 'marketing',
    icon: '💰',
    properties: {
      planName: {
        type: 'string',
        label: 'Plan Name',
        description: 'Name of the pricing plan',
        default: 'Pro Plan',
        placeholder: 'Plan name...',
      },
      price: {
        type: 'string',
        label: 'Price',
        description: 'Price amount (without currency)',
        default: '29',
        placeholder: '29',
      },
      currency: {
        type: 'string',
        label: 'Currency',
        description: 'Currency symbol',
        default: '$',
        placeholder: '$',
      },
      period: {
        type: 'string',
        label: 'Billing Period',
        description: 'Billing period (month, year, etc.)',
        default: 'month',
        placeholder: 'month',
      },
      description: {
        type: 'string',
        label: 'Description',
        description: 'Brief description of the plan',
        default: 'Perfect for growing businesses',
        placeholder: 'Plan description...',
      },
      buttonText: {
        type: 'string',
        label: 'Button Text',
        description: 'Text for the action button',
        default: 'Get Started',
        placeholder: 'Button text...',
      },
      buttonLink: {
        type: 'url',
        label: 'Button Link',
        description: 'URL or path for the button',
        default: '#',
        placeholder: '/signup or https://example.com',
      },
      highlighted: {
        type: 'boolean',
        label: 'Highlighted Plan',
        description: 'Mark this plan as featured/recommended',
        default: false,
      },
    },
    defaults: {
      planName: 'Pro Plan',
      price: '29',
      currency: '$',
      period: 'month',
      description: 'Perfect for growing businesses',
      features: [
        { text: 'Unlimited projects', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Priority support', included: true },
        { text: 'Custom integrations', included: false },
        { text: 'Dedicated manager', included: false },
      ],
      buttonText: 'Get Started',
      buttonLink: '#',
      highlighted: false,
      backgroundColor: 'bg-white',
      textColor: 'text-gray-900',
      accentColor: 'bg-blue-600',
    },
  },

  testimonial: {
    type: 'testimonial',
    name: 'Testimonial',
    description: 'Single customer testimonial with rating and author info',
    category: 'marketing',
    icon: '⭐',
    properties: {
      quote: {
        type: 'textarea',
        label: 'Quote',
        description: 'The testimonial text',
        default: 'This product has completely transformed our workflow. Highly recommended!',
        required: true,
        placeholder: 'Enter testimonial text...',
      },
      author: {
        type: 'string',
        label: 'Author Name',
        description: 'Name of the person giving the testimonial',
        default: 'John Smith',
        required: true,
        placeholder: 'Author name...',
      },
      title: {
        type: 'string',
        label: 'Job Title',
        description: 'Job title of the author',
        default: 'CEO',
        placeholder: 'Job title...',
      },
      company: {
        type: 'string',
        label: 'Company',
        description: 'Company or organization of the author',
        default: 'Tech Solutions Inc.',
        placeholder: 'Company name...',
      },
      avatar: {
        type: 'url',
        label: 'Avatar URL',
        description: "URL of the author's photo",
        default:
          'https://images.placeholders.dev/150x150?text=Avatar&bgColor=%236b7280&textColor=%23ffffff',
        placeholder: 'https://example.com/avatar.jpg',
      },
      rating: {
        type: 'number',
        label: 'Rating',
        description: 'Star rating (1-5)',
        default: 5,
        min: 1,
        max: 5,
      },
    },
    defaults: {
      quote: 'This product has completely transformed our workflow. Highly recommended!',
      author: 'John Smith',
      title: 'CEO',
      company: 'Tech Solutions Inc.',
      avatar:
        'https://images.placeholders.dev/150x150?text=Avatar&bgColor=%236b7280&textColor=%23ffffff',
      rating: 5,
      backgroundColor: 'bg-white',
      textColor: 'text-gray-900',
    },
  },

  'contact-form': {
    type: 'contact-form',
    name: 'Contact Form',
    description: 'Customizable contact form with multiple field types',
    category: 'interactive',
    icon: '📧',
    properties: {
      title: {
        type: 'string',
        label: 'Form Title',
        description: 'Title for the contact form',
        default: 'Contact Us',
        placeholder: 'Form title...',
      },
      description: {
        type: 'string',
        label: 'Description',
        description: 'Description text below the title',
        default: 'Get in touch with us',
        placeholder: 'Form description...',
      },
      submitText: {
        type: 'string',
        label: 'Submit Button Text',
        description: 'Text for the submit button',
        default: 'Send Message',
        placeholder: 'Button text...',
      },
      successMessage: {
        type: 'string',
        label: 'Success Message',
        description: 'Message shown after successful submission',
        default: 'Thank you for your message!',
        placeholder: 'Success message...',
      },
    },
    defaults: {
      title: 'Contact Us',
      description: 'Get in touch with us',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Your name' },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          placeholder: 'your@email.com',
        },
        {
          name: 'message',
          label: 'Message',
          type: 'textarea',
          required: true,
          placeholder: 'Your message here...',
        },
      ],
      submitText: 'Send Message',
      successMessage: 'Thank you for your message!',
    },
  },

  // =============================================================================
  // AUTO-GENERATED SCHEMAS (from TypeScript interfaces)
  // =============================================================================

  // Button component schema generated automatically from ButtonComponentProps interface
  ...(() => {
    const buttonInterfaceInfo = createButtonInterfaceInfo();
    const buttonSchema = generateSchemaFromInterface(buttonInterfaceInfo);

    return { [buttonSchema.type]: buttonSchema };
  })(),
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Apply manual corrections to auto-generated schemas
 */
function applySchemaCorrections(type: string, schema: ComponentSchema): ComponentSchema {
  // Fix ImageGallery schema types (both imagegallery and image-gallery)
  if (type === 'image-gallery' || type === 'imagegallery') {
    return {
      ...schema,
      properties: {
        ...schema.properties,
        images: {
          ...schema.properties.images,
          type: 'array',
        },
        columns: {
          ...schema.properties.columns,
          type: 'select',
          options: [
            { value: 1, label: '1 Column' },
            { value: 2, label: '2 Columns' },
            { value: 3, label: '3 Columns' },
            { value: 4, label: '4 Columns' },
          ],
        },
        spacing: {
          ...schema.properties.spacing,
          type: 'select',
          options: [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
          ],
        },
        aspectRatio: {
          ...schema.properties.aspectRatio,
          type: 'select',
          options: [
            { value: 'square', label: 'Square (1:1)' },
            { value: 'landscape', label: 'Landscape (16:9)' },
            { value: 'portrait', label: 'Portrait (3:4)' },
            { value: 'auto', label: 'Auto (original)' },
          ],
        },
      },
      defaults: {
        ...schema.defaults,
        images: [
          {
            src: 'https://images.placeholders.dev/800x600?text=Gallery%20Image%201&bgColor=%234f46e5&textColor=%23ffffff',
            alt: 'Gallery Image 1',
            title: 'Beautiful Landscape',
            description: 'A stunning view of the mountains and valleys',
          },
          {
            src: 'https://images.placeholders.dev/800x600?text=Gallery%20Image%202&bgColor=%2310b981&textColor=%23ffffff',
            alt: 'Gallery Image 2',
            title: 'Urban Architecture',
            description: 'Modern cityscape with innovative buildings',
          },
          {
            src: 'https://images.placeholders.dev/800x600?text=Gallery%20Image%203&bgColor=%23f59e0b&textColor=%23ffffff',
            alt: 'Gallery Image 3',
            title: 'Natural Wonder',
            description: 'Pristine nature in its full glory',
          },
        ],
        columns: 3,
        spacing: 'medium',
        aspectRatio: 'auto',
      },
    };
  }

  return schema;
}

/**
 * Get component schema by type - NOW USING CONFIGURATION-BASED GENERATION
 * This replaces the hardcoded approach with automatic generation from component-config.json
 */
export function getComponentSchema(type: string): ComponentSchema | null {
  // First try the new configuration-based generator
  const configSchema = generateComponentSchemaFromConfig(type);
  if (configSchema) {
    return configSchema;
  }

  // Fallback to manual schemas for any edge cases
  const manualSchema = COMPONENT_SCHEMAS[type];
  if (manualSchema) {
    return manualSchema;
  }

  // Fallback to auto-generated schemas with basic corrections
  const autoGenerated = (AUTO_GENERATED_SCHEMAS as Record<string, unknown>)[type];
  if (autoGenerated) {
    return applySchemaCorrections(type, autoGenerated as ComponentSchema);
  }

  // Manual mapping for known mismatches (legacy support)
  const typeMapping: Record<string, string> = {
    imagegallery: 'image-gallery',
    textblock: 'text-block',
    featuregrid: 'feature-grid',
    herosection: 'hero-section',
    calltoaction: 'call-to-action',
    contactform: 'contact-form',
  };

  // Try mapped variant first in manual schemas
  const mappedType = typeMapping[type];
  if (mappedType) {
    const manualMappedSchema = COMPONENT_SCHEMAS[mappedType];
    if (manualMappedSchema) {
      return manualMappedSchema;
    }

    // Then try config-based generation with mapped type
    const configMappedSchema = generateComponentSchemaFromConfig(mappedType);
    if (configMappedSchema) {
      return configMappedSchema;
    }

    // Finally try auto-generated
    const mappedSchema = (AUTO_GENERATED_SCHEMAS as Record<string, unknown>)[mappedType];
    if (mappedSchema) {
      return applySchemaCorrections(mappedType, mappedSchema as ComponentSchema);
    }
  }

  console.warn(`No schema found for component type: ${type}`);
  return null;
}

/**
 * Get all available component schemas
 */
export function getAllComponentSchemas(): ComponentSchema[] {
  // Use the new configuration-based generator to get all schemas
  const configSchemas = generateAllComponentSchemasFromConfig();

  // Convert to array and sort by category and name
  const schemaArray = Object.values(configSchemas);

  return schemaArray.sort((a, b) => {
    // Sort by category first, then by name
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.name.localeCompare(b.name);
  });
}

/**
 * Get schemas grouped by category - NOW USING CONFIGURATION-BASED GENERATION
 */
export function getSchemasByCategory(): Record<string, ComponentSchema[]> {
  const allSchemas = getAllComponentSchemas();
  const grouped: Record<string, ComponentSchema[]> = {};

  allSchemas.forEach(schema => {
    if (!grouped[schema.category]) {
      grouped[schema.category] = [];
    }
    grouped[schema.category].push(schema);
  });

  return grouped;
}

/**
 * Get default props for a component type
 */
export function getComponentDefaults(type: string): Record<string, unknown> {
  const schema = getComponentSchema(type);
  return schema?.defaults || {};
}

/**
 * Validate component props against schema
 */
export function validateComponentProps(
  type: string,
  props: Record<string, unknown>
): {
  isValid: boolean;
  errors: string[];
  sanitizedProps: Record<string, unknown>;
} {
  const schema = getComponentSchema(type);

  if (!schema) {
    return {
      isValid: false,
      errors: [`Unknown component type: ${type}`],
      sanitizedProps: {},
    };
  }

  const errors: string[] = [];
  const sanitizedProps: Record<string, unknown> = { ...schema.defaults };

  // Validate each property
  Object.entries(schema.properties).forEach(([key, propertySchema]) => {
    const value = props[key];

    // Check required fields
    if (propertySchema.required && (value === undefined || value === null || value === '')) {
      errors.push(`${propertySchema.label} is required`);
      return;
    }

    // Skip validation if value is undefined/null and not required
    if (value === undefined || value === null) {
      return;
    }

    // Type validation
    switch (propertySchema.type) {
      case 'string':
      case 'textarea':
      case 'url':
      case 'color':
        if (typeof value !== 'string') {
          errors.push(`${propertySchema.label} must be a string`);
        } else {
          sanitizedProps[key] = value;
        }
        break;

      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          errors.push(`${propertySchema.label} must be a valid number`);
        } else {
          // Check min/max constraints
          if (propertySchema.min !== undefined && value < propertySchema.min) {
            errors.push(`${propertySchema.label} must be at least ${propertySchema.min}`);
          } else if (propertySchema.max !== undefined && value > propertySchema.max) {
            errors.push(`${propertySchema.label} must be at most ${propertySchema.max}`);
          } else {
            sanitizedProps[key] = value;
          }
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push(`${propertySchema.label} must be true or false`);
        } else {
          sanitizedProps[key] = value;
        }
        break;

      case 'select':
        const validOptions = propertySchema.options?.map(opt => opt.value) || [];
        let selectValue = value;

        // Try to convert string numbers to actual numbers for comparison
        if (typeof value === 'string' && !isNaN(Number(value))) {
          const numValue = Number(value);
          if (validOptions.includes(numValue)) {
            selectValue = numValue;
          }
        }

        if (!validOptions.includes(selectValue)) {
          errors.push(`${propertySchema.label} must be one of: ${validOptions.join(', ')}`);
        } else {
          sanitizedProps[key] = selectValue;
        }
        break;

      case 'array':
        if (!Array.isArray(value)) {
          errors.push(`${propertySchema.label} must be an array`);
        } else {
          sanitizedProps[key] = value;
        }
        break;

      case 'object':
        if (typeof value !== 'object' || Array.isArray(value)) {
          errors.push(`${propertySchema.label} must be an object`);
        } else {
          sanitizedProps[key] = value;
        }
        break;

      default:
        sanitizedProps[key] = value;
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedProps,
  };
}

/**
 * Generate form fields for component editor
 */
export function generateFormFields(type: string): Array<{
  key: string;
  schema: PropertySchema;
  value: unknown;
}> {
  const schema = getComponentSchema(type);

  if (!schema) {
    return [];
  }

  return Object.entries(schema.properties).map(([key, propertySchema]) => ({
    key,
    schema: propertySchema,
    value: schema.defaults[key],
  }));
}
