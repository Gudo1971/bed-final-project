import pkg from "@prisma/client";
import fs from "fs";
import path from "path";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

function loadJSON(filename) {
  const filePath = path.join(process.cwd(), "data", "MijnProjectMockData", filename);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

async function run() {
  console.log("🌱 Seeding StayBnB database...");

  try {
    // Load JSON
    const users = loadJSON("users.json");
    const hosts = loadJSON("hosts.json");
    const properties = loadJSON("properties.json");
    const propertyImages = loadJSON("propertyImages.json");
    const reviews = loadJSON("reviews.json");
    const bookings = loadJSON("bookings.json");

    // Clear DB
    await prisma.review.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.propertyImage.deleteMany();
    await prisma.property.deleteMany();
    await prisma.user.deleteMany();
    await prisma.host.deleteMany();

    console.log("✔ Database cleared");

    // Insert flat tables
    await prisma.user.createMany({ data: users });
    await prisma.host.createMany({ data: hosts });

    // Properties must be flattened (remove nested arrays)
    const flatProperties = properties.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      location: p.location,
      pricePerNight: p.pricePerNight,
      bedroomCount: p.bedroomCount,
      bathRoomCount: p.bathRoomCount,
      maxGuestCount: p.maxGuestCount,
      rating: p.rating,
      isActive: p.isActive,
      hostEmail: p.hostEmail
    }));

    await prisma.property.createMany({ data: flatProperties });

    await prisma.propertyImage.createMany({ data: propertyImages });
    await prisma.review.createMany({ data: reviews });
    await prisma.booking.createMany({ data: bookings });

    console.log("🎉 Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
