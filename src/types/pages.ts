/**
 * Types for dynamic pages system
 * Defines TypeScript interfaces for JSON-based page configurations
 */

import { z } from 'zod';

// =============================================================================
// BASIC PAGE TYPES
// =============================================================================

export interface PageHierarchy {
  id: string;
  slug: string;
  fullPath: string;
  level: number;
  order: number;
  parentId?: string;
}

export interface PageMeta {
  title: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  image?: string;
}

// =============================================================================
// COMPONENT CONFIGURATION TYPES
// =============================================================================

export interface ComponentConfig {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children?: ComponentConfig[];
  order: number;
  isVisible?: boolean;
}

// =============================================================================
// PAGE JSON CONFIGURATION
// =============================================================================

export interface PageJsonConfig {
  id: string;
  slug: string;
  locale: string;
  hierarchy: PageHierarchy;
  meta: PageMeta;
  components: ComponentConfig[];
  template?: string;
  isPublished: boolean;
  publishedAt?: string;
  content?: Record<string, unknown> | null; // Page JSON content
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// ZOD SCHEMAS FOR RUNTIME VALIDATION
// =============================================================================

// First define the basic schema without children
const BaseComponentConfigSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.unknown()),
  order: z.number(),
  isVisible: z.boolean().optional().default(true),
});

// Then add the recursive children field
export const ComponentConfigSchema: z.ZodType<ComponentConfig> = BaseComponentConfigSchema.extend({
  children: z.array(z.lazy(() => ComponentConfigSchema)).optional(),
});

export const PageHierarchySchema = z.object({
  id: z.string(),
  slug: z.string(),
  fullPath: z.string(),
  level: z.number(),
  order: z.number(),
  parentId: z.string().optional(),
});

export const PageMetaSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  image: z.string().optional(),
});

export const PageJsonConfigSchema = z.object({
  id: z.string(),
  slug: z.string(),
  locale: z.string(),
  hierarchy: PageHierarchySchema,
  meta: PageMetaSchema,
  components: z.array(ComponentConfigSchema),
  template: z.string().optional(),
  isPublished: z.boolean(),
  publishedAt: z.string().optional(),
  content: z.record(z.unknown()).nullable().optional(), // Page JSON content
  createdAt: z.string(),
  updatedAt: z.string(),
});

// =============================================================================
// API REQUEST/RESPONSE TYPES
// =============================================================================

export interface CreatePageRequest {
  slug: string;
  locale: string;
  parentId?: string;
  title: string;
  description?: string;
  template?: string;
  order?: number;
}

export interface UpdatePageRequest {
  slug?: string;
  parentId?: string;
  title?: string;
  description?: string;
  template?: string;
  order?: number;
  isPublished?: boolean;
}

export interface PageApiResponse {
  success: boolean;
  message?: string;
  page?: PageJsonConfig;
  pages?: PageJsonConfig[];
  error?: string;
}

// =============================================================================
// PRISMA INTEGRATION TYPES
// =============================================================================

export interface PrismaPageWithRelations {
  id: string;
  slug: string;
  fullPath: string;
  level: number;
  order: number;
  parentId: string | null;
  template: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  contents: Array<{
    id: string;
    title: string;
    description: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    keywords: string[];
    content: Record<string, unknown>;
    isPublished: boolean;
    publishedAt: Date | null;
    locale: {
      code: string;
      name: string;
    };
  }>;
  components: Array<{
    id: string;
    order: number;
    isVisible: boolean;
    config: Record<string, unknown>;
    component: {
      id: string;
      name: string;
      type: string;
    };
  }>;
  parent?: {
    id: string;
    slug: string;
    fullPath: string;
  } | null;
  children?: PrismaPageWithRelations[];
}

// =============================================================================
// COMPONENT FACTORY TYPES
// =============================================================================

export interface ComponentFactoryMapping {
  [componentType: string]: React.ComponentType<Record<string, unknown>>;
}

export interface ComponentRenderProps {
  config: ComponentConfig;
  locale: string;
  editMode?: boolean;
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isValidPageJsonConfig(data: unknown): data is PageJsonConfig {
  return PageJsonConfigSchema.safeParse(data).success;
}

export function isPrismaPageWithRelations(data: unknown): data is PrismaPageWithRelations {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'slug' in data &&
    'contents' in data &&
    'components' in data
  );
}
