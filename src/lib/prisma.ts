// src/lib/prisma.ts
//
// Supabase + Vercel notes:
//  - DATABASE_URL points to the PgBouncer pooler (port 6543, pgbouncer=true)
//  - We disable connection pooling inside Prisma (connection_limit=1) because
//    PgBouncer already manages the pool — double-pooling causes issues on
//    Vercel's serverless functions.
//  - The global singleton pattern prevents "too many connections" during
//    Next.js hot reloads in development.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
