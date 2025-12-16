import express from "express";
import prisma from "../lib/prisma.js";
import { createBooking } from "../services/bookingService.js";
import { sendBookingConfirmation } from "../services/emailService.js";

const router = express.Router();

/* -------------------------------------------
   GET: Disabled dates for a property
------------------------------------------- */
router.get("/disabled-dates/:propertyId", async (req, res) => {
  const { propertyId } = req.params;

  try {
    const bookings = await prisma.booking.findMany({
      where: { propertyId },
      select: {
        checkinDate: true,
        checkoutDate: true,
      },
    });

    const disabled = bookings.flatMap((b) => {
      const start = new Date(b.checkinDate);
      const end = new Date(b.checkoutDate);

      const dates = [];
      for (let d = start; d <= end; d = new Date(d.getTime() + 86400000)) {
        dates.push(d.toISOString().split("T")[0]);
      }
      return dates;
    });

    res.json(disabled);
  } catch (err) {
    console.error("Error fetching disabled dates:", err);
    res.status(500).json({ error: "Failed to fetch disabled dates" });
  }
});

/* -------------------------------------------
   POST: Create booking + send confirmation email
------------------------------------------- */
router.post("/", async (req, res) => {
  console.log("RAW BODY:", req.body);

  try {
    const { auth0Id, propertyId, checkIn, checkOut, guests } = req.body;

    if (!auth0Id || !propertyId || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // User ophalen of aanmaken
    let user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          auth0Id,
          email: `${auth0Id}@unknown.com`,
          username: auth0Id,
          password: "auth0",
          name: "Auth0 User",
          phoneNumber: "",
          pictureUrl: "",
        },
      });
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const nights =
      (new Date(checkOut) - new Date(checkIn)) /
      (1000 * 60 * 60 * 24);

    if (nights <= 0) {
      return res.status(400).json({ error: "Invalid date range" });
    }

    const totalPrice = nights * property.pricePerNight;

    const booking = await createBooking({
      userId: user.id,
      propertyId,
      checkinDate: checkIn,
      checkoutDate: checkOut,
      numberOfGuests: Number(guests),
      totalPrice,
    });

    // ⭐ EMAIL CONFIRMATION — juiste plek
    try {
      await sendBookingConfirmation(user.email, booking);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
      // Booking blijft gewoon bestaan
    }

    return res.status(201).json({
      message: "Booking created",
      booking,
    });

  } catch (err) {
    console.error("Error creating booking:", err);

    if (err.status === 409) {
      return res.status(409).json({ error: err.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
