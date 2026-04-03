import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const createPrismaClient = () => {
  // En production (Vercel), DATABASE_URL pointe vers l'URL poolée (pgBouncer/Neon pooler)
  // En local, DATABASE_URL pointe vers la connexion directe
  const connectionString = process.env.DATABASE_URL!;
  console.log("process :", process.env.DATABASE_URL);
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
