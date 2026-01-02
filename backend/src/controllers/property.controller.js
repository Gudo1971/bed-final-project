import prisma from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

// GET ALL
export async function getProperties(req, res) {
  try {
    const properties = await prisma.property.findMany();
    res.status(200).json(properties);
  } catch {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
}

// GET ONE
export async function getProperty(req, res) {
  const id = req.params.id;

  try {
    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json(property);
  } catch {
    res.status(404).json({ error: "Property not found" });
  }
}

// CREATE
export async function createProperty(req, res) {
  const {
    title,
    description,
    location,
    pricePerNight,
    bedroomCount,
    bathRoomCount,
    maxGuestCount,
    rating,
    hostId,
  } = req.body;

  if (
    !title ||
    !location ||
    pricePerNight == null ||
    bedroomCount == null ||
    bathRoomCount == null ||
    maxGuestCount == null ||
    !hostId
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const host = await prisma.host.findUnique({ where: { id: hostId } });
    if (!host) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        location,
        pricePerNight: Number(pricePerNight),
        bedroomCount: Number(bedroomCount),
        bathRoomCount: Number(bathRoomCount),
        maxGuestCount: Number(maxGuestCount),
        rating: rating != null ? Number(rating) : null,
        hostId,
      },
    });

    res.status(201).json(property);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      res.status(400).json({ error: "Invalid input" });
    } else {
      res.status(500).json({ error: "Failed to create property" });
    }
  }
}

// UPDATE
export async function updateProperty(req, res) {
  const id = req.params.id;

  try {
    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Property not found" });
    }

    const data = {};
    if (req.body.title !== undefined) data.title = req.body.title;
    if (req.body.description !== undefined) data.description = req.body.description;
    if (req.body.location !== undefined) data.location = req.body.location;
    if (req.body.pricePerNight !== undefined) data.pricePerNight = Number(req.body.pricePerNight);
    if (req.body.bedroomCount !== undefined) data.bedroomCount = Number(req.body.bedroomCount);
    if (req.body.bathRoomCount !== undefined) data.bathRoomCount = Number(req.body.bathRoomCount);
    if (req.body.maxGuestCount !== undefined) data.maxGuestCount = Number(req.body.maxGuestCount);
    if (req.body.rating !== undefined) data.rating = Number(req.body.rating);
    if (req.body.hostId !== undefined) data.hostId = req.body.hostId;

    const updated = await prisma.property.update({
      where: { id },
      data,
    });

    res.status(200).json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update property" });
  }
}

// DELETE
export async function deleteProperty(req, res) {
  const id = req.params.id;

  try {
    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Property not found" });
    }

    await prisma.property.delete({ where: { id } });
    res.status(200).json({ message: "Property deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete property" });
  }
}

// BOOKINGS FOR PROPERTY
export async function getPropertyBookings(req, res) {
  const id = req.params.id;

  try {
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const bookings = await prisma.booking.findMany({
      where: { propertyId: id },
      include: { property: true },
    });

    res.status(200).json(bookings);
  } catch {
    res.status(500).json({ error: "Failed to fetch property bookings" });
  }
}
