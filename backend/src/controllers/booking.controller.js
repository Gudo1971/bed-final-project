import prisma from "../lib/prisma.js";

/* ---------------------------------------------------------
   SELECT FIELDS (Winc wants consistent output)
--------------------------------------------------------- */
const bookingSelect = {
  id: true,
  userId: true,
  propertyId: true,
  checkinDate: true,
  checkoutDate: true,
  numberOfGuests: true,
  totalPrice: true,
  bookingStatus: true,
};

/* ---------------------------------------------------------
   GET ALL BOOKINGS
--------------------------------------------------------- */
async function getAllBookingsController(req, res) {
  try {
    const bookings = await prisma.booking.findMany({
      select: bookingSelect,
    });

    if (!bookings.length) {
      return res.status(404).json({ error: "No bookings found" });
    }

    return res.status(200).json(bookings);
  } catch {
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
}

/* ---------------------------------------------------------
   GET BOOKING BY ID
--------------------------------------------------------- */
async function getBookingByIdController(req, res) {
  const { id } = req.params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      select: bookingSelect,
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    return res.status(200).json(booking);
  } catch {
    return res.status(500).json({ error: "Failed to fetch booking" });
  }
}

/* ---------------------------------------------------------
   GET BOOKINGS BY USER ID
--------------------------------------------------------- */
async function getBookingsByUserIdController(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId parameter" });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      select: bookingSelect,
    });

    if (!bookings.length) {
      return res.status(404).json({ error: "No bookings found for this user" });
    }

    return res.status(200).json(bookings);
  } catch {
    return res.status(500).json({ error: "Failed to fetch user bookings" });
  }
}

/* ---------------------------------------------------------
   GET BOOKINGS BY PROPERTY ID
--------------------------------------------------------- */
async function getBookingsByPropertyIdController(req, res) {
  const { propertyId } = req.params;

  try {
    const bookings = await prisma.booking.findMany({
      where: { propertyId },
      select: bookingSelect,
    });

    if (!bookings.length) {
      return res
        .status(404)
        .json({ error: "No bookings found for this property" });
    }

    return res.status(200).json(bookings);
  } catch {
    return res.status(500).json({ error: "Failed to fetch property bookings" });
  }
}

/* ---------------------------------------------------------
   CHECK FOR OVERLAPPING BOOKINGS
--------------------------------------------------------- */
async function hasOverlap(propertyId, checkinDate, checkoutDate) {
  return await prisma.booking.findFirst({
    where: {
      propertyId,
      AND: [
        { checkinDate: { lt: new Date(checkoutDate) } },
        { checkoutDate: { gt: new Date(checkinDate) } },
      ],
    },
  });
}

/* ---------------------------------------------------------
   CREATE BOOKING
--------------------------------------------------------- */
async function createBookingController(req, res) {
  try {
    const {
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    } = req.body;

    if (!userId || !propertyId || !checkinDate || !checkoutDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 404 if user does not exist
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 404 if property does not exist
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // 409 overlap check
    const overlap = await hasOverlap(propertyId, checkinDate, checkoutDate);
    if (overlap) {
      return res.status(409).json({ error: "Booking dates overlap" });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        propertyId,
        checkinDate: new Date(checkinDate),
        checkoutDate: new Date(checkoutDate),
        numberOfGuests: numberOfGuests ?? null,
        totalPrice: totalPrice ?? null,
        bookingStatus: bookingStatus ?? "confirmed",
      },
      select: bookingSelect,
    });

    return res.status(201).json(booking);
  } catch {
    return res.status(500).json({ error: "Failed to create booking" });
  }
}

/* ---------------------------------------------------------
   UPDATE BOOKING
--------------------------------------------------------- */
async function updateBookingController(req, res) {
  const { id } = req.params;

  try {
    const existing = await prisma.booking.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const { checkinDate, checkoutDate } = req.body;

    if (checkinDate || checkoutDate) {
      const newCheckin = checkinDate ?? existing.checkinDate;
      const newCheckout = checkoutDate ?? existing.checkoutDate;

      const overlap = await hasOverlap(
        existing.propertyId,
        newCheckin,
        newCheckout
      );

      if (overlap && overlap.id !== id) {
        return res.status(409).json({ error: "Booking dates overlap" });
      }
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        checkinDate: checkinDate ? new Date(checkinDate) : undefined,
        checkoutDate: checkoutDate ? new Date(checkoutDate) : undefined,
      },
      select: bookingSelect,
    });

    return res.status(200).json(updated);
  } catch {
    return res.status(500).json({ error: "Failed to update booking" });
  }
}

/* ---------------------------------------------------------
   DELETE BOOKING
--------------------------------------------------------- */
async function deleteBookingController(req, res) {
  const { id } = req.params;

  try {
    const existing = await prisma.booking.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await prisma.booking.delete({ where: { id } });

    return res.status(200).json({ message: "Booking deleted" });
  } catch {
    return res.status(500).json({ error: "Failed to delete booking" });
  }
}

/* ---------------------------------------------------------
   GET DISABLED DATES (Winc wants 200 even if empty)
--------------------------------------------------------- */
async function getDisabledDatesByPropertyIdController(req, res) {
  const { propertyId } = req.params;

  try {
    const bookings = await prisma.booking.findMany({
      where: { propertyId },
      select: { checkinDate: true, checkoutDate: true },
    });

    return res.status(200).json(bookings);
  } catch {
    return res.status(500).json({ error: "Failed to fetch disabled dates" });
  }
}

export {
  createBookingController,
  getAllBookingsController,
  getBookingByIdController,
  getBookingsByUserIdController,
  getBookingsByPropertyIdController,
  deleteBookingController,
  updateBookingController,
  getDisabledDatesByPropertyIdController,
};
