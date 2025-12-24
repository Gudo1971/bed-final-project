import prisma from "../lib/prisma.js";

export const createBooking = async (data) => {
  return await prisma.booking.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
    include: {
      user: true,
      property: true,
    },
  });
};

export const getAllBookings = async () => {
  return await prisma.booking.findMany({
    include: {
      user: true,
      property: true,
    },
  });
};

export const getBookingById = async (id) => {
  return await prisma.booking.findUnique({
    where: { id }, // ❗ geen Number()
    include: {
      user: true,
      property: true,
    },
  });
};

export const getBookingsByUserId = async (userId) => {
  return await prisma.booking.findMany({
    where: { userId }, // ❗ geen Number()
    include: {
      user: true,
      property: true,
    },
  });
};

export const getBookingsByPropertyId = async (propertyId) => {
  return await prisma.booking.findMany({
    where: { propertyId }, // ❗ geen Number()
    include: {
      user: true,
      property: true,
    },
  });
};

export const updateBooking = async (id, data) => {
  return await prisma.booking.update({
    where: { id }, // ❗ geen Number()
    data,
    include: {
      user: true,
      property: true,
    },
  });
};

export const deleteBooking = async (id) => {
  return await prisma.booking.delete({
    where: { id }, // ❗ geen Number()
  });
};
