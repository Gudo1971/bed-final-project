import prisma from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

// GET ALL
export async function getProperties(req, res) {
  try {
    let properties = await prisma.property.findMany();

    properties = properties.map((p) => {
      let images = [];
      try {
        images = p.images ? JSON.parse(p.images) : [];
      } catch {
        images = [];
      }
      return {
        ...p,
        images,
      };
    });

    return res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return res.status(500).json({ error: "Failed to fetch properties" });
  }
}

// GET ONE
export async function getProperty(req, res) {
  const id = req.params.id; // geen Number()

  try {
    if (!id || typeof id !== "string") {
      return res.status(404).json({ error: "Property not found" });
    }

    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    try {
      property.images = property.images ? JSON.parse(property.images) : [];
    } catch {
      property.images = [];
    }

    return res.status(200).json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    return res.status(500).json({ error: "Failed to fetch property" });
  }
}

// CREATE
export async function createProperty(req, res) {
  try {
    const {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating,
      images,
      hostId,
    } = req.body;

    // basic body validation → 400 ipv 500 in negative tests
    if (
      !title ||
      !location ||
      !pricePerNight ||
      !bedroomCount ||
      !bathRoomCount ||
      !maxGuestCount ||
      !hostId
    ) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        location,
        // als schema nummers verwacht, laat Prisma zelf casten of valideer elders
        pricePerNight,
        bedroomCount,
        bathRoomCount,
        maxGuestCount,
        rating,
        images: JSON.stringify(images || []),
        hostId, // geen Number()
      },
    });

    return res.status(201).json(property);
  } catch (error) {
    console.error("Error creating property:", error);

    // Prisma validatiefout → 400
    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({ error: "Invalid input" });
    }

    return res.status(500).json({ error: "Failed to create property" });
  }
}

// UPDATE
export const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const updated = await prisma.property.update({
      where: { id },
      data: {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        location: req.body.location,
        pictureUrl: req.body.pictureUrl,
        hostId: req.body.hostId
      }
    });

    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};


// DELETE
export async function deleteProperty(req, res) {
  const id = req.params.id; // geen Number()

  try {
    if (!id || typeof id !== "string") {
      return res.status(404).json({ error: "Property not found" });
    }

    const existing = await prisma.property.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Property not found" });
    }

    await prisma.property.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Property deleted" });
  } catch (error) {
    console.error("Error deleting property:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(404).json({ error: "Property not found" });
    }

    return res.status(500).json({ error: "Failed to delete property" });
  }
}

// BOOKINGS FOR PROPERTY
export async function getPropertyBookings(req, res) {
  const id = req.params.id; // geen Number()

  try {
    if (!id || typeof id !== "string") {
      return res.status(404).json({ error: "Property not found" });
    }

    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const bookings = await prisma.booking.findMany({
      where: { propertyId: id },
      include: { property: true },
    });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("🔥 Prisma error in getPropertyBookings:", error);

    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({ error: "Invalid input" });
    }

    return res.status(500).json({ error: "Failed to fetch property bookings" });
  }
}
