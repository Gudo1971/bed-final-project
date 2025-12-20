import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 🔹 Alle properties (publiek)
export async function getAllProperties() {
  return prisma.property.findMany({
    where: { isActive: true },
    include: { images: true },
  });
}

// 🔹 Eén property op ID
export async function getPropertyById(id) {
  if (!id) throw new Error("Property ID is required");

  return prisma.property.findUnique({
    where: { id },
    include: {
      images: true,
      reviews: true,
      bookings: true,
    },
  });
}

// 🔹 Alle properties van een host (User = host)
export async function getPropertiesByHostId(hostId) {
  if (!hostId) throw new Error("Host ID is required");

  return prisma.property.findMany({
    where: { hostId },
    include: { images: true },
  });
}

// 🔹 Property aanmaken voor host
export async function createPropertyForHost(hostId, data) {
  if (!hostId) throw new Error("Host ID is required");

  return prisma.property.create({
    data: {
      ...data,
      hostId,
    },
    include: { images: true },
  });
}
