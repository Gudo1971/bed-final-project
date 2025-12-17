import express from "express";
import prisma from "../lib/prisma.js";
import { validate as isUuid } from "uuid";

const router = express.Router();

/* -------------------------------------------
   GET /properties
------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const properties = await prisma.property.findMany();
    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   GET /properties/:id/bookings  (specifiek → boven /:id)
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
      include: {
        user: true,
      },
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
    const property = await prisma.property.findUnique({ where: { id } });

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
   POST /properties
------------------------------------------- */
router.post("/", async (req, res) => {
  const { title, description, pricePerNight, hostId, pictureUrl } = req.body;

  if (!title || !pricePerNight || !hostId) {
    return res.status(400).json({
      error: "Title, pricePerNight and hostId are required",
    });
  }

  if (!isUuid(hostId)) {
    return res.status(400).json({ error: "Invalid host ID format" });
  }

  try {
    const host = await prisma.host.findUnique({ where: { id: hostId } });

    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    const newProperty = await prisma.property.create({
      data: { title, description, pricePerNight, hostId, pictureUrl },
    });

    res.status(201).json(newProperty);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   PUT /properties/:id
------------------------------------------- */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, pricePerNight, pictureUrl } = req.body;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid property ID format" });
  }

  try {
    const updated = await prisma.property.update({
      where: { id },
      data: { title, description, pricePerNight, pictureUrl },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating property:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Property not found" });
    }

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
