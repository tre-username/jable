import { PrismaClient } from "@prisma/client";

// Disable the ESLint rule for the following line
/* eslint-disable-next-line no-var */
declare global {
    var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
