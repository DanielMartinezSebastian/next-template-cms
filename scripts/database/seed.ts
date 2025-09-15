import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with development data...');

  // Create locales
  const localeEn = await prisma.locale.upsert({
    where: { code: 'en' },
    update: {},
    create: {
      code: 'en',
      name: 'English',
      isDefault: true,
      isActive: true,
    },
  });

  const localeEs = await prisma.locale.upsert({
    where: { code: 'es' },
    update: {},
    create: {
      code: 'es',
      name: 'Español',
      isDefault: false,
      isActive: true,
    },
  });

  console.log('✅ Locales created');

  // Create namespaces
  const nsCommon = await prisma.namespace.upsert({
    where: { name: 'common' },
    update: {},
    create: {
      name: 'common',
      description: 'Common translations used across the application',
      isActive: true,
    },
  });

  const nsHome = await prisma.namespace.upsert({
    where: { name: 'home' },
    update: {},
    create: {
      name: 'home',
      description: 'Homepage specific translations',
      isActive: true,
    },
  });

  const nsAdmin = await prisma.namespace.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Admin panel translations',
      isActive: true,
    },
  });

  console.log('✅ Namespaces created');

  // Create translations for English
  const translations = [
    // English common
    { key: 'app.name', value: 'Next.js Template', localeId: localeEn.id, namespaceId: nsCommon.id },
    {
      key: 'app.description',
      value: 'A modern Next.js template with CMS capabilities',
      localeId: localeEn.id,
      namespaceId: nsCommon.id,
    },
    { key: 'navigation.home', value: 'Home', localeId: localeEn.id, namespaceId: nsCommon.id },
    { key: 'navigation.admin', value: 'Admin', localeId: localeEn.id, namespaceId: nsCommon.id },

    // Spanish common
    {
      key: 'app.name',
      value: 'Plantilla Next.js',
      localeId: localeEs.id,
      namespaceId: nsCommon.id,
    },
    {
      key: 'app.description',
      value: 'Una plantilla moderna de Next.js con capacidades CMS',
      localeId: localeEs.id,
      namespaceId: nsCommon.id,
    },
    { key: 'navigation.home', value: 'Inicio', localeId: localeEs.id, namespaceId: nsCommon.id },
    {
      key: 'navigation.admin',
      value: 'Administración',
      localeId: localeEs.id,
      namespaceId: nsCommon.id,
    },

    // English home
    {
      key: 'title',
      value: 'Welcome to Next.js Template',
      localeId: localeEn.id,
      namespaceId: nsHome.id,
    },
    {
      key: 'subtitle',
      value: 'Build amazing web applications with modern tools',
      localeId: localeEn.id,
      namespaceId: nsHome.id,
    },

    // Spanish home
    {
      key: 'title',
      value: 'Bienvenido a la Plantilla Next.js',
      localeId: localeEs.id,
      namespaceId: nsHome.id,
    },
    {
      key: 'subtitle',
      value: 'Construye aplicaciones web increíbles con herramientas modernas',
      localeId: localeEs.id,
      namespaceId: nsHome.id,
    },

    // English admin
    {
      key: 'dashboard.title',
      value: 'Admin Dashboard',
      localeId: localeEn.id,
      namespaceId: nsAdmin.id,
    },
    {
      key: 'dashboard.welcome',
      value: 'Welcome to the Admin Panel',
      localeId: localeEn.id,
      namespaceId: nsAdmin.id,
    },

    // Spanish admin
    {
      key: 'dashboard.title',
      value: 'Panel de Administración',
      localeId: localeEs.id,
      namespaceId: nsAdmin.id,
    },
    {
      key: 'dashboard.welcome',
      value: 'Bienvenido al Panel de Administración',
      localeId: localeEs.id,
      namespaceId: nsAdmin.id,
    },
  ];

  for (const translation of translations) {
    await prisma.translation.upsert({
      where: {
        key_localeId_namespaceId: {
          key: translation.key,
          localeId: translation.localeId,
          namespaceId: translation.namespaceId,
        },
      },
      update: {},
      create: {
        key: translation.key,
        value: translation.value,
        localeId: translation.localeId,
        namespaceId: translation.namespaceId,
        isActive: true,
      },
    });
  }

  console.log('✅ Translations created');

  // Create pages
  const homePage = await prisma.page.upsert({
    where: { fullPath: '/' },
    update: {},
    create: {
      slug: 'home',
      fullPath: '/',
      isActive: true,
      template: 'homepage',
      routeType: 'dynamic',
      level: 0,
      order: 0,
    },
  });

  console.log('✅ Pages created');

  // Create page contents
  await prisma.pageContent.upsert({
    where: {
      pageId_localeId: {
        pageId: homePage.id,
        localeId: localeEn.id,
      },
    },
    update: {},
    create: {
      pageId: homePage.id,
      localeId: localeEn.id,
      title: 'Welcome to Next.js Template',
      description: 'A modern template for building web applications',
      metaTitle: 'Next.js Template - Modern Web Development',
      metaDescription: 'Build amazing web applications with Next.js, TypeScript, and Tailwind CSS',
      keywords: ['nextjs', 'typescript', 'tailwind', 'template'],
      content: {
        sections: [
          {
            type: 'hero',
            title: 'Welcome to Next.js Template',
            subtitle: 'Build amazing applications',
            cta: { text: 'Get Started', link: '/admin' },
          },
        ],
      },
      isPublished: true,
    },
  });

  await prisma.pageContent.upsert({
    where: {
      pageId_localeId: {
        pageId: homePage.id,
        localeId: localeEs.id,
      },
    },
    update: {},
    create: {
      pageId: homePage.id,
      localeId: localeEs.id,
      title: 'Bienvenido a la Plantilla Next.js',
      description: 'Una plantilla moderna para construir aplicaciones web',
      metaTitle: 'Plantilla Next.js - Desarrollo Web Moderno',
      metaDescription:
        'Construye aplicaciones web increíbles con Next.js, TypeScript y Tailwind CSS',
      keywords: ['nextjs', 'typescript', 'tailwind', 'plantilla'],
      content: {
        sections: [
          {
            type: 'hero',
            title: 'Bienvenido a la Plantilla Next.js',
            subtitle: 'Construye aplicaciones increíbles',
            cta: { text: 'Comenzar', link: '/admin' },
          },
        ],
      },
      isPublished: true,
    },
  });

  console.log('✅ Page contents created');

  // Create components
  const heroComponent = await prisma.component.upsert({
    where: { name: 'Hero' },
    update: {},
    create: {
      name: 'Hero',
      type: 'layout',
      category: 'marketing',
      description: 'Hero section with title, subtitle and CTA',
      configSchema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          subtitle: { type: 'string' },
          description: { type: 'string' },
          ctaText: { type: 'string' },
          ctaLink: { type: 'string' },
          backgroundImage: { type: 'string' },
        },
      },
      defaultConfig: {
        title: 'Welcome to Our Website',
        subtitle: 'Build Something Amazing',
        description: 'Discover incredible features and services',
        ctaText: 'Get Started',
        ctaLink: '/',
        height: 'medium',
      },
      isActive: true,
    },
  });

  const textComponent = await prisma.component.upsert({
    where: { name: 'TextBlock' },
    update: {},
    create: {
      name: 'TextBlock',
      type: 'content',
      category: 'content',
      description: 'Rich text content block',
      configSchema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
          textAlign: { type: 'string' },
        },
      },
      defaultConfig: {
        title: 'Content Title',
        content: 'Your content goes here...',
        textAlign: 'left',
        fontSize: 'medium',
      },
      isActive: true,
    },
  });

  const featureGridComponent = await prisma.component.upsert({
    where: { name: 'FeatureGrid' },
    update: {},
    create: {
      name: 'FeatureGrid',
      type: 'interactive',
      category: 'marketing',
      description: 'Grid of features with icons and descriptions',
      configSchema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          features: { type: 'array' },
          columns: { type: 'number' },
        },
      },
      defaultConfig: {
        title: 'Our Features',
        columns: 3,
        features: [
          {
            title: 'Fast',
            description: 'Lightning fast performance',
            icon: '⚡',
          },
          {
            title: 'Secure',
            description: 'Enterprise-grade security',
            icon: '🔒',
          },
          {
            title: 'Scalable',
            description: 'Grows with your business',
            icon: '📈',
          },
        ],
      },
      isActive: true,
    },
  });

  console.log('✅ Components created');

  // Create sample dynamic pages

  // About Page
  const aboutPage = await prisma.page.upsert({
    where: { fullPath: '/about' },
    update: {},
    create: {
      slug: 'about',
      fullPath: '/about',
      level: 0,
      order: 1,
      routeType: 'dynamic',
      template: 'default',
      isActive: true,
    },
  });

  // Add content for about page
  await prisma.pageContent.upsert({
    where: {
      pageId_localeId: {
        pageId: aboutPage.id,
        localeId: localeEn.id,
      },
    },
    update: {},
    create: {
      pageId: aboutPage.id,
      localeId: localeEn.id,
      title: 'About Us',
      description: 'Learn more about our company and mission',
      metaTitle: 'About Us - Next.js Template',
      metaDescription: 'Discover our story, mission, and the team behind our innovative solutions',
      keywords: ['about', 'company', 'mission', 'team'],
      content: {},
      isPublished: true,
    },
  });

  await prisma.pageContent.upsert({
    where: {
      pageId_localeId: {
        pageId: aboutPage.id,
        localeId: localeEs.id,
      },
    },
    update: {},
    create: {
      pageId: aboutPage.id,
      localeId: localeEs.id,
      title: 'Acerca de Nosotros',
      description: 'Conoce más sobre nuestra empresa y misión',
      metaTitle: 'Acerca de Nosotros - Plantilla Next.js',
      metaDescription: 'Descubre nuestra historia, misión y el equipo detrás de nuestras soluciones innovadoras',
      keywords: ['acerca', 'empresa', 'misión', 'equipo'],
      content: {},
      isPublished: true,
    },
  });

  // Add components to about page
  await prisma.pageComponent.create({
    data: {
      pageId: aboutPage.id,
      componentId: heroComponent.id,
      order: 0,
      isVisible: true,
      config: {
        title: 'About Our Company',
        subtitle: 'Innovation Through Technology',
        description: 'We are passionate about creating amazing digital experiences',
        ctaText: 'Contact Us',
        ctaLink: '/contact',
        height: 'small',
        backgroundColor: 'bg-gradient-to-r from-purple-600 to-blue-600',
      },
    },
  });

  await prisma.pageComponent.create({
    data: {
      pageId: aboutPage.id,
      componentId: textComponent.id,
      order: 1,
      isVisible: true,
      config: {
        title: 'Our Story',
        content: 'Founded in 2024, we have been at the forefront of web technology innovation. Our team of passionate developers and designers work tirelessly to create solutions that make a difference.\n\nWe believe in the power of technology to transform businesses and improve lives. Our mission is to provide cutting-edge tools and templates that enable developers to build exceptional web applications quickly and efficiently.',
        textAlign: 'left',
        maxWidth: 'prose',
      },
    },
  });

  await prisma.pageComponent.create({
    data: {
      pageId: aboutPage.id,
      componentId: featureGridComponent.id,
      order: 2,
      isVisible: true,
      config: {
        title: 'Why Choose Us',
        columns: 3,
        features: [
          {
            title: 'Expert Team',
            description: 'Our developers have years of experience in modern web technologies',
            icon: '👥',
          },
          {
            title: 'Quality Code',
            description: 'We write clean, maintainable, and well-tested code',
            icon: '💻',
          },
          {
            title: 'Continuous Support',
            description: 'We provide ongoing support and updates for our products',
            icon: '🛠️',
          },
          {
            title: 'Modern Stack',
            description: 'Using the latest technologies like Next.js, TypeScript, and Tailwind',
            icon: '🚀',
          },
          {
            title: 'Best Practices',
            description: 'Following industry standards and best practices for security and performance',
            icon: '✅',
          },
          {
            title: 'Open Source',
            description: 'Contributing to the community with open source projects',
            icon: '🌟',
          },
        ],
      },
    },
  });

  // Services Page
  const servicesPage = await prisma.page.upsert({
    where: { fullPath: '/services' },
    update: {},
    create: {
      slug: 'services',
      fullPath: '/services',
      level: 0,
      order: 2,
      routeType: 'dynamic',
      template: 'default',
      isActive: true,
    },
  });

  // Add content for services page
  await prisma.pageContent.upsert({
    where: {
      pageId_localeId: {
        pageId: servicesPage.id,
        localeId: localeEn.id,
      },
    },
    update: {},
    create: {
      pageId: servicesPage.id,
      localeId: localeEn.id,
      title: 'Our Services',
      description: 'Discover our comprehensive range of web development services',
      metaTitle: 'Services - Next.js Template',
      metaDescription: 'Professional web development services including custom applications, consulting, and support',
      keywords: ['services', 'web development', 'consulting', 'support'],
      content: {},
      isPublished: true,
    },
  });

  // Add components to services page
  await prisma.pageComponent.create({
    data: {
      pageId: servicesPage.id,
      componentId: heroComponent.id,
      order: 0,
      isVisible: true,
      config: {
        title: 'Professional Services',
        subtitle: 'End-to-End Solutions',
        description: 'From concept to deployment, we handle every aspect of your web project',
        ctaText: 'Get Quote',
        ctaLink: '/contact',
        height: 'medium',
        backgroundColor: 'bg-gradient-to-r from-green-600 to-blue-600',
      },
    },
  });

  await prisma.pageComponent.create({
    data: {
      pageId: servicesPage.id,
      componentId: featureGridComponent.id,
      order: 1,
      isVisible: true,
      config: {
        title: 'What We Offer',
        columns: 2,
        features: [
          {
            title: 'Custom Web Applications',
            description: 'Tailored solutions built with modern frameworks and best practices',
            icon: '🌐',
          },
          {
            title: 'E-commerce Solutions',
            description: 'Complete online store development with payment integration',
            icon: '🛒',
          },
          {
            title: 'API Development',
            description: 'RESTful and GraphQL APIs for mobile and web applications',
            icon: '🔗',
          },
          {
            title: 'Consulting Services',
            description: 'Technical advice and architecture planning for your projects',
            icon: '💡',
          },
        ],
      },
    },
  });

  console.log('✅ Sample pages created with components');

  // Create system config
  await prisma.systemConfig.upsert({
    where: { key: 'site.name' },
    update: {},
    create: {
      key: 'site.name',
      value: 'Next.js Template',
      description: 'Site name displayed in header and metadata',
      category: 'general',
    },
  });

  console.log('✅ System config created');

  // Print summary
  const counts = await prisma.$transaction([
    prisma.locale.count(),
    prisma.namespace.count(),
    prisma.translation.count(),
    prisma.page.count(),
    prisma.pageContent.count(),
    prisma.component.count(),
    prisma.systemConfig.count(),
  ]);

  console.log('\n📊 Database Summary:');
  console.log(`  • Locales: ${counts[0]}`);
  console.log(`  • Namespaces: ${counts[1]}`);
  console.log(`  • Translations: ${counts[2]}`);
  console.log(`  • Pages: ${counts[3]}`);
  console.log(`  • Page Contents: ${counts[4]}`);
  console.log(`  • Components: ${counts[5]}`);
  console.log(`  • System Config: ${counts[6]}`);

  console.log('\n🎉 Database seeding completed successfully!');
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
