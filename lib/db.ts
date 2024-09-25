// import { PrismaClient } from "@prisma/client";

// declare global {
//     var prisma: PrismaClient | undefined;
// };

// export const db = globalThis.prisma || new PrismaClient();

// if(process.env.NODE_ENV !== "production") globalThis.prisma = db

import { PrismaClient } from "@prisma/client";

// Declare a global variable for the Prisma client to avoid multiple instances in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a new instance of PrismaClient or use the existing global instance
export const db = global.prisma || new PrismaClient();

// Assign the global variable in non-production environments
if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}
