import prisma from "../lib/prisma.js";
import { mapBooking } from "../utils/bookingMapper.js";

// ---------------------------------------------------------
// CREATE BOOKING
// ---------------------------------------------------------
export const createBooking = async (data) => {
  const booking = await prisma.booking.create({
    data: {
      startDate: new Date(data.checkinDate),
      endDate: new Date(data.checkoutDate),
      numberOfGuests: data.numberOfGuests,
      totalPrice: data.totalPrice,
      bookingStatus: data.bookingStatus ?? "CONFIRMED",
      propertyId: data.propertyId,
      userId: data.userId,
    },
    include: {
      user: true,
      property: true,
    },
  });

  return mapBooking(booking);
};

// ---------------------------------------------------------
// GET ALL BOOKINGS
// ---------------------------------------------------------
export const getAllBookings = async () => {
  const bookings = await prisma.booking.findMany({
    include: {
      user: true,
      property: true,
    },
  });

  return bookings.map(mapBooking);
};

// ---------------------------------------------------------
// GET BOOKING BY ID
// ---------------------------------------------------------
export const getBookingById = async (id) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      user: true,
      property: true,
    },
  });

  return booking ? mapBooking(booking) : null;
};

// ---------------------------------------------------------
// GET BOOKINGS BY USER
// ---------------------------------------------------------
export const getBookingsByUserId = async (userId) => {
  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          location: true,
          images: true,
          pricePerNight: true,
          rating: true,
        },
      },
    },
  });

  return bookings.map(mapBooking);
};

// ---------------------------------------------------------
// GET BOOKINGS BY PROPERTY
// ---------------------------------------------------------
export const getBookingsByPropertyId = async (propertyId) => {
  const bookings = await prisma.booking.findMany({
    where: { propertyId },
    include: {
      user: true,
      property: true,
    },
  });

  return bookings.map(mapBooking);
};

// ---------------------------------------------------------
// UPDATE BOOKING
// ---------------------------------------------------------
export const updateBooking = async (id, data) => {
  const updated = await prisma.booking.update({
    where: { id },
    data: {
      startDate: data.checkinDate ? new Date(data.checkinDate) : undefined,
      endDate: data.checkoutDate ? new Date(data.checkoutDate) : undefined,
      numberOfGuests: data.numberOfGuests,
      totalPrice: data.totalPrice,
      bookingStatus: data.bookingStatus,
      propertyId: data.propertyId,
    },
    include: {
      user: true,
      property: true,
    },
  });

  return mapBooking(updated);
};

// ---------------------------------------------------------
// DELETE BOOKING
// ---------------------------------------------------------
export const deleteBooking = async (id) => {
  const deleted = await prisma.booking.delete({
    where: { id },
  });

  return mapBooking(deleted);
};
