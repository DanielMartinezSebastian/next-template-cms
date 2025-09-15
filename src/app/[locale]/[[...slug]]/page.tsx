import { HomePage, generateStaticParamsForHome } from '@/components/pages';
import { prisma } from '@/lib/db';
import fs from 'fs';
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
    .map(page => ({
      slug: page.fullPath.split('/').filter(Boolean),
    }))
    .filter(({ slug }) => slug.length > 0) // Excluir homepage
    .flatMap(({ slug }) =>
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

  // Buscar página dinámica en CMS
  const page = await prisma.page.findFirst({
    where: {
      fullPath: path,
      isActive: true,
    },
  });

  if (!page) {
    notFound();
  }

  return (
    <div className="dynamic-page">
      <h1>{page.slug}</h1>
      <p>Página dinámica: {path}</p>
      <p>Locale: {locale}</p>
    </div>
  );
}

// Configuración para ISR
export const revalidate = 60; // Revalidar cada minuto
