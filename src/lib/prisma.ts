import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
let servername: string | undefined;
try {
  if (connectionString) {
    servername = new URL(connectionString).hostname;
  }
} catch (e) {
  // ignore
}

const pool = new Pool({
  connectionString,
  ssl: connectionString ? { rejectUnauthorized: false, servername } : undefined,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;