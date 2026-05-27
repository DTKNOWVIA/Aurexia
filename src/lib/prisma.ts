import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
let servername: string | undefined;
try {
  if (connectionString) {
    const connHost = new URL(connectionString).hostname;
    // If connecting via Supabase pooler, SNI must be the project hostname (the direct host),
    // not the generic pooler host. Prefer DIRECT_URL or NEXT_PUBLIC_SUPABASE_URL when available.
    if (connHost.includes("pooler.supabase.com") && process.env.DIRECT_URL) {
      servername = new URL(process.env.DIRECT_URL).hostname;
    } else if (connHost.includes("pooler.supabase.com") && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      servername = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
    } else {
      servername = connHost;
    }
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