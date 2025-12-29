import { Router } from "express";
import authenticateToken from "../middleware/auth.middleware.js";
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

/* ============================================================
   HELPER: haal hostId dynamisch op via email
============================================================ */
async function getHostId(req) {
  const host = await prisma.host.findUnique({
    where: { email: req.user.email },
  });
  return host?.id || null;
}

/* ============================================================
   GET DISABLED DATES FOR A PROPERTY (public)
============================================================ */
router.get("/disabled-dates/:propertyId", getDisabledDatesByPropertyIdController);

/* ============================================================
   GET BOOKINGS FOR LOGGED-IN HOST
   - thumbnails werken nu
   - geen select/include conflict meer
   - geen 500 errors meer
============================================================ */
router.get("/host/me", authenticateToken, async (req, res) => {
  try {
    const hostEmail = req.user.email;

    // 1. Haal alle properties van deze host op
    const properties = await prisma.property.findMany({
      where: { hostEmail: hostEmail }
      // ❗ Geen select hier → anders crasht Prisma bij include
    });

    const propertyIds = properties.map((p) => p.id);

    // 2. Haal alle bookings op voor deze properties
    const bookings = await prisma.booking.findMany({
      where: {
        propertyId: { in: propertyIds },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            pictureUrl: true,
          },
        },
        property: {
          include: {
            images: true, // ⭐ FIX: thumbnails komen nu mee
          },
        },
      },
    });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("❌ Error fetching host bookings:", error);
    return res.status(500).json({ error: "Failed to fetch host bookings" });
  }
});

/* ============================================================
   CONFIRM BOOKING (HOST ONLY)
============================================================ */
router.patch("/:id/confirm", authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const hostEmail = req.user.email;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { property: true },
    });

    if (!booking) {
      return res.status(404).json({ error: "Boeking niet gevonden" });
    }

    if (booking.property.hostEmail !== hostEmail) {
      return res.status(403).json({ error: "Geen toegang tot deze booking" });
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { bookingStatus: "CONFIRMED" },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("❌ Error confirming booking:", error);
    return res.status(500).json({ error: "Failed to confirm booking" });
  }
});

/* ============================================================
   REJECT BOOKING (HOST ONLY)
============================================================ */
router.patch("/:id/reject", authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const hostEmail = req.user.email;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { property: true },
    });

    if (!booking) {
      return res.status(404).json({ error: "Boeking niet gevonden" });
    }

    if (booking.property.hostEmail !== hostEmail) {
      return res.status(403).json({ error: "Geen toegang tot deze booking" });
    }

    await prisma.booking.delete({
      where: { id: bookingId },
    });

    return res.status(200).json({ message: "Boeking afgewezen en verwijderd" });
  } catch (error) {
    console.error("❌ Error rejecting booking:", error);
    return res.status(500).json({ error: "Failed to reject booking" });
  }
});

/* ============================================================
   CRUD ROUTES
============================================================ */
router.get("/", getAllBookingsController);
router.get("/user/:userId", getBookingsByUserIdController);
router.get("/property/:propertyId", getBookingsByPropertyIdController);
router.get("/:id", getBookingByIdController);
router.post("/", authenticateToken, createBookingController);
router.patch("/:id", authenticateToken, updateBookingController);
router.put("/:id", authenticateToken, updateBookingController);
router.delete("/:id", authenticateToken, deleteBookingController);

export default router;
