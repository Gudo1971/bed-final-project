// ==============================================
// = PROPERTY CONTROLLER                         =
// ==============================================

import prisma from "../lib/prisma.js";

/* ============================================================
   HELPER: haal hostEmail dynamisch op via JWT
============================================================ */
function getHostEmail(req) {
  return req.user?.email || null;
}

/* ============================================================
   GET ALL PROPERTIES (PUBLIC)
   ⭐ FIX: reviews toegevoegd zodat PropertyCard rating kan tonen
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
            aboutMe: true,
          },
        },

        // ⭐ DIT IS DE FIX
        reviews: {
          select: {
            rating: true,
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
   (Deze was al goed — reviews zaten er al in)
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
            aboutMe: true,
            phoneNumber: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                pictureUrl: true,
                phoneNumber: true,
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

    const hostEmail = getHostEmail(req);
    if (!hostEmail) {
      return res.status(403).json({ error: "Je bent geen host" });
    }

    const host = await prisma.host.findUnique({
      where: { email: hostEmail },
    });

    if (!host) {
      return res.status(403).json({ error: "Je bent geen host" });
    }

    const uploadedImages = req.files?.map((file) => file.path) || [];

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

        host: {
          connect: { email: hostEmail },
        },

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
   UPDATE PROPERTY (PATCH — WITH IMAGES)
============================================================ */
export async function updateProperty(req, res) {
  try {
    const { id } = req.params;
    const hostEmail = getHostEmail(req);

    const property = await prisma.property.findUnique({ where: { id } });

    if (!property || property.hostEmail !== hostEmail) {
      return res.status(403).json({ error: "Geen toegang tot deze property" });
    }

    const newImages = req.files?.map((file) => file.path) || [];

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
   UPDATE PROPERTY (PUT — JSON ONLY)
============================================================ */
export const updatePropertyJson = async (req, res) => {
  try {
    const id = req.params.id;
    const hostEmail = getHostEmail(req);

    const existing = await prisma.property.findUnique({ where: { id } });

    if (!existing || existing.hostEmail !== hostEmail) {
      return res.status(403).json({ error: "Geen toegang tot deze property" });
    }

    const {
      title,
      location,
      pricePerNight,
      description,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating,
    } = req.body;

    const updated = await prisma.property.update({
      where: { id },
      data: {
        title,
        location,
        description,
        pricePerNight: Number(pricePerNight),
        bedroomCount: Number(bedroomCount),
        bathRoomCount: Number(bathRoomCount),
        maxGuestCount: Number(maxGuestCount),
        rating: Number(rating),
      },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("❌ UPDATE PROPERTY JSON ERROR:", error);
    return res.status(500).json({ error: "Kon property niet bijwerken" });
  }
};

/* ============================================================
   DELETE PROPERTY (HOST ONLY)
============================================================ */
export async function deleteProperty(req, res) {
  console.log("🔍 JWT user:", req.user);

  try {
    const { id } = req.params;
    const hostEmail = getHostEmail(req);
    console.log("🔍 hostEmail uit JWT:", hostEmail);

    const property = await prisma.property.findUnique({
      where: { id },
    });

    console.log("🔍 Gevonden property:", {
      id: property?.id,
      hostEmail: property?.hostEmail,
    });

    if (!property) {
      return res.status(404).json({ error: "Property niet gevonden" });
    }

    if (property.hostEmail !== hostEmail) {
      console.log("❌ MISMATCH:", {
        propertyHostEmail: property.hostEmail,
        jwtEmail: hostEmail,
      });

      return res
        .status(403)
        .json({ error: "Geen toegang tot deze property" });
    }

    const bookings = await prisma.booking.findMany({
      where: { propertyId: id },
    });

    console.log("🔍 Aantal bookings:", bookings.length);

    if (bookings.length > 0) {
      return res.status(400).json({
        message:
          "Deze accommodatie heeft nog reserveringen. Zet de accommodatie eerst inactief. Geaccepteerde boekingen kunnen niet worden verwijderd; pas nadat alle geplande reserveringen zijn afgelopen kun je de accommodatie verwijderen.",
      });
    }

    await prisma.propertyImage.deleteMany({ where: { propertyId: id } });
    await prisma.property.delete({ where: { id } });

    console.log("✅ Property verwijderd:", id);

    return res.status(200).json({ message: "Property succesvol verwijderd" });
  } catch (error) {
    console.error("❌ Error deleting property:", error);
    return res.status(500).json({ message: "Failed to delete property" });
  }
};

/* ============================================================
   GET BOOKINGS FOR PROPERTY (HOST ONLY)
============================================================ */
export async function getPropertyBookings(req, res) {
  try {
    const { id } = req.params;
    const hostEmail = getHostEmail(req);

    const property = await prisma.property.findUnique({ where: { id } });

    if (!property || property.hostEmail !== hostEmail) {
      return res.status(403).json({ error: "Geen toegang tot deze property" });
    }

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

/* ============================================================
   DELETE PROPERTY IMAGE
============================================================ */
export async function deletePropertyImage(req, res) {
  try {
    const { propertyId, imageId } = req.params;
    const hostEmail = getHostEmail(req);

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property || property.hostEmail !== hostEmail) {
      return res.status(403).json({ error: "Geen toegang tot deze property" });
    }

    const image = await prisma.propertyImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return res.status(404).json({ error: "Afbeelding niet gevonden" });
    }

    await prisma.propertyImage.delete({ where: { id: imageId } });

    return res.status(200).json({ message: "Foto verwijderd" });
  } catch (error) {
    console.error("❌ Error deleting image:", error);
    return res.status(500).json({ error: "Failed to delete image" });
  }
}
