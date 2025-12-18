import prisma from "../lib/prisma.js";

// ============================================================
// getBookingsForUser
// ============================================================
export async function getBookingsForUser(auth0Id) {
  return prisma.booking.findMany({
    where: {
      user: { auth0Id }
    },
    include: {
      property: {
        select: {
          title: true,
          location: true,
          pricePerNight: true,
        }
      }
    }
  });
}

// ============================================================
// createBooking
// ============================================================
async function checkBookingOverlap(propertyId, checkinDate, checkoutDate) {
  return prisma.booking.findMany({
    where: {
      propertyId,
      AND: [
        { checkinDate: { lt: new Date(checkoutDate) } },
        { checkoutDate: { gt: new Date(checkinDate) } }
      ]
    }
  }).then(results => results.length > 0);
}

export async function createBooking(data) {
  const { 
    userId,
    propertyId,
    checkinDate,
    checkoutDate,
    numberOfGuests,
    totalPrice,
    name,
    email,
    notes
  } = data;

  if (
    !userId ||
    !propertyId ||
    !checkinDate ||
    !checkoutDate ||
    !numberOfGuests ||
    !name ||
    !email
  ) {
    const error = new Error("Missing required fields");
    error.status = 400;
    throw error;
  }

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

  return prisma.booking.create({
    data: {
      userId,
      propertyId,
      checkinDate: new Date(checkinDate),
      checkoutDate: new Date(checkoutDate),
      numberOfGuests,
      totalPrice,
      name,
      email,
      notes,
      bookingStatus: "pending",
    }
  });
}

// ============================================================
// getBookingsForProperty
// ============================================================
export async function getBookingsForProperty(propertyId) {
  return prisma.booking.findMany({
    where: { propertyId },
    select: {
      checkinDate: true,
      checkoutDate: true
    }
  });
}
