import prisma from "../lib/prisma.js";

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

export async function createBooking(data) {
  const { 
    userId,
    propertyId,
    checkinDate,
    checkoutDate,
    numberOfGuests,
    totalPrice
  } = data;

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

export async function getBookingsForProperty(propertyId) {
  return prisma.booking.findMany({
    where: { propertyId },
    select: {
      checkinDate: true,
      checkoutDate: true
    }
  });
}

export async function getBookingsForUser(auth0Id, email) {
  return prisma.booking.findMany({
    where: {
      user: {
        auth0Id
      }
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
