import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const databaseUrl = process.env["DATABASE_URL_UNPOOLED"] ?? process.env["DATABASE_URL"];

if (!databaseUrl) {
  throw new Error(
    "Missing database URL. Set DATABASE_URL_UNPOOLED or DATABASE_URL in .env.local, .env, or the command environment before running Prisma.",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // DATABASE_URL_UNPOOLED est utilisé pour les migrations (connexion directe, sans pooler pgBouncer)
    // En local, les deux variables peuvent pointer vers la même URL
    url: databaseUrl,
  },
});
