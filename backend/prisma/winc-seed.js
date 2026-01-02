import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadJson(relativePath) {
  const fullPath = path.join(__dirname, "..", relativePath);
  const parsed = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
  const firstKey = Object.keys(parsed)[0];
  return parsed[firstKey];
}

async function main() {
  console.log("🌱 Seeding FULL WINC dataset...");

  const base = "data/MijnProjectMockData/";

  const users = loadJson(`${base}users.json`);
  const hosts = loadJson(`${base}hosts.json`);
  const properties = loadJson(`${base}properties.json`);
  const bookings = loadJson(`${base}bookings.json`);
  const reviews = loadJson(`${base}reviews.json`);
  const amenities = loadJson(`${base}amenities.json`);

  // Clear tables
  await prisma.propertyAmenity.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.property.deleteMany();
  await prisma.host.deleteMany();
  await prisma.user.deleteMany();
  await prisma.amenity.deleteMany();

  // Users
  for (const u of users) {
    await prisma.user.create({
      data: {
        id: u.id,
        username: u.username,
        password: u.password,
        name: u.name,
        email: u.email,
        phoneNumber: u.phoneNumber,
        pictureUrl: u.pictureUrl,
      },
    });
  }

  // Hosts
  for (const h of hosts) {
    await prisma.host.create({
      data: {
        id: h.id,
        username: h.username,
        password: h.password,
        name: h.name,
        email: h.email,
        phoneNumber: h.phoneNumber,
        pictureUrl: h.pictureUrl,
        aboutMe: h.aboutMe,
      },
    });
  }

  // Amenities
  for (const a of amenities) {
    await prisma.amenity.create({
      data: {
        id: a.id,
        name: a.name,
      },
    });
  }

  // Properties
  for (const p of properties) {
    await prisma.property.create({
      data: {
        id: p.id,
        title: p.title,
        description: p.description,
        location: p.location,
        pricePerNight: p.pricePerNight,
        bedroomCount: p.bedroomCount,
        bathRoomCount: p.bathRoomCount,
        maxGuestCount: p.maxGuestCount,
        rating: p.rating,
        hostId: p.hostId,
      },
    });
  }

  // Bookings
  for (const b of bookings) {
    await prisma.booking.create({
      data: {
        id: b.id,
        userId: b.userId,
        propertyId: b.propertyId,
        checkinDate: new Date(b.checkinDate),
        checkoutDate: new Date(b.checkoutDate),
        numberOfGuests: b.numberOfGuests,
        totalPrice: b.totalPrice,
        bookingStatus: b.bookingStatus,
      },
    });
  }

  // Reviews
  for (const r of reviews) {
    await prisma.review.create({
      data: {
        id: r.id,
        userId: r.userId,
        propertyId: r.propertyId,
        rating: r.rating,
        comment: r.comment,
      },
    });
  }

  console.log("✨ FULL database seeded!");
}

main()
  .catch((e) => console.error("❌ Seed error:", e))
  .finally(async () => prisma.$disconnect());
