import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getPropertyById(id) {
  return prisma.property.findUnique({
    where: { id },
    include: {
      host: true, // host heeft GEEN user relation meer
      amenities: true,
      reviews: {
        include: {
          user: true, // dit blijft correct
        },
      },
    },
  });
}
