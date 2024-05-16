import { PrismaClient } from "@prisma/client";

let _prisma: PrismaClient | undefined;

export const prisma = _prisma ?? new PrismaClient();
