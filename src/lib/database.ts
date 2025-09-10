import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Fonction pour tester la connexion
export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database');
    return prisma;
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL database:', error);
    throw error;
  }
}

// Fonction pour fermer la connexion
export async function disconnectDB() {
  try {
    await prisma.$disconnect();
    console.log('🔌 Disconnected from PostgreSQL database');
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error);
  }
}

export default prisma;
