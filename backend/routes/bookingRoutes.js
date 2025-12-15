import express from "express";
import prisma from "../lib/prisma.js";
import { createBooking } from "../services/bookingService.js";

const router = express.Router();

// ✅ POST /bookings — nieuwe booking aanmaken
router.post("/", async (req, res) => {
  try {
    const {
      userAuth0Id,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
    } = req.body;

    // ✅ Validatie
    if (!userAuth0Id || !propertyId || !checkinDate || !checkoutDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ User ophalen via Auth0 ID
    let user = await prisma.user.findUnique({
      where: { auth0Id: userAuth0Id }
    });

    // ✅ User aanmaken als hij nog niet bestaat
    if (!user) {
      user = await prisma.user.create({
        data: {
          auth0Id: userAuth0Id,
          email: `${userAuth0Id}@unknown.com`,
          username: userAuth0Id,
          password: "auth0",
          name: "Auth0 User",
          phoneNumber: "",
          pictureUrl: ""
        }
      });
    }

    // ✅ Property ophalen
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // ✅ Aantal nachten berekenen
    const nights =
      (new Date(checkoutDate) - new Date(checkinDate)) /
      (1000 * 60 * 60 * 24);

    if (nights <= 0) {
      return res.status(400).json({ error: "Invalid date range" });
    }

    // ✅ Totale prijs berekenen
    const totalPrice = nights * property.pricePerNight;

    // ✅ Booking aanmaken via service (met overlap-check)
    const booking = await createBooking({
      userId: user.id,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests: Number(numberOfGuests),
      totalPrice,
    });

    return res.status(201).json({
      message: "Booking created",
      booking,
    });

  } catch (err) {
    console.error("Error creating booking:", err);

    // ✅ Overlap-conflict
    if (err.status === 409) {
      return res.status(409).json({ error: err.message });
    }

    // ✅ Prisma foreign key error
    if (err.code === "P2003") {
      return res.status(400).json({
        error: "Foreign key constraint failed — user or property not found",
      });
    }

    // ✅ Fallback
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
