import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function getAllProperties() {
  return prisma.property.findMany();
}

export async function getPropertyById(id) {
  return prisma.property.findUnique({
    where: { id },
    include: {
      images: true   
    }
  });
}

