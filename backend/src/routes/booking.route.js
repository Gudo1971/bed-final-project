import { Router } from "express";
import authenticateToken, { requireHost } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";

import {
  createBookingController,
  getAllBookingsController,
  getBookingByIdController,
  getBookingsByUserIdController,
  getBookingsByPropertyIdController,
  deleteBookingController,
  updateBookingController,
  getDisabledDatesByPropertyIdController,
} from "../controllers/booking.controller.js";

const router = Router();

/* ---------------------------------------------------------
   GET DISABLED DATES FOR A PROPERTY
   --------------------------------------------------------- */
router.get("/disabled-dates/:propertyId", getDisabledDatesByPropertyIdController);

/* ---------------------------------------------------------
   GET ALL BOOKINGS FOR THE LOGGED-IN HOST
   --------------------------------------------------------- */
router.get("/host/me", authenticateToken, requireHost, async (req, res) => {
  try {
    const hostId = req.user.hostId;

    const properties = await prisma.property.findMany({
      where: { hostId },
      select: { id: true },
    });

    const propertyIds = properties.map((p) => p.id);

    const bookings = await prisma.booking.findMany({
      where: { propertyId: { in: propertyIds } },
      include: { property: true, user: true },
      orderBy: { startDate: "asc" },
    });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching host bookings:", err);
    res.status(500).json({ error: "Failed to fetch host bookings" });
  }
});

/* ---------------------------------------------------------
   HOST CONFIRMS A BOOKING
   --------------------------------------------------------- */
router.patch("/:id/confirm", authenticateToken, requireHost, async (req, res) => {
  try {
    const bookingId = req.params.id;

    // 1. Check of booking bestaat + property ophalen
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { property: true },
    });

    if (!booking) {
      return res.status(404).json({ error: "Boeking niet gevonden" });
    }

    // 2. Check of booking bij deze host hoort
    if (booking.property.hostId !== req.user.hostId) {
      return res.status(403).json({ error: "Geen toegang tot deze booking" });
    }

    // 3. Update naar CONFIRMED
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { bookingStatus: "CONFIRMED" },
    });

    return res.json({
      message: "Boeking bevestigd",
      booking: updated,
    });
  } catch (err) {
    console.error("Error confirming booking:", err);
    return res.status(500).json({ error: "Failed to confirm booking" });
  }
});


/* ---------------------------------------------------------
   HOST REJECTS A BOOKING (DELETE)
   --------------------------------------------------------- */
router.patch("/:id/reject", authenticateToken, requireHost, async (req, res) => {
  try {
    const bookingId = req.params.id;

    // 1. Check of booking bestaat + property ophalen
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { property: true },
    });

    if (!booking) {
      return res.status(404).json({ error: "Boeking niet gevonden" });
    }

    // 2. Check of booking bij deze host hoort
    if (booking.property.hostId !== req.user.hostId) {
      return res.status(403).json({ error: "Geen toegang tot deze booking" });
    }

    // 3. Verwijder de booking volledig
    const deleted = await prisma.booking.delete({
      where: { id: bookingId },
    });

    return res.json({
      message: "Boeking afgewezen en verwijderd",
      booking: deleted,
    });
  } catch (err) {
    console.error("Error rejecting booking:", err);
    return res.status(500).json({ error: "Failed to reject booking" });
  }
});


/* ---------------------------------------------------------
   CRUD ROUTES
   --------------------------------------------------------- */

// Get all bookings
router.get("/", getAllBookingsController);

// Get bookings by user
router.get("/user/:userId", getBookingsByUserIdController);

// Get bookings by property
router.get("/property/:propertyId", getBookingsByPropertyIdController);

// Get booking by ID
router.get("/:id", getBookingByIdController);

// Create booking
router.post("/", authenticateToken, createBookingController);

// Update booking
router.patch("/:id",authenticateToken, updateBookingController);
router.put("/:id",authenticateToken, updateBookingController);

// Delete booking
router.delete("/:id", authenticateToken, deleteBookingController);

export default router;
