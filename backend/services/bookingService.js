import prisma from "../lib/prisma.js";

// 🟢 User automatisch aanmaken als hij niet bestaat
async function ensureUserExists(auth0Id, email = "unknown@example.com") {
  return prisma.user.upsert({
    where: { auth0Id },
    update: {},
    create: {
      auth0Id,
      email,
      username: auth0Id,
      password: "auth0",
      name: "Auth0 User",
      phoneNumber: "",
      pictureUrl: ""
    }
  });
}

// 🟢 Overlap-check
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

// 🟢 Booking aanmaken
export async function createBooking(data) {
  const { 
    userAuth0Id,
    propertyId,
    checkinDate,
    checkoutDate,
    numberOfGuests,
    totalPrice
  } = data;

  // User ophalen via Auth0 ID
  const userRecord = await prisma.user.findUnique({
    where: { auth0Id: userAuth0Id }
  });

  if (!userRecord) {
    throw new Error("User not found after ensureUserExists");
  }

  // Overlap-check
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
      userId: userRecord.id,   // ⭐ DIT IS DE FIX
      propertyId,
      checkinDate: new Date(checkinDate),
      checkoutDate: new Date(checkoutDate),
      numberOfGuests,
      totalPrice,
      bookingStatus: "pending",
    }
  });
}

// 🟢 Bookings ophalen voor disabled dates
export async function getBookingsForProperty(propertyId) {
  return prisma.booking.findMany({
    where: { propertyId },
    select: {
      checkinDate: true,
      checkoutDate: true
    }
  });
}

// 🟢 Bookings ophalen voor user
export async function getBookingsForUser(auth0Id, email) {
  await ensureUserExists(auth0Id, email);

  return prisma.booking.findMany({
    where: {
      user: {
        auth0Id: auth0Id   // ⭐ DIT IS DE FIX
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

export {
  checkBookingOverlap
};
