import fs from "fs";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import path from "path";

const prisma = new PrismaClient();

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load JSON with wrapper keys
function loadJson(relativePath) {
  const fullPath = path.join(__dirname, "..", relativePath);
  const parsed = JSON.parse(fs.readFileSync(fullPath, "utf-8"));

  if (typeof parsed === "object" && !Array.isArray(parsed)) {
    const firstKey = Object.keys(parsed)[0];
    return parsed[firstKey];
  }

  return parsed;
}

// Helper: detect if password is already hashed
function resolvePassword(password) {
  return password.startsWith("$2b$")
    ? password
    : bcrypt.hash(password, 10);
}

async function main() {
  console.log("🌱 Seeding database...");

  // Load JSON files
  const users = loadJson("data/users.json");
  const hosts = loadJson("data/hosts.json");
  const properties = loadJson("data/properties.json");
  const propertyImages = loadJson("data/propertyImages.json");
  const reviews = loadJson("data/reviews.json");
  const bookings = loadJson("data/bookings.json");

  // 1. Clear tables in correct FK order
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.host.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users
  for (const user of users) {
    await prisma.user.create({
      data: {
        id: user.id,
        username: user.username,
        password: await resolvePassword(user.password),
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        pictureUrl: user.pictureUrl,
        aboutMe: user.aboutMe,
      },
    });
  }

  // 3. Seed Hosts — ensure every host has a matching user
  for (const host of hosts) {
    let user = await prisma.user.findUnique({
      where: { email: host.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: host.email,
          username: host.username,
          name: host.name,
          password: await resolvePassword(host.password),
          phoneNumber: host.phoneNumber,
          pictureUrl: host.pictureUrl,
          aboutMe: host.aboutMe,
        },
      });
    }

    await prisma.host.create({
      data: {
        id: host.id,
        username: host.username,
        password: await resolvePassword(host.password),
        name: host.name,
        email: host.email,
        phoneNumber: host.phoneNumber,
        pictureUrl: host.pictureUrl,
        aboutMe: host.aboutMe,
      },
    });
  }

  // 4. Seed Properties + PropertyImages
  for (const property of properties) {
    const host = hosts.find((h) => h.email === property.hostEmail);

    if (!host) {
      console.warn(`⚠️ Property ${property.id} has no matching hostEmail`);
      continue;
    }

    // Zoek alle images die bij deze property horen
    const imagesForProperty = propertyImages
      .filter((img) => img.propertyId === property.id)
      .map((img) => ({
        url: img.url.replace(/:$/, ""), // trailing ":" fix
      }));

    await prisma.property.create({
      data: {
        id: property.id,
        title: property.title,
        description: property.description,
        location: property.location,
        pricePerNight: property.pricePerNight,
        bedroomCount: property.bedroomCount,
        bathRoomCount: property.bathRoomCount,
        maxGuestCount: property.maxGuestCount,
        rating: property.rating,
        hostEmail: property.hostEmail,
        isActive: true,

        images: {
          create: imagesForProperty,
        },
      },
    });
  }

  // 5. Seed Bookings
  for (const booking of bookings) {
    await prisma.booking.create({
      data: {
        id: booking.id,
        userId: booking.userId,
        propertyId: booking.propertyId,
        startDate: new Date(booking.startDate),
        endDate: new Date(booking.endDate),
        numberOfGuests: booking.numberOfGuests,
        totalPrice: booking.totalPrice,
        bookingStatus: booking.bookingStatus.toLowerCase(),
      },
    });
  }

  // 6. Seed Reviews
  for (const review of reviews) {
    await prisma.review.create({
      data: {
        id: review.id,
        userId: review.userId,
        propertyId: review.propertyId,
        rating: review.rating,
        comment: review.comment,
      },
    });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
