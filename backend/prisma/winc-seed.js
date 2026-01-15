import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load JSON exactly as written, no transformations
function loadJson(relativePath) {
  const fullPath = path.join(__dirname, "..", relativePath);
  return JSON.parse(fs.readFileSync(fullPath, "utf-8"));
}

async function main() {
  console.log("🌱 Seeding FULL WINC dataset...");

  const base = "data/";

  const users = loadJson(`${base}users.json`).users;
  const hosts = loadJson(`${base}hosts.json`).hosts;
  const properties = loadJson(`${base}properties.json`).properties;
  const bookings = loadJson(`${base}bookings.json`).bookings;
  const reviews = loadJson(`${base}reviews.json`).reviews;
  const amenities = loadJson(`${base}amenities.json`).amenities;

  // Clear tables in correct order
  await prisma.propertyAmenity.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.property.deleteMany();
  await prisma.host.deleteMany();
  await prisma.user.deleteMany();
  await prisma.amenity.deleteMany();

  // Users
  for (const u of users) {
    await prisma.user.create({ data: u });
  }

  // Hosts
  for (const h of hosts) {
    await prisma.host.create({ data: h });
  }

  // Amenities
  for (const a of amenities) {
    await prisma.amenity.create({ data: a });
  }

  // Properties
  for (const p of properties) {
    await prisma.property.create({ data: p });
  }

  // Bookings (with validation)
  console.log("📦 First booking in JSON:", bookings[0]);

  for (const b of bookings) {
    const userExists = await prisma.user.findUnique({
      where: { id: b.userId },
    });
    const propertyExists = await prisma.property.findUnique({
      where: { id: b.propertyId },
    });

    if (!userExists || !propertyExists) {
      console.log(`❌ Skipped booking ${b.id} (missing FK):`, {
        userExists: !!userExists,
        propertyExists: !!propertyExists,
      });
      continue;
    }

    await prisma.booking.create({
      data: {
        ...b,
        checkinDate: new Date(b.checkinDate),
        checkoutDate: new Date(b.checkoutDate),
      },
    });
  }

  // Reviews (with validation)
  for (const r of reviews) {
    const userExists = await prisma.user.findUnique({
      where: { id: r.userId },
    });
    const propertyExists = await prisma.property.findUnique({
      where: { id: r.propertyId },
    });

    if (!userExists || !propertyExists) {
      console.log(`❌ Skipped review ${r.id} (missing FK)`);
      continue;
    }

    await prisma.review.create({ data: r });
  }

  console.log("✨ FULL database seeded!");
}

main()
  .catch((e) => console.error("❌ Seed error:", e))
  .finally(async () => prisma.$disconnect());
