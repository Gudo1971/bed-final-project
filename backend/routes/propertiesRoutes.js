import express from "express";
import prisma from "../lib/prisma.js";
import { validate as isUuid } from "uuid";
import { checkJwt } from "../middleware/auth0Middleware.js";

const router = express.Router();

/* -------------------------------------------
   GET /properties
------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      include: { images: true },
    });
    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   GET /properties/host/me  (protected)
------------------------------------------- */
router.get("/host/me", checkJwt, async (req, res) => {
  try {
    const rawSub = req.auth?.payload?.sub;

    const user = await prisma.user.findUnique({
      where: { auth0Id: rawSub },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.isHost) {
      return res.status(403).json({ error: "User is not a host" });
    }

    const properties = await prisma.property.findMany({
      where: { userId: user.id },   // <-- FIXED
      include: { images: true },
    });

    return res.json(properties);
  } catch (err) {
    console.error("Error fetching host properties:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* -------------------------------------------
   POST /properties/host/me  (protected)
------------------------------------------- */
router.post("/host/me", checkJwt, async (req, res) => {
  try {
    const { title, description, pricePerNight, pictureUrl, Location } = req.body;

    if (!title || !pricePerNight) {
      return res.status(400).json({
        error: "Title and pricePerNight are required",
      });
    }

    const rawSub = req.auth?.payload?.sub;

    if (!rawSub) {
      return res.status(401).json({ error: "Unauthorized: missing sub in token" });
    }

    const isGoogleSub = rawSub.startsWith("google-oauth2|");
    const auth0Id = isGoogleSub ? `auth0|${rawSub.split("|")[1]}` : rawSub;

    const user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.isHost) {
      return res.status(403).json({ error: "User is not a host" });
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        pricePerNight,
        pictureUrl,
        userId: user.id,            // <-- FIXED
        location: Location ?? null,
      },
    });

    return res.status(201).json(property);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   POST /properties/:id/images
------------------------------------------- */
router.post("/:id/images", async (req, res) => {
  const propertyId = req.params.id;
  const { url, publicId, order } = req.body;

  if (!isUuid(propertyId)) {
    return res.status(400).json({ error: "Invalid property ID format" });
  }

  if (!url || !publicId) {
    return res.status(400).json({ error: "Missing url or publicId" });
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const image = await prisma.propertyImage.create({
      data: {
        propertyId,
        url,
        publicId,
        order: order ?? 0,
      },
    });

    res.status(201).json(image);
  } catch (error) {
    console.error("Error saving property image:", error);
    res.status(500).json({ error: "Failed to save property image" });
  }
});

/* -------------------------------------------
   GET /properties/:id/bookings
------------------------------------------- */
router.get("/:id/bookings", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid property ID format" });
  }

  try {
    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const bookings = await prisma.booking.findMany({
      where: { propertyId: id },
      include: { user: true },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching property bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   GET /properties/:id
------------------------------------------- */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid property ID format" });
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: "asc" } },
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   DELETE /properties/:id
------------------------------------------- */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid property ID format" });
  }

  try {
    await prisma.property.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting property:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
