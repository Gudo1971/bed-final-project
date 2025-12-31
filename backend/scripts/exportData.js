// backend/scripts/exportData.js
import pkg from "@prisma/client";
import fs from "fs";
import path from "path";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function exportJSON(filename, data) {
  const filePath = path.join(process.cwd(), filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✔ Exported ${filename}`);
}

async function run() {
  console.log("🚀 Exporting StayBnB database...");

  try {
    const users = await prisma.user.findMany();
    const hosts = await prisma.host.findMany();
    const properties = await prisma.property.findMany({
      include: {
        images: true,
        host: true,
        bookings: true,
        reviews: true,
      },
    });
    const propertyImages = await prisma.propertyImage.findMany();
    const reviews = await prisma.review.findMany();
    const bookings = await prisma.booking.findMany();

    await exportJSON("users.json", users);
    await exportJSON("hosts.json", hosts);
    await exportJSON("properties.json", properties);
    await exportJSON("propertyImages.json", propertyImages);
    await exportJSON("reviews.json", reviews);
    await exportJSON("bookings.json", bookings);

    console.log("🎉 Export complete: 6 JSON files generated in backend/");
  } catch (error) {
    console.error("❌ Export failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
