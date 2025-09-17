import { PrismaClient } from '@prisma/client';
import { mockPrisma, shouldUseMock } from './mock-db';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Only initialize real Prisma client if not using mock
let realPrisma: PrismaClient | undefined;

if (!shouldUseMock()) {
  try {
    realPrisma = globalForPrisma.prisma ?? new PrismaClient({
      log: ['query'],
    });
    
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = realPrisma;
    }
  } catch (error) {
    console.warn('Failed to initialize Prisma client, falling back to mock:', error);
    realPrisma = undefined;
  }
}

export const prisma = realPrisma as PrismaClient;

/**
 * Get database client (real or mock based on availability)
 */
export function getDbClient() {
  // Check if DATABASE_URL exists and we should use real DB
  if (process.env.DATABASE_URL && !shouldUseMock()) {
    if (!realPrisma) {
      try {
        realPrisma = new PrismaClient({
          log: ['query'],
        });
        console.log('🔗 Connected to PostgreSQL database');
        return realPrisma;
      } catch (error) {
        console.warn('Failed to connect to PostgreSQL, falling back to mock:', error);
        return mockPrisma as unknown as PrismaClient;
      }
    }
    console.log('🔗 Using existing PostgreSQL connection');
    return realPrisma;
  }
  
  console.log('🔧 Using mock database for development');
  return mockPrisma as unknown as PrismaClient;
}

/**
 * Verificar si la base de datos está disponible y configurada
 * @returns {Promise<boolean>} true si la DB está disponible, false caso contrario
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    // Use mock if no DATABASE_URL
    if (shouldUseMock()) {
      console.log('🔧 Mock database is always available');
      return true;
    }

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
    if (shouldUseMock()) {
      console.log('🔧 Mock pages table is always available');
      return true;
    }

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
