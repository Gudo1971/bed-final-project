import express from "express";
import prisma from "../lib/prisma.js";
import { validate as isUuid } from "uuid";

const router = express.Router();

// ✅ POST /bookings — nieuwe booking aanmaken
router.post("/", async (req, res) => {
   console.log("REQ BODY RECEIVED:", req.body);  
  try {
    const {
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
    } = req.body;

    // ✅ Validatie
    if (!userId || !propertyId || !checkinDate || !checkoutDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!isUuid(userId) || !isUuid(propertyId)) {
      return res.status(400).json({ error: "Invalid UUID format" });
    }

    // ✅ Bestaat user?
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Bestaat property?
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!property)
      return res.status(404).json({ error: "Property not found" });

    // ✅ Booking aanmaken
    const booking = await prisma.booking.create({
      data: {
        userId,
        propertyId,
        checkinDate: new Date(checkinDate),
        checkoutDate: new Date(checkoutDate),
        numberOfGuests: numberOfGuests || 1,
        totalPrice: totalPrice || 0,
        bookingStatus: "pending",
      },
    });

    res.json({
      message: "Booking created",
      booking,
    });
  } catch (error) {
  console.error("Error creating booking:", error);

  if (error.code === "P2003") {
    return res.status(400).json({ error: "Foreign key constraint failed — user or property not found" });
  }

  res.status(500).json({ error: error.message });
}
});

// ✅ GET /bookings — alle bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany();
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ GET /properties/:id/bookings — bookings per property
router.get("/property/:id", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid property ID format" });
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const bookings = await prisma.booking.findMany({
      where: { propertyId: id },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings for property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// ✅ GET /users/:id/bookings — bookings per user
router.get("/user/:id", async (req, res) => {
  console.log("REQ BODY:", req.body);
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: id },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings for user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ GET /bookings/:id — één booking via UUID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid booking ID format" });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
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



export default router;
