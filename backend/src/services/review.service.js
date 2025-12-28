import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/* ============================================================
   GET ALL PROPERTIES
============================================================ */
export async function getAllProperties() {
  return prisma.property.findMany({
    include: {
      host: true, // host heeft GEEN user relation meer
      reviews: {
        include: {
          user: true,
        },
      },
      bookings: true,
    },
  });
}

/* ============================================================
   GET PROPERTY BY ID
============================================================ */
export async function getPropertyById(id) {
  return prisma.property.findUnique({
    where: { id }, 
    include: {
      host: true,
      reviews: {
        include: {
          user: true,
        },
      },
      bookings: true,
    },
  });
}


/* ============================================================
   GET PROPERTIES BY HOST EMAIL
============================================================ */
export async function getPropertiesByHostEmail(email) {
  return prisma.property.findMany({
    where: { hostEmail: email },
    include: {
      host: true,
      reviews: {
        include: {
          user: true,
        },
      },
      bookings: true,
    },
  });
}

/* ============================================================
   CREATE PROPERTY FOR HOST
============================================================ */
export async function createPropertyForHost(hostEmail, data) {
  return prisma.property.create({
    data: {
      ...data,
      hostEmail, // nieuwe relation
    },
    include: {
      host: true,
      reviews: {
        include: {
          user: true,
        },
      },
      bookings: true,
    },
  });
}
