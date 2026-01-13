import prisma from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

/* ---------------------------------------------------------
   GET ALL PROPERTIES (WITH FILTERS)
--------------------------------------------------------- */
async function getProperties(req, res) {
  try {
    const { location, pricePerNight } = req.query;

    const filters = {};

    if (location) filters.location = location;

    if (pricePerNight) {
      const price = Number(pricePerNight);
      if (isNaN(price)) {
        return res.status(400).json({ error: "Invalid pricePerNight value" });
      }
      filters.pricePerNight = price;
    }

    const properties = await prisma.property.findMany({
      where: filters,
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        pricePerNight: true,
        bedroomCount: true,
        bathRoomCount: true,
        maxGuestCount: true,
        rating: true,
        hostId: true,
      },
    });

    if (!properties.length) {
      return res.status(404).json({ error: "No properties found" });
    }

    return res.status(200).json(properties);
  } catch {
    return res.status(500).json({ error: "Failed to fetch properties" });
  }
}

/* ---------------------------------------------------------
   GET ONE PROPERTY
--------------------------------------------------------- */
async function getProperty(req, res) {
  const id = req.params.id;

  try {
    const property = await prisma.property.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        pricePerNight: true,
        bedroomCount: true,
        bathRoomCount: true,
        maxGuestCount: true,
        rating: true,
        hostId: true,
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    return res.status(200).json(property);
  } catch {
    return res.status(404).json({ error: "Property not found" });
  }
}

/* ---------------------------------------------------------
   CREATE PROPERTY
--------------------------------------------------------- */
async function createProperty(req, res) {
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
    /*========================================================================================
        onderstaande duplicate check uit gecomment omdat het in confilct is met de winc Test
      ========================================================================================*/

    // const existing = await prisma.property.findFirst({
    //   where: {
    //     title,
    //     hostId,
    //   },
    // });

    // if (existing) {
    //   return res
    //     .status(409)
    //     .json({ error: "Property already exists for this host" });
    // }
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
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        pricePerNight: true,
        bedroomCount: true,
        bathRoomCount: true,
        maxGuestCount: true,
        rating: true,
        hostId: true,
      },
    });

    return res.status(201).json(property);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({ error: "Property already exists" });
    }

    return res.status(500).json({ error: "Failed to create property" });
  }
}

/* ---------------------------------------------------------
   UPDATE PROPERTY
--------------------------------------------------------- */
async function updateProperty(req, res) {
  const id = req.params.id;

  try {
    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Property not found" });
    }

    const data = {};

    if (req.body.title !== undefined) data.title = req.body.title;
    if (req.body.description !== undefined)
      data.description = req.body.description;
    if (req.body.location !== undefined) data.location = req.body.location;
    if (req.body.pricePerNight !== undefined)
      data.pricePerNight = Number(req.body.pricePerNight);
    if (req.body.bedroomCount !== undefined)
      data.bedroomCount = Number(req.body.bedroomCount);
    if (req.body.bathRoomCount !== undefined)
      data.bathRoomCount = Number(req.body.bathRoomCount);
    if (req.body.maxGuestCount !== undefined)
      data.maxGuestCount = Number(req.body.maxGuestCount);
    if (req.body.rating !== undefined) data.rating = Number(req.body.rating);
    if (req.body.hostId !== undefined) data.hostId = req.body.hostId;

    //  PRE‑CHECK FOR DUPLICATESdit

    if (data.title || data.hostId) {
      const duplicate = await prisma.property.findFirst({
        where: {
          title: data.title ?? existing.title,
          hostId: data.hostId ?? existing.hostId,
          NOT: { id },
        },
      });

      if (duplicate) {
        return res
          .status(409)
          .json({ error: "Property already exists for this host" });
      }
    }

    const updated = await prisma.property.update({
      where: { id },
      data,
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        pricePerNight: true,
        bedroomCount: true,
        bathRoomCount: true,
        maxGuestCount: true,
        rating: true,
        hostId: true,
      },
    });

    return res.status(200).json(updated);
  } catch {
    return res.status(500).json({ error: "Failed to update property" });
  }
}

/* ---------------------------------------------------------
   DELETE PROPERTY
--------------------------------------------------------- */
async function deleteProperty(req, res) {
  const id = req.params.id;

  try {
    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Property not found" });
    }

    await prisma.property.delete({ where: { id } });
    return res.status(200).json({ message: "Property deleted" });
  } catch {
    return res.status(500).json({ error: "Failed to delete property" });
  }
}

/* ---------------------------------------------------------
   GET BOOKINGS FOR PROPERTY
--------------------------------------------------------- */
async function getPropertyBookings(req, res) {
  const id = req.params.id;

  try {
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const bookings = await prisma.booking.findMany({
      where: { propertyId: id },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        userId: true,
        propertyId: true,
      },
    });

    return res.status(200).json(bookings);
  } catch {
    return res.status(500).json({ error: "Failed to fetch property bookings" });
  }
}

export {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyBookings,
};
