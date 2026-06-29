import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const createPrismaClient = () => {
  // En production (Vercel), DATABASE_URL pointe vers l'URL poolée (pgBouncer/Neon pooler)
  // En local ou en maintenance, DATABASE_URL_UNPOOLED peut servir de fallback explicite.
  const connectionString =
    process.env.DATABASE_URL ?? process.env.DATABASE_URL_UNPOOLED;

  if (!connectionString) {
    throw new Error(
      "Missing database connection string. Set DATABASE_URL for runtime, or DATABASE_URL_UNPOOLED as fallback.",
    );
  }

  if (!process.env.DATABASE_URL && process.env.DATABASE_URL_UNPOOLED) {
    console.warn(
      "[prisma] DATABASE_URL is missing; using DATABASE_URL_UNPOOLED fallback. Configure the pooled DATABASE_URL in production.",
    );
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// En développement, on réutilise l'instance pour éviter d'épuiser le pool de connexions
// lors des rechargements à chaud de Next.js
const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
