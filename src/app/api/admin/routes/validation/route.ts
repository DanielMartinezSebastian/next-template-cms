import { prisma } from '@/lib/db';
import { existsSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';

interface RouteValidationRequest {
  path: string;
}

interface RouteValidationResponse {
  path: string;
  conflicts: {
    static: boolean;
    dynamic: boolean;
  };
  canCreate: boolean;
  suggestions: string[];
  info: {
    type: 'static' | 'dynamic' | 'available';
    section?: string;
    level: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { path }: RouteValidationRequest = await request.json();

    if (!path || !path.startsWith('/')) {
      return NextResponse.json({ error: 'Path must start with /' }, { status: 400 });
    }

    // Verificar si existe ruta estática
    const staticRouteExists = await checkStaticRoute(path);

    // Verificar si existe ruta dinámica
    const dynamicRouteExists = await checkDynamicRoute(path);

    // Determinar información de la ruta
    const info = analyzeRoutePath(path);

    // Generar sugerencias si hay conflictos
    const suggestions = staticRouteExists ? generateAlternativePaths(path) : [];

    const response: RouteValidationResponse = {
      path,
      conflicts: {
        static: staticRouteExists,
        dynamic: dynamicRouteExists,
      },
      canCreate: !staticRouteExists,
      suggestions,
      info,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Route validation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Verificar si existe una ruta estática para el path dado
 */
async function checkStaticRoute(path: string): Promise<boolean> {
  const segments = path.split('/').filter(Boolean);

  // Lista de posibles rutas estáticas
  const possiblePaths = [
    // Ruta directa
    `src/app/[locale]/${segments.join('/')}/page.tsx`,
    // Ruta con archivo directo
    `src/app/[locale]/${segments.join('/')}.tsx`,
    // Ruta en subdirectorio app
    `src/app/[locale]/app/${segments.join('/')}/page.tsx`,
  ];

  return possiblePaths.some(filePath => existsSync(join(process.cwd(), filePath)));
}

/**
 * Verificar si existe una ruta dinámica en el CMS
 */
async function checkDynamicRoute(path: string): Promise<boolean> {
  try {
    const existingPage = await prisma.page.findFirst({
      where: {
        fullPath: path,
        isActive: true,
      },
    });

    return !!existingPage;
  } catch (error) {
    console.error('Error checking dynamic route:', error);
    return false;
  }
}

/**
 * Analizar el path para determinar información de la ruta
 */
function analyzeRoutePath(path: string) {
  const segments = path.split('/').filter(Boolean);
  const level = segments.length;

  // Determinar sección
  const section = segments[0] || 'root';

  // Rutas estáticas conocidas
  const staticRoutes = ['/servicios', '/app', '/blog', '/admin'];

  if (staticRoutes.includes(path)) {
    return {
      type: 'static' as const,
      section,
      level,
    };
  }

  return {
    type: 'available' as const,
    section,
    level,
  };
}

/**
 * Generar paths alternativos cuando hay conflicto
 */
function generateAlternativePaths(path: string): string[] {
  const segments = path.split('/').filter(Boolean);
  const basePath = segments.slice(0, -1).join('/');
  const lastSegment = segments[segments.length - 1];

  const suggestions = [
    `${basePath}/${lastSegment}-page`,
    `${basePath}/${lastSegment}-content`,
    `${basePath}/content/${lastSegment}`,
    `${basePath}/pages/${lastSegment}`,
  ].filter(suggestion => suggestion !== path);

  return suggestions.slice(0, 3); // Máximo 3 sugerencias
}
