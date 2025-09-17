import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with components...');

  // Seed Components
  await prisma.component.createMany({
    data: [
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
        },
        configSchema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            textAlign: { type: 'string' },
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
    ],
    skipDuplicates: true,
  });

  console.log('✅ Components seeded successfully!');

  // Seed some example pages
  await prisma.page.createMany({
    data: [
      {
        id: 'prod-page-1',
        slug: 'production-page',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'prod-page-2',
        slug: 'demo-production-page',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Pages seeded successfully!');

  // Seed PageContent for the pages
  await prisma.pageContent.createMany({
    data: [
      {
        pageId: 'prod-page-1',
        localeId: 'en',
        title: 'Production Page',
        description: 'A production page from PostgreSQL database',
        content: {},
        isPublished: false,
      },
      {
        pageId: 'prod-page-2',
        localeId: 'en',
        title: 'Demo Production Page',
        description: 'Another production page from PostgreSQL database',
        content: {},
        isPublished: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Page content seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });