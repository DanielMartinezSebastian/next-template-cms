import { NextRequest, NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';

export async function POST() {
  try {
    const dbClient = getDbClient();
    
    // Check if components already exist
    const existingComponents = await dbClient.component.findMany();
    
    if (existingComponents.length > 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'Components already exist',
        count: existingComponents.length 
      });
    }
    
    // Seed components
    const componentsData = [
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
    ];

    // Insert components one by one to handle conflicts gracefully
    const results = [];
    for (const componentData of componentsData) {
      try {
        const component = await dbClient.component.create({
          data: componentData,
        });
        results.push(component);
      } catch (error) {
        console.warn(`Component ${componentData.id} already exists or error:`, error);
        // Try to update if it exists
        try {
          const component = await dbClient.component.update({
            where: { id: componentData.id },
            data: componentData,
          });
          results.push(component);
        } catch (updateError) {
          console.error(`Failed to update component ${componentData.id}:`, updateError);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Components seeded successfully',
      count: results.length,
      components: results 
    });
    
  } catch (error) {
    console.error('Error seeding components:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to seed components',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}