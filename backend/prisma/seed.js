import fs from "fs";
import bcrypt from "bcrypt";
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

async function main() {
  console.log("🌱 Seeding database...");

  // Load JSON files
  const users = loadJson("data/users.json");
  const hosts = loadJson("data/hosts.json");
  const properties = loadJson("data/properties.json");
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
        password: await bcrypt.hash(user.password, 10),
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
  // 3A — check if user exists
  let user = await prisma.user.findUnique({
    where: { email: host.email },
  });

  // 3B — if no user exists → create one
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: host.email,
        username: host.username,
        name: host.name,
        password: await bcrypt.hash(host.password, 10),
        phoneNumber: host.phoneNumber,
        pictureUrl: host.pictureUrl,
        aboutMe: host.aboutMe,
      },
    });
  }

  // 3C — create host record
  await prisma.host.create({
    data: {
      id: host.id,
      username: host.username,
      password: await bcrypt.hash(host.password, 10),
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
      hostId: property.hostId,
      isActive: true,
      images: {
        create: Array.isArray(property.images)
          ? property.images.map((url) => ({ url }))
          : [], 
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
        startDate: new Date(booking.checkinDate),
        endDate: new Date(booking.checkoutDate),
        numberOfGuests: booking.numberOfGuests,
        totalPrice: booking.totalPrice,
        bookingStatus: booking.bookingStatus,
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
