import prisma from "../lib/prisma.js";

export const createBooking = async (data) => {
  return await prisma.booking.create({
    data: {
      userId: data.userId,
      propertyId: data.propertyId,
      startDate: new Date(data.checkinDate),
      endDate: new Date(data.checkoutDate),
      numberOfGuests: Number(data.numberOfGuests),
      totalPrice: Number(data.totalPrice),
      bookingStatus: data.bookingStatus || "CONFIRMED",
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
    where: { id },
    include: {
      user: true,
      property: true,
    },
  });
};

export const getBookingsByUserId = async (userId) => {
  return await prisma.booking.findMany({
    where: { userId },
    include: {
      user: true,
      property: true,
    },
  });
};

export const getBookingsByPropertyId = async (propertyId) => {
  return await prisma.booking.findMany({
    where: { propertyId },
    include: {
      user: true,
      property: true,
    },
  });
};

export const updateBooking = async (id, data) => {
  return await prisma.booking.update({
    where: { id },
    data: {
      startDate: data.checkinDate ? new Date(data.checkinDate) : undefined,
      endDate: data.checkoutDate ? new Date(data.checkoutDate) : undefined,
      numberOfGuests: data.numberOfGuests !== undefined ? Number(data.numberOfGuests) : undefined,
      totalPrice: data.totalPrice !== undefined ? Number(data.totalPrice) : undefined,
      bookingStatus: data.bookingStatus !== undefined ? data.bookingStatus : undefined,
      propertyId: data.propertyId !== undefined ? data.propertyId : undefined,
    },
    include: {
      user: true,
      property: true,
    },
  });
};

export const deleteBooking = async (id) => {
  return await prisma.booking.delete({
    where: { id },
  });
};
