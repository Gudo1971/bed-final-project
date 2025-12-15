import prisma from "../lib/prisma.js";

// ✅ Overlap-check functie opnieuw toegevoegd
async function checkBookingOverlap(propertyId, checkinDate, checkoutDate) {
  const overlappingBookings = await prisma.booking.findMany({
    where: {
      propertyId,
      AND: [
        { checkinDate: { lt: new Date(checkoutDate) } },
        { checkoutDate: { gt: new Date(checkinDate) } }
      ]
    }
  });

  return overlappingBookings.length > 0;
}

// ✅ Booking aanmaken
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

  return prisma.booking.create({
    data: {
      userId,
      propertyId,
      checkinDate: new Date(checkinDate),
      checkoutDate: new Date(checkoutDate),
      numberOfGuests,
      totalPrice,
      bookingStatus: "pending",
    }
  });
}

// ✅ Bookings ophalen voor disabled dates
export async function getBookingsForProperty(propertyId) {
  return prisma.booking.findMany({
    where: { propertyId },
    select: {
      checkinDate: true,
      checkoutDate: true
    }
  });
}
export async function getBookingsForUser(auth0Id) {
  const user = await prisma.user.findUnique({
    where: { auth0Id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.booking.findMany({
    where: { userId: user.id },
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


// ✅ Correcte export (named exports)
export {
  checkBookingOverlap, 
};
