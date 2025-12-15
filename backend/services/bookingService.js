import prisma from "../lib/prisma.js";
import { checkBookingOverlap } from "./overlapService.js"; // of zelfde file, afhankelijk van jouw structuur

export async function createBooking(data) {
  const { 
    userId,
    propertyId,
    checkinDate,
    checkoutDate,
    numberOfGuests,
    totalPrice
  } = data;

  // ✅ Overlap-check
  const hasOverlap = await checkBookingOverlap(
    propertyId,
    checkinDate,
    checkoutDate
  );

  if (hasOverlap) {
    const error = new Error("Booking overlaps with an existing reservation");
    error.status = 409;
    throw error;
  }

  // ✅ Booking aanmaken
  return prisma.booking.create({
    data: {
      userId,
      propertyId,
      checkinDate: new Date(checkinDate),
      checkoutDate: new Date(checkoutDate),
      numberOfGuests,
      totalPrice,
      bookingStatus: "pending",   // ✅ TERUGGEZET
    }
  });
}
