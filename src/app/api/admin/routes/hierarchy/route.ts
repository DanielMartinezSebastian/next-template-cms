import { prisma } from '@/lib/db';
import { readdir, stat } from 'fs/promises';
import { NextResponse } from 'next/server';
import { join } from 'path';

interface RouteNode {
  path: string;
  type: 'static' | 'dynamic' | 'catch-all';
  isStatic: boolean;
  conflicts: string[];
  children: RouteNode[];
  hasStaticFile?: boolean;
  hasDynamicContent?: boolean;
}

export async function GET() {
  try {
    // Obtener rutas estáticas
    const staticRoutes = await getStaticRoutes();

    // Obtener rutas dinámicas del CMS
    const dynamicRoutes = await getDynamicRoutes();

    // Combinar y estructurar jerárquicamente
    const hierarchy = buildRouteHierarchy(staticRoutes, dynamicRoutes);

    return NextResponse.json({
      hierarchy,
      totalStatic: staticRoutes.length,
      totalDynamic: dynamicRoutes.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Route hierarchy error:', error);
    return NextResponse.json({ error: 'Failed to build route hierarchy' }, { status: 500 });
  }
}

/**
 * Obtener todas las rutas estáticas del filesystem
 */
async function getStaticRoutes(): Promise<RouteNode[]> {
  const routes: RouteNode[] = [];
  const appDir = join(process.cwd(), 'src/app/[locale]');

  try {
    await scanDirectory(appDir, '', routes);
  } catch (error) {
    console.error('Error scanning static routes:', error);
  }

  return routes;
}

/**
 * Escanear directorio recursivamente para encontrar páginas
 */
async function scanDirectory(
  dirPath: string,
  currentPath: string,
  routes: RouteNode[]
): Promise<void> {
  try {
    const entries = await readdir(dirPath);

    for (const entry of entries) {
      const fullPath = join(dirPath, entry);
      const stats = await stat(fullPath);

      if (stats.isDirectory()) {
        // Skip special directories
        if (entry.startsWith('(') || entry.startsWith('@')) {
          continue;
        }

        const newPath = currentPath ? `${currentPath}/${entry}` : `/${entry}`;

        // Check if it's a catch-all route
        const isCatchAll = entry.startsWith('[[...') || entry.startsWith('[...');

        if (isCatchAll) {
          routes.push({
            path: newPath.replace(/\[\[?\.\.\..*?\]\]?/, '*'),
            type: 'catch-all',
            isStatic: true,
            conflicts: [],
            children: [],
            hasStaticFile: true,
          });
        } else {
          // Continue scanning subdirectory
          await scanDirectory(fullPath, newPath, routes);
        }
      } else if (entry === 'page.tsx' || entry === 'page.js') {
        // Found a page file
        const routePath = currentPath || '/';
        routes.push({
          path: routePath,
          type: 'static',
          isStatic: true,
          conflicts: [],
          children: [],
          hasStaticFile: true,
        });
      }
    }
  } catch {
    // Directory doesn't exist or can't be read, skip
  }
}

/**
 * Obtener todas las rutas dinámicas del CMS
 */
async function getDynamicRoutes(): Promise<RouteNode[]> {
  try {
    const pages = await prisma.page.findMany({
      where: { isActive: true },
      select: {
        fullPath: true,
        routeType: true,
        createdAt: true,
      },
      orderBy: { fullPath: 'asc' },
    });

    return pages.map(page => ({
      path: page.fullPath,
      type: 'dynamic' as const,
      isStatic: false,
      conflicts: [],
      children: [],
      hasDynamicContent: true,
    }));
  } catch (error) {
    console.error('Error fetching dynamic routes:', error);
    return [];
  }
}

/**
 * Construir jerarquía combinando rutas estáticas y dinámicas
 */
function buildRouteHierarchy(staticRoutes: RouteNode[], dynamicRoutes: RouteNode[]): RouteNode[] {
  const allRoutes = [...staticRoutes, ...dynamicRoutes];
  const routeMap = new Map<string, RouteNode>();

  // Indexar todas las rutas
  for (const route of allRoutes) {
    if (routeMap.has(route.path)) {
      // Conflicto detectado
      const existing = routeMap.get(route.path)!;
      existing.conflicts.push(route.type);

      // Combinar información
      if (route.hasStaticFile) existing.hasStaticFile = true;
      if (route.hasDynamicContent) existing.hasDynamicContent = true;
    } else {
      routeMap.set(route.path, { ...route });
    }
  }

  // Construir jerarquía
  const rootRoutes: RouteNode[] = [];
  const routesByPath = Array.from(routeMap.values());

  for (const route of routesByPath) {
    const segments = route.path.split('/').filter(Boolean);

    if (segments.length === 1) {
      // Ruta de primer nivel
      rootRoutes.push(route);
    } else {
      // Buscar padre
      const parentPath = `/${segments.slice(0, -1).join('/')}`;
      const parent = routeMap.get(parentPath);

      if (parent) {
        parent.children.push(route);
      } else {
        // Padre no existe, agregar a root
        rootRoutes.push(route);
      }
    }
  }

  return rootRoutes.sort((a, b) => a.path.localeCompare(b.path));
}
