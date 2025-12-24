import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Alle properties
export async function getAllProperties() {
  return prisma.property.findMany({
    include: {
      host: {
        include: {
          user: true,
        },
      },
      reviews: {
        include: {
          user: true,
        },
      },
      bookings: true,
    },
  });
}

// Eén property op ID
export async function getPropertyById(id) {
  return prisma.property.findUnique({
    where: { id: Number(id) },
    include: {
      host: {
        include: {
          user: true,
        },
      },
      reviews: {
        include: {
          user: true,
        },
      },
      bookings: true,
    },
  });
}

// Alle properties van een host
export async function getPropertiesByHostId(hostId) {
  return prisma.property.findMany({
    where: { hostId: Number(hostId) },
    include: {
      host: {
        include: {
          user: true,
        },
      },
      reviews: {
        include: {
          user: true,
        },
      },
      bookings: true,
    },
  });
}

// Property aanmaken voor host
export async function createPropertyForHost(hostId, data) {
  return prisma.property.create({
    data: {
      ...data,
      hostId: Number(hostId),
    },
    include: {
      host: {
        include: {
          user: true,
        },
      },
      reviews: {
        include: {
          user: true,
        },
      },
      bookings: true,
    },
  });
}
