/**
 * On-demand Revalidation API
 * Permite invalidar el cache de páginas específicas cuando cambian de estado
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';

/**
 * Revalidar una ruta específica
 *
 * Query Parameters:
 * - path: La ruta a revalidar (ej: "/test", "/about")
 * - type: Tipo de revalidación "page" | "layout" (opcional)
 * - tag: Cache tag a invalidar (opcional)
 *
 * Ejemplos:
 * GET /api/revalidate?path=/test
 * GET /api/revalidate?path=/blog/[slug]&type=page
 * GET /api/revalidate?tag=pages
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const path = searchParams.get('path');
    const type = searchParams.get('type') as 'page' | 'layout' | null;
    const tag = searchParams.get('tag');

    // Validar que se proporcione al menos path o tag
    if (!path && !tag) {
      return Response.json(
        {
          revalidated: false,
          message: 'Se requiere el parámetro "path" o "tag"',
          example: '/api/revalidate?path=/test',
        },
        { status: 400 }
      );
    }

    const results: string[] = [];

    // Revalidar por path
    if (path) {
      if (type) {
        revalidatePath(path, type);
        results.push(`Revalidated path: ${path} (type: ${type})`);
      } else {
        revalidatePath(path);
        results.push(`Revalidated path: ${path}`);
      }
    }

    // Revalidar por tag
    if (tag) {
      revalidateTag(tag);
      results.push(`Revalidated tag: ${tag}`);
    }

    return Response.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      actions: results,
    });
  } catch (error) {
    console.error('Error durante la revalidación:', error);

    return Response.json(
      {
        revalidated: false,
        message: 'Error interno del servidor durante la revalidación',
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

/**
 * Revalidar múltiples rutas o tags
 *
 * Body format:
 * {
 *   "paths": ["/test", "/about"],
 *   "tags": ["pages", "posts"],
 *   "options": { "type": "page" }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paths, tags, options } = body;

    if (!paths && !tags) {
      return Response.json(
        {
          revalidated: false,
          message: 'Se requiere al menos "paths" o "tags" en el body',
          example: { paths: ['/test'], tags: ['pages'] },
        },
        { status: 400 }
      );
    }

    const results: string[] = [];

    // Revalidar paths
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        if (typeof path === 'string') {
          if (options?.type) {
            revalidatePath(path, options.type);
            results.push(`Revalidated path: ${path} (type: ${options.type})`);
          } else {
            revalidatePath(path);
            results.push(`Revalidated path: ${path}`);
          }
        }
      }
    }

    // Revalidar tags
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        if (typeof tag === 'string') {
          revalidateTag(tag);
          results.push(`Revalidated tag: ${tag}`);
        }
      }
    }

    return Response.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      actions: results,
      count: results.length,
    });
  } catch (error) {
    console.error('Error durante la revalidación en lote:', error);

    return Response.json(
      {
        revalidated: false,
        message: 'Error interno del servidor durante la revalidación en lote',
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
