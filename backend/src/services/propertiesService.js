import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getPropertyById(id) {
  return prisma.property.findUnique({
    where: { id },
  });
}