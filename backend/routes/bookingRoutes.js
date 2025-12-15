import express from "express";
import prisma from "../lib/prisma.js";
import { validate as isUuid } from "uuid";

const router = express.Router();
// ✅ POST /bookings — nieuwe booking aanmaken
router.post("/", async (req, res) => {
  console.log("REQ BODY RECEIVED:", req.body);

  try {
    const {
      userAuth0Id,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
    } = req.body;

    if (!userAuth0Id || !propertyId || !checkinDate || !checkoutDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ User ophalen via Auth0 ID
    let user = await prisma.user.findUnique({
      where: { auth0Id: userAuth0Id }
    });

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

    // ✅ Booking aanmaken
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        propertyId,
        checkinDate: new Date(checkinDate),
        checkoutDate: new Date(checkoutDate),
        numberOfGuests: Number(numberOfGuests), // ✅ FIXED
        totalPrice,
        bookingStatus: "pending",
      },
    });

    res.json({ message: "Booking created", booking });

  } catch (err) {
    console.error("Error creating booking:", err);

    if (err.code === "P2003") {
      return res.status(400).json({
        error: "Foreign key constraint failed — user or property not found",
      });
    }

    res.status(500).json({ error: err.message });
  }
});



  

// ✅ GET bookings by Auth0 ID
router.get("/user/:auth0Id", async (req, res) => {
  const { auth0Id } = req.params;

  try {
    // ✅ Zoek user op auth0Id
    let user = await prisma.user.findUnique({
      where: { auth0Id }
    });

    // ✅ Als user niet bestaat → maak hem aan
    if (!user) {
      user = await prisma.user.create({
        data: {
          auth0Id,
          email: `${auth0Id}@unknown.com`,
          username: auth0Id,
          password: "auth0",
          name: "Auth0 User",
          phoneNumber: "",
          pictureUrl: ""
        }
      });
    }

    // ✅ Haal bookings op
    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: { property: true }
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
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

// ✅ GET /bookings/property/:id — bookings per property
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

// ✅ GET /bookings/user-id/:id — bookings per userId (UUID)
router.get("/user-id/:id", async (req, res) => {
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
