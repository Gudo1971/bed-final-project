import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/* ============================================================
   GET ALL PROPERTIES (PUBLIC)
============================================================ */
export async function getProperties(req, res) {
  try {
    const properties = await prisma.property.findMany({
      include: {
        images: true,
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            pictureUrl: true,
          },
        },
      },
    });

    return res.status(200).json(properties);
  } catch (error) {
    console.error("❌ Error fetching properties:", error);
    return res.status(500).json({ error: "Failed to fetch properties" });
  }
}

/* ============================================================
   GET SINGLE PROPERTY (PUBLIC)
============================================================ */
export async function getProperty(req, res) {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: true,
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            pictureUrl: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                pictureUrl: true,
              },
            },
          },
        },
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    return res.status(200).json(property);
  } catch (error) {
    console.error("❌ Error fetching property:", error);
    return res.status(500).json({ error: "Failed to fetch property" });
  }
}

/* ============================================================
   CREATE PROPERTY (HOST ONLY)
============================================================ */
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
    } = req.body;

    // 1. Validatie
    if (
      !title ||
      !location ||
      !pricePerNight ||
      !bedroomCount ||
      !bathRoomCount ||
      !maxGuestCount
    ) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // 2. Host ophalen via email (Users en Hosts zijn gescheiden)
    const host = await prisma.host.findUnique({
      where: { email: req.user.email },
    });

    if (!host) {
      return res.status(403).json({ error: "Je bent geen host" });
    }

    // 3. Cloudinary images
    const uploadedImages = req.files?.map((file) => file.path) || [];

    // 4. Property aanmaken
    const property = await prisma.property.create({
      data: {
        title,
        description,
        location,
        pricePerNight: Number(pricePerNight),
        bedroomCount: Number(bedroomCount),
        bathRoomCount: Number(bathRoomCount),
        maxGuestCount: Number(maxGuestCount),
        rating: 0,
        hostId: host.id,

        images: {
          create: uploadedImages.map((url) => ({ url })),
        },
      },
      include: { images: true },
    });

    return res.status(201).json(property);
  } catch (error) {
    console.error("❌ Error creating property:", error);
    return res.status(500).json({ error: "Failed to create property" });
  }
}

/* ============================================================
   UPDATE PROPERTY (HOST ONLY)
============================================================ */
export async function updateProperty(req, res) {
  try {
    const { id } = req.params;

    // 1. Host ophalen via email
    const host = await prisma.host.findUnique({
      where: { email: req.user.email },
    });

    if (!host) {
      return res.status(403).json({ error: "Je bent geen host" });
    }

    // 2. Check of property van deze host is
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property || property.hostId !== host.id) {
      return res.status(403).json({ error: "Geen toegang tot deze property" });
    }

    // 3. Nieuwe images (optioneel)
    const newImages = req.files?.map((file) => file.path) || [];

    // 4. Property updaten
    const updated = await prisma.property.update({
      where: { id },
      data: {
        ...req.body,
        pricePerNight: req.body.pricePerNight
          ? Number(req.body.pricePerNight)
          : property.pricePerNight,

        images: newImages.length
          ? {
              create: newImages.map((url) => ({ url })),
            }
          : undefined,
      },
      include: { images: true },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("❌ Error updating property:", error);
    return res.status(500).json({ error: "Failed to update property" });
  }
}

/* ============================================================
   DELETE PROPERTY (HOST ONLY)
============================================================ */
export async function deleteProperty(req, res) {
  try {
    const { id } = req.params;

    // 1. Host ophalen via email
    const host = await prisma.host.findUnique({
      where: { email: req.user.email },
    });

    if (!host) {
      return res.status(403).json({ error: "Je bent geen host" });
    }

    // 2. Check of property van deze host is
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property || property.hostId !== host.id) {
      return res.status(403).json({ error: "Geen toegang tot deze property" });
    }

    // 3. Verwijderen
    await prisma.property.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Property deleted" });
  } catch (error) {
    console.error("❌ Error deleting property:", error);
    return res.status(500).json({ error: "Failed to delete property" });
  }
}

/* ============================================================
   GET BOOKINGS FOR PROPERTY (HOST ONLY)
============================================================ */
export async function getPropertyBookings(req, res) {
  try {
    const { id } = req.params;

    // 1. Host ophalen via email
    const host = await prisma.host.findUnique({
      where: { email: req.user.email },
    });

    if (!host) {
      return res.status(403).json({ error: "Je bent geen host" });
    }

    // 2. Check of property van deze host is
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property || property.hostId !== host.id) {
      return res.status(403).json({ error: "Geen toegang tot deze property" });
    }

    // 3. Boekingen ophalen
    const bookings = await prisma.booking.findMany({
      where: { propertyId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            pictureUrl: true,
          },
        },
      },
    });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
}
