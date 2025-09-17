/**
 * Mock Database for Testing Without PostgreSQL
 * Provides in-memory storage for pages and components during development
 */

import { PageJsonConfig } from '@/types/pages';

// =============================================================================
// MOCK DATA STORAGE
// =============================================================================

const mockPages: PageJsonConfig[] = [
  {
    id: 'mock-page-1',
    slug: 'test-page',
    locale: 'en',
    hierarchy: {
      id: 'mock-page-1',
      slug: 'test-page',
      fullPath: '/test-page',
      level: 0,
      order: 0,
    },
    meta: {
      title: 'Test Page',
      description: 'A test page for component testing',
    },
    components: [
      {
        id: 'comp-1',
        type: 'hero-section', // Fixed: added hyphen
        props: {
          title: 'Welcome to Test Page',
          subtitle: 'Testing Components',
          description: 'This is a test page for dynamic components',
          backgroundColor: 'bg-gradient-to-r from-blue-600 to-purple-600',
          ctaText: 'Get Started',
          ctaLink: '#',
        },
        order: 0,
        isVisible: true,
      },
      {
        id: 'comp-2',
        type: 'text-block', // Fixed: added hyphen
        props: {
          title: 'About This Page',
          content: 'This page demonstrates dynamic component rendering with the CMS system.',
        },
        order: 1,
        isVisible: true,
      },
      {
        id: 'comp-3',
        type: 'feature-grid', // Fixed: added hyphen
        props: {
          title: 'Our Features',
          features: [
            { icon: '⚡', title: 'Fast', description: 'Lightning-fast performance' },
            { icon: '🔒', title: 'Secure', description: 'Bank-level security' },
            { icon: '🎨', title: 'Beautiful', description: 'Stunning design' },
          ],
          columns: 3,
        },
        order: 2,
        isVisible: true,
      },
    ],
    template: 'default',
    isPublished: true,
    publishedAt: new Date().toISOString(),
    content: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-page-2',
    slug: 'demo-page',
    locale: 'en',
    hierarchy: {
      id: 'mock-page-2',
      slug: 'demo-page',
      fullPath: '/demo-page',
      level: 0,
      order: 1,
    },
    meta: {
      title: 'Demo Page',
      description: 'Demo page with various components',
    },
    components: [
      {
        id: 'demo-comp-1',
        type: 'button',
        props: {
          text: 'Click Me',
          variant: 'default',
          size: 'lg',
        },
        order: 0,
        isVisible: true,
      },
    ],
    template: 'default',
    isPublished: true,
    publishedAt: new Date().toISOString(),
    content: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockComponents = [
  {
    id: 'comp-type-1',
    name: 'HeroSection',
    type: 'hero-section',
    description: 'Hero section component',
    category: 'marketing',
    defaultConfig: {
      title: 'Welcome',
      subtitle: '',
      description: 'Discover amazing content',
    },
    configSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        subtitle: { type: 'string' },
        description: { type: 'string' },
      },
    },
  },
  {
    id: 'comp-type-2',
    name: 'TextBlock',
    type: 'text-block',
    description: 'Text content block',
    category: 'content',
    defaultConfig: {
      content: 'Enter your text here',
    },
    configSchema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
        title: { type: 'string' },
      },
    },
  },
  {
    id: 'comp-type-3',
    name: 'Button',
    type: 'button',
    description: 'Interactive button component',
    category: 'ui',
    defaultConfig: {
      text: 'Button',
      variant: 'default',
    },
    configSchema: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        variant: { type: 'string' },
      },
    },
  },
];

// =============================================================================
// MOCK API FUNCTIONS
// =============================================================================

export const mockDb = {
  // Pages API
  pages: {
    findMany: async (options?: {
      where?: Record<string, unknown>;
      include?: Record<string, unknown>;
      orderBy?: Record<string, unknown>;
      take?: number;
      skip?: number;
    }) => {
      console.log('🔧 Mock pages.findMany called with options:', JSON.stringify(options, null, 2));

      // For mock purposes, return simplified structure that matches expected API response format
      return mockPages.map(page => ({
        id: page.id,
        slug: page.slug,
        fullPath: page.hierarchy.fullPath,
        level: page.hierarchy.level,
        order: page.hierarchy.order,
        parentId: page.hierarchy.parentId || null,
        template: page.template || null,
        isActive: true,
        createdAt: new Date(page.createdAt),
        updatedAt: new Date(page.updatedAt),
        contents: [
          {
            id: `content-${page.id}`,
            title: page.meta.title,
            description: page.meta.description || null,
            metaTitle: page.meta.metaTitle || null,
            metaDescription: page.meta.metaDescription || null,
            keywords: page.meta.keywords || [],
            content: page.content || {},
            isPublished: page.isPublished,
            publishedAt: page.publishedAt ? new Date(page.publishedAt) : null,
            locale: {
              code: page.locale,
              name: page.locale === 'en' ? 'English' : 'Español',
            },
          },
        ],
        components: page.components.map((comp, index) => ({
          id: `comp-rel-${comp.id}`,
          order: comp.order,
          isVisible: comp.isVisible !== false,
          config: comp.props,
          component: {
            id: `comp-type-${comp.type}`,
            name: comp.type
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(''),
            type: comp.type, // Keep original type with hyphens
          },
        })),
        parent: null,
        children: [],
      }));
    },

    count: async (options?: { where?: Record<string, unknown> }) => {
      console.log('🔧 Mock pages.count called with options:', JSON.stringify(options, null, 2));
      // Simple count - in a real implementation you'd filter based on options.where
      return mockPages.length;
    },

    findUnique: async (options: { where: { id: string } }) => {
      return mockPages.find(page => page.id === options.where.id) || null;
    },

    create: async (data: { data: Partial<PageJsonConfig> }) => {
      const newPage: PageJsonConfig = {
        id: `mock-page-${Date.now()}`,
        slug: data.data.slug || 'new-page',
        locale: data.data.locale || 'en',
        hierarchy: {
          id: `mock-page-${Date.now()}`,
          slug: data.data.slug || 'new-page',
          fullPath: `/${data.data.slug || 'new-page'}`,
          level: 0,
          order: mockPages.length,
        },
        meta: {
          title: (data.data.meta as { title: string })?.title || 'New Page',
          description: (data.data.meta as { description?: string })?.description,
        },
        components: [],
        template: 'default',
        isPublished: false,
        content: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockPages.push(newPage);
      return newPage;
    },

    update: async (options: { where: { id: string }; data: Partial<PageJsonConfig> }) => {
      const pageIndex = mockPages.findIndex(page => page.id === options.where.id);
      if (pageIndex === -1) throw new Error('Page not found');

      mockPages[pageIndex] = {
        ...mockPages[pageIndex],
        ...options.data,
        updatedAt: new Date().toISOString(),
      };

      return mockPages[pageIndex];
    },

    delete: async (options: { where: { id: string } }) => {
      const pageIndex = mockPages.findIndex(page => page.id === options.where.id);
      if (pageIndex === -1) throw new Error('Page not found');

      const deletedPage = mockPages[pageIndex];
      mockPages.splice(pageIndex, 1);
      return deletedPage;
    },
  },

  // Components API
  component: {
    findMany: async (options?: {
      where?: Record<string, unknown>;
      select?: Record<string, unknown>;
      orderBy?: Record<string, unknown>[];
    }) => {
      console.log(
        '🔧 Mock component.findMany called with options:',
        JSON.stringify(options, null, 2)
      );

      // Return available components matching the schema generation
      return [
        {
          id: 'comp-type-hero-section',
          name: 'HeroSection',
          type: 'hero-section',
          category: 'marketing',
          description: 'Hero section component with title, description and CTA',
          defaultConfig: {
            title: 'Welcome to Our Website',
            subtitle: '',
            description: 'Discover amazing content and services',
            backgroundColor: 'bg-gradient-to-r from-blue-600 to-purple-600',
            ctaText: 'Get Started',
            ctaLink: '#',
          },
          configSchema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              subtitle: { type: 'string' },
              description: { type: 'string' },
              backgroundColor: { type: 'string' },
              ctaText: { type: 'string' },
              ctaLink: { type: 'string' },
            },
          },
        },
        {
          id: 'comp-type-text-block',
          name: 'TextBlock',
          type: 'text-block',
          category: 'content',
          description: 'Text content block with formatting options',
          defaultConfig: {
            title: '',
            content: 'Enter your text here',
            textAlign: 'left',
            backgroundColor: 'bg-white',
            textColor: 'text-gray-900',
            fontSize: 'text-base',
            fontWeight: 'font-normal',
          },
          configSchema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              content: { type: 'string' },
              textAlign: { type: 'string' },
              backgroundColor: { type: 'string' },
              textColor: { type: 'string' },
              fontSize: { type: 'string' },
              fontWeight: { type: 'string' },
            },
          },
        },
        {
          id: 'comp-type-feature-grid',
          name: 'FeatureGrid',
          type: 'feature-grid',
          category: 'marketing',
          description: 'Grid of features with icons and descriptions',
          defaultConfig: {
            title: 'Our Features',
            features: [],
            columns: 3,
          },
          configSchema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              features: { type: 'array' },
              columns: { type: 'number' },
            },
          },
        },
        {
          id: 'comp-type-button',
          name: 'Button',
          type: 'button',
          category: 'ui',
          description: 'Interactive button component',
          defaultConfig: {
            text: 'Button',
            variant: 'default',
            size: 'default',
          },
          configSchema: {
            type: 'object',
            properties: {
              text: { type: 'string' },
              variant: { type: 'string' },
              size: { type: 'string' },
            },
          },
        },
        {
          id: 'comp-type-call-to-action',
          name: 'CallToAction',
          type: 'call-to-action',
          category: 'marketing',
          description: 'Call to action section with title, description and button',
          defaultConfig: {
            title: 'Ready to get started?',
            description: 'Join thousands of satisfied customers today',
            buttonText: 'Get Started',
            buttonLink: '#',
            buttonVariant: 'default',
            backgroundColor: 'bg-primary',
            textColor: 'text-primary-foreground',
            centerAlign: true,
          },
          configSchema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              buttonText: { type: 'string' },
              buttonLink: { type: 'string' },
              buttonVariant: { type: 'string' },
              backgroundColor: { type: 'string' },
              textColor: { type: 'string' },
              centerAlign: { type: 'boolean' },
            },
          },
        },
        {
          id: 'comp-type-pricing',
          name: 'Pricing',
          type: 'pricing',
          category: 'marketing',
          description: 'Pricing plan component with features and call-to-action',
          defaultConfig: {
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
          configSchema: {
            type: 'object',
            properties: {
              planName: { type: 'string' },
              price: { type: 'string' },
              currency: { type: 'string' },
              period: { type: 'string' },
              description: { type: 'string' },
              features: { type: 'array' },
              buttonText: { type: 'string' },
              buttonLink: { type: 'string' },
              highlighted: { type: 'boolean' },
              backgroundColor: { type: 'string' },
              textColor: { type: 'string' },
              accentColor: { type: 'string' },
            },
          },
        },
        {
          id: 'comp-type-contact-form',
          name: 'ContactForm',
          type: 'contact-form',
          category: 'content',
          description: 'Contact form with name, email and message fields',
          defaultConfig: {
            title: 'Contact Us',
            description: 'Get in touch with our team',
            nameLabel: 'Name',
            emailLabel: 'Email',
            messageLabel: 'Message',
            submitText: 'Send Message',
            backgroundColor: 'bg-white',
            textColor: 'text-gray-900',
          },
          configSchema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              nameLabel: { type: 'string' },
              emailLabel: { type: 'string' },
              messageLabel: { type: 'string' },
              submitText: { type: 'string' },
              backgroundColor: { type: 'string' },
              textColor: { type: 'string' },
            },
          },
        },
        {
          id: 'comp-type-testimonial',
          name: 'Testimonial',
          type: 'testimonial',
          category: 'marketing',
          description: 'Single testimonial with quote, author and rating',
          defaultConfig: {
            quote: 'This product has transformed our business. Highly recommended!',
            author: 'John Smith',
            position: 'CEO, Tech Corp',
            rating: 5,
            avatar: '',
            backgroundColor: 'bg-gray-50',
            textColor: 'text-gray-900',
          },
          configSchema: {
            type: 'object',
            properties: {
              quote: { type: 'string' },
              author: { type: 'string' },
              position: { type: 'string' },
              rating: { type: 'number' },
              avatar: { type: 'string' },
              backgroundColor: { type: 'string' },
              textColor: { type: 'string' },
            },
          },
        },
        {
          id: 'comp-type-image-gallery',
          name: 'ImageGallery',
          type: 'image-gallery',
          category: 'content',
          description: 'Gallery of images with captions',
          defaultConfig: {
            title: 'Our Gallery',
            images: [
              { 
                src: 'https://images.placeholders.dev/400x300?text=Image%201&bgColor=%236b7280&textColor=%23ffffff',
                alt: 'Gallery Image 1',
                caption: 'Beautiful landscape'
              },
              { 
                src: 'https://images.placeholders.dev/400x300?text=Image%202&bgColor=%236b7280&textColor=%23ffffff',
                alt: 'Gallery Image 2',
                caption: 'Amazing architecture'
              },
            ],
            columns: 2,
            showCaptions: true,
          },
          configSchema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              images: { type: 'array' },
              columns: { type: 'number' },
              showCaptions: { type: 'boolean' },
            },
          },
        },
      ];
    },

    findUnique: async (options: { where: { id?: string; name?: string } }) => {
      return (
        mockComponents.find(
          comp => comp.id === options.where.id || comp.name === options.where.name
        ) || null
      );
    },

    create: async (data: { data: Partial<(typeof mockComponents)[0]> }) => {
      const newComponent = {
        id: `comp-${Date.now()}`,
        name: data.data.name || 'NewComponent',
        type: data.data.type || 'unknown',
        description: data.data.description || 'New component',
        category: data.data.category || 'general',
        defaultConfig: data.data.defaultConfig || { text: '', variant: 'default' },
        configSchema: data.data.configSchema || { type: 'object', properties: {} },
      };

      (mockComponents as Array<Record<string, unknown>>).push(newComponent);
      return newComponent;
    },

    count: async (options?: { where?: Record<string, unknown> }) => {
      console.log('🔧 Mock component.count called with options:', JSON.stringify(options, null, 2));
      // Return the count of components from findMany to ensure consistency
      const components = await mockDb.component.findMany();
      return components.length;
    },
  },
};

// =============================================================================
// MOCK PRISMA CLIENT
// =============================================================================

export const mockPrisma = {
  page: mockDb.pages,
  component: mockDb.component,
  $disconnect: async () => {
    // Mock disconnect
  },
};

// Export a function to check if we should use mock
export const shouldUseMock = () => {
  // Only use mock if DATABASE_URL is not configured
  // We want to use the real database in development when it's available
  return !process.env.DATABASE_URL;
};
