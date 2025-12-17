import express from "express";
import prisma from "../lib/prisma.js";
import { validate as isUuid } from "uuid";
import { createBooking } from "../services/bookingService.js";
import { sendBookingConfirmation } from "../services/emailService.js";
import { io } from "../app.js";

const router = express.Router();

/* ============================================================
   GET /bookings
   Haalt alle boekingen op, inclusief gekoppelde user en property
============================================================ */
router.get("/", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        property: true,
      },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ============================================================
   GET /bookings/user/:userId
   Haalt alle boekingen op voor een specifieke gebruiker
============================================================ */
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  // Validatie van UUID
  if (!isUuid(userId)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    // Controleren of user bestaat
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Boekingen ophalen
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { property: true },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ============================================================
   GET /bookings/:id
   Haalt één boeking op via ID
============================================================ */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // Validatie van UUID
  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid booking ID format" });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        property: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ============================================================
   GET /bookings/disabled-dates/:propertyId
   Haalt alle bezette datums op voor een property
============================================================ */
router.get("/disabled-dates/:propertyId", async (req, res) => {
  const { propertyId } = req.params;

  // Validatie van UUID
  if (!isUuid(propertyId)) {
    return res.status(400).json({ error: "Invalid property ID format" });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { propertyId },
      select: {
        checkinDate: true,
        checkoutDate: true,
      },
    });

    // Alle datums tussen check-in en check-out verzamelen
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

/* ============================================================
   POST /bookings
   Maakt een nieuwe boeking aan
============================================================ */
router.post("/", async (req, res) => {
  try {
    // Alle velden uit de body halen
    const {
      auth0Id,
      propertyId,
      checkIn,
      checkOut,
      guests,
      name,
      email,
      notes,
    } = req.body;

    // Minimale validatie op verplichte velden
    if (!auth0Id || !propertyId || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // User ophalen of aanmaken
    let user = await prisma.user.findUnique({ where: { auth0Id } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          auth0Id,
          email: email || `${auth0Id}@unknown.com`,
          username: auth0Id,
          password: "auth0",
          name: name || "Auth0 User",
          phoneNumber: "",
          pictureUrl: "",
        },
      });
    }

    // Property ophalen
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Aantal nachten berekenen
    const nights =
      (new Date(checkOut) - new Date(checkIn)) /
      (1000 * 60 * 60 * 24);

    if (nights <= 0) {
      return res.status(400).json({ error: "Invalid date range" });
    }

    const totalPrice = nights * property.pricePerNight;

    // Boeking opslaan via service
    const booking = await createBooking({
      userId: user.id,
      propertyId,
      checkinDate: checkIn,
      checkoutDate: checkOut,
      numberOfGuests: Number(guests),
      totalPrice,
      name,
      email,
      notes,
    });

    // Realtime update uitsturen
    io.emit("booking:created", booking);

    // Bevestigingsmail versturen
    try {
      await sendBookingConfirmation(user.email, booking);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    return res.status(201).json({
      message: "Booking created",
      booking,
    });

  } catch (err) {
    console.error("Error creating booking:", err);

    // Overlap of andere service errors
    if (err.status === 409) {
      return res.status(409).json({ error: err.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
});

/* ============================================================
   PUT /bookings/:id
   Wijzigt een bestaande boeking
============================================================ */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { checkinDate, checkoutDate, numberOfGuests } = req.body;

  // Validatie van UUID
  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid booking ID format" });
  }

  try {
    const updated = await prisma.booking.update({
      where: { id },
      data: {
        checkinDate,
        checkoutDate,
        numberOfGuests: Number(numberOfGuests),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating booking:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

/* ============================================================
   DELETE /bookings/:id
   Verwijdert een boeking
============================================================ */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  // Validatie van UUID
  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid booking ID format" });
  }

  try {
    await prisma.booking.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting booking:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
