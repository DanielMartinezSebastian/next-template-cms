import { DynamicPageRenderer } from '@/components/dynamic';
import { HomePage, generateStaticParamsForHome } from '@/components/pages';
import { prisma } from '@/lib/db';
import { PageJsonConfig } from '@/types/pages';
import fs from 'fs';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import path from 'path';

// =============================================================================
// CONFIGURACIÓN DE RUTAS ESTÁTICAS FALLBACK
// =============================================================================
// Esta lista se usa como fallback si no se pueden escanear automáticamente
// las rutas estáticas del filesystem. Actualizar antes de ir a producción.
const STATIC_ROUTES_FALLBACK = [
  '/admin',
  '/editor-demo',
  '/stores-demo',
  '/visual-editor-demo',
  '/servicios', // Nota: /servicios tiene su propio catch-all interno
  '/scrollbar-demo',
  '/not-found-redirect',
];

interface Props {
  params: Promise<{
    locale: string;
    slug?: string[];
  }>;
}

// Función para obtener rutas estáticas existentes automáticamente
function getStaticRoutes(): string[] {
  try {
    const appDir = path.join(process.cwd(), 'src/app/[locale]');
    const entries = fs.readdirSync(appDir, { withFileTypes: true });

    const staticRoutes: string[] = [];

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('[')) {
        // Es un directorio y no es una ruta dinámica
        staticRoutes.push(`/${entry.name}`);

        // También buscar subdirectorios estáticos
        const subDir = path.join(appDir, entry.name);
        try {
          const subEntries = fs.readdirSync(subDir, { withFileTypes: true });
          for (const subEntry of subEntries) {
            if (subEntry.isDirectory() && !subEntry.name.startsWith('[')) {
              staticRoutes.push(`/${entry.name}/${subEntry.name}`);
            }
          }
        } catch {
          // Ignorar errores de lectura de subdirectorios
        }
      }
    }

    return staticRoutes;
  } catch (error) {
    console.warn('Error al escanear rutas estáticas:', error);
    // Usar el fallback configurable definido arriba
    return STATIC_ROUTES_FALLBACK;
  }
}

// Generar rutas estáticas para locales y páginas CMS
export async function generateStaticParams() {
  // Generar parámetros para homepage (todos los locales)
  const homeParams = generateStaticParamsForHome();

  // Obtener rutas estáticas automáticamente
  const staticRoutes = getStaticRoutes();

  // Generar parámetros para páginas dinámicas del CMS
  const pages = await prisma.page.findMany({
    where: {
      isActive: true,
      // Excluir rutas que tienen páginas estáticas específicas
      NOT: {
        fullPath: {
          in: staticRoutes,
        },
      },
    },
    select: { fullPath: true },
  });

  const cmsParams = pages
    .map((page: { fullPath: string }) => ({
      slug: page.fullPath.split('/').filter(Boolean),
    }))
    .filter(({ slug }: { slug: string[] }) => slug.length > 0) // Excluir homepage
    .flatMap(({ slug }: { slug: string[] }) =>
      // Generar parámetros para cada locale
      ['en', 'es'].map(locale => ({
        locale,
        slug,
      }))
    );

  return [...homeParams, ...cmsParams];
}

export default async function GlobalCatchAllPage({ params }: Props) {
  const { locale, slug = [] } = await params;

  // Si no hay slug, mostrar la homepage
  if (slug.length === 0) {
    return <HomePage locale={locale} />;
  }

  const path = `/${slug.join('/')}`;

  // Buscar página dinámica en CMS con todas las relaciones
  const page = await prisma.page.findFirst({
    where: {
      fullPath: path,
      isActive: true,
    },
    include: {
      contents: {
        where: {
          locale: {
            code: locale,
          },
        },
        include: {
          locale: {
            select: {
              code: true,
              name: true,
            },
          },
        },
      },
      components: {
        where: {
          isVisible: true,
        },
        include: {
          component: {
            select: {
              id: true,
              name: true,
              type: true,
              category: true,
              description: true,
              defaultConfig: true,
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      },
      parent: {
        select: {
          id: true,
          slug: true,
          fullPath: true,
        },
      },
    },
  });

  if (!page) {
    notFound();
  }

  // Transform Prisma data to PageJsonConfig
  const pageConfig = transformPrismaPageToApi(page, locale);

  return (
    <div className="dynamic-page min-h-screen">
      <DynamicPageRenderer
        pageConfig={pageConfig}
        locale={locale}
        editMode={false}
        className="dynamic-page-content"
      />
    </div>
  );
}

// Transform Prisma page data to API format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformPrismaPageToApi(page: any, locale: string): PageJsonConfig {
  // Get content for the specific locale or fallback to first available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content = page.contents.find((c: any) => c.locale.code === locale) || page.contents[0];

  return {
    id: page.id,
    slug: page.slug,
    locale: content?.locale.code || locale,
    hierarchy: {
      id: page.id,
      slug: page.slug,
      fullPath: page.fullPath,
      level: page.level,
      order: page.order,
      parentId: page.parentId || undefined,
    },
    meta: {
      title: content?.title || page.slug,
      description: content?.description || undefined,
      metaTitle: content?.metaTitle || undefined,
      metaDescription: content?.metaDescription || undefined,
      keywords: content?.keywords || [],
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    components: page.components.map((comp: any) => ({
      id: comp.id,
      type: comp.component.name,
      props: {
        ...(comp.component.defaultConfig as Record<string, unknown>),
        ...(comp.config as Record<string, unknown>),
      },
      order: comp.order,
      isVisible: comp.isVisible,
    })),
    template: page.template || undefined,
    isPublished: content?.isPublished || false,
    publishedAt: content?.publishedAt?.toISOString(),
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  };
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug = [] } = await params;

  if (slug.length === 0) {
    return {
      title: 'Home',
      description: 'Welcome to our website',
    };
  }

  const path = `/${slug.join('/')}`;

  const page = await prisma.page.findFirst({
    where: {
      fullPath: path,
      isActive: true,
    },
    include: {
      contents: {
        where: {
          locale: {
            code: locale,
          },
        },
        select: {
          title: true,
          description: true,
          metaTitle: true,
          metaDescription: true,
          keywords: true,
        },
      },
    },
  });

  if (!page || !page.contents[0]) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found',
    };
  }

  const content = page.contents[0];

  return {
    title: content.metaTitle || content.title,
    description: content.metaDescription || content.description || undefined,
    keywords: content.keywords?.join(', ') || undefined,
  };
}

// Configuración para ISR
export const revalidate = 60; // Revalidar cada minuto
