import express from "express";
import prisma from "../lib/prisma.js";
import { validate as isUuid } from "uuid";
import { createBooking } from "../services/bookingService.js";
import { getBookingsForUser } from "../services/bookingService.js";
import { sendBookingConfirmation } from "../services/emailService.js";
import { io } from "../app.js";
import { checkJwt } from "../middleware/auth0Middleware.js";
import { sendBookingCancellationEmail } from "../services/emailService.js";

const router = express.Router();

// ------------------------------------------------------------
// GET /bookings/me  (Auth0 protected)
// ------------------------------------------------------------
router.get("/me", checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const bookings = await getBookingsForUser(auth0Id);
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user bookings" });
  }
});

// ------------------------------------------------------------
// GET /bookings
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// GET /bookings/user/:userId
// ------------------------------------------------------------
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!isUuid(userId)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

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

// ------------------------------------------------------------
// GET /bookings/:id
// ------------------------------------------------------------
router.get("/:id", async (req, res) => {
  const { id } = req.params;

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

// ------------------------------------------------------------
// GET /bookings/disabled-dates/:propertyId
// ------------------------------------------------------------
router.get("/disabled-dates/:propertyId", async (req, res) => {
  const { propertyId } = req.params;

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

// ------------------------------------------------------------
// POST /bookings
// ------------------------------------------------------------
router.post("/", async (req, res) => {
  try {
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

    if (!auth0Id || !propertyId || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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

  const booking = await prisma.booking.create({
  data: {
    userId: user.id,
    propertyId,
    checkinDate: new Date (checkIn),
    checkoutDate:new  Date( checkOut),
    numberOfGuests: Number(guests),
    totalPrice,
    name,
    email,
    notes,
    bookingStatus: "CONFIRMED" 
  },
  include: {
    property: true,
    user: true
  }
});


    io.emit("booking:created", booking);

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

    if (err.status === 409) {
      return res.status(409).json({ error: err.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
});

// ------------------------------------------------------------
// PUT /bookings/:id
// ------------------------------------------------------------
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { checkinDate, checkoutDate, numberOfGuests } = req.body;

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

// ------------------------------------------------------------
// DELETE /bookings/:id
// ------------------------------------------------------------
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid booking ID format" });
  }

  try {
    // 1. Haal booking op inclusief user + property
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        property: true
      }
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // 2. Verwijder booking
    await prisma.booking.delete({ where: { id } });

    // 3. Verstuur annuleringsmail
    console.log("Sending cancellation email to:", booking.user.email);
    try {
      await sendBookingCancellationEmail(booking.user.email, booking);
    } catch (emailErr) {
      console.error("Cancellation email failed:", emailErr);
      // email mag falen, DELETE blijft succesvol
    }

    // 4. Succes
    return res.status(204).send();

  } catch (error) {
    console.error("Error deleting booking:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
