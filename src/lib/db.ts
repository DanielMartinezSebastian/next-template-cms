import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Verificar si la base de datos está disponible y configurada
 * @returns {Promise<boolean>} true si la DB está disponible, false caso contrario
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    // Verificar que la URL de la base de datos esté configurada
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL no está configurada');
      return false;
    }

    // Intentar una consulta simple para verificar conectividad
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.warn('Base de datos no disponible:', error);
    return false;
  }
}

/**
 * Verificar si la tabla 'pages' existe en la base de datos
 * @returns {Promise<boolean>} true si la tabla existe, false caso contrario
 */
export async function isPagesTableAvailable(): Promise<boolean> {
  try {
    if (!(await isDatabaseAvailable())) {
      return false;
    }

    // Verificar que la tabla 'pages' existe
    await prisma.page.findFirst({
      take: 1,
    });
    return true;
  } catch (error) {
    console.warn('Tabla pages no disponible:', error);
    return false;
  }
}
