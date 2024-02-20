// import { PrismaClient } from "@prisma/client";

// export const prisma = new PrismaClient({
//     log: ['error'],
// });

// export const prisma = new PrismaClient({
//     log: ['query', 'info', 'warn', 'error'],
// });


import { PrismaClient } from '@prisma/client';

// This function initializes a new PrismaClient instance or returns the existing one.
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Extend the NodeJS global type with the prisma client instance.
// This ensures TypeScript understands the new global variable.
declare global {
  var prisma: PrismaClient | undefined;
}

// Check if we're running in development mode and if `prisma` is not already defined on the global object.
// If not, create a new instance and assign it to `global.prisma`.
// This ensures that in development, where module hot reloading might cause multiple instances of PrismaClient to be created,
// we only ever have one instance.
const prisma = global.prisma || prismaClientSingleton();

// Reassign the prisma client to the global variable in development mode.
// This step ensures that the same instance is reused across hot reloads.
if (process.env.NODE_ENV !== 'production' && !global.prisma) {
  global.prisma = prisma;
}

export default prisma;
