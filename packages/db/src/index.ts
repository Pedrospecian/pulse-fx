import { PrismaClient } from "@prisma/client";

// Singleton para evitar múltiplas conexões em hot-reload / múltiplos imports.
// "var" aqui não é escolha de estilo — é a única forma de declarar uma
// variável global aumentada em "declare global" no TypeScript.
declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma = global.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}

export * from "@prisma/client";
