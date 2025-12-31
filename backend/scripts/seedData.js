import { PrismaClient } from '@prisma/client';
import fs from 'fs';

// Load JSON manually (works in all Node versions)
const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
const properties = JSON.parse(fs.readFileSync('./data/properties.json', 'utf8'));
const propertyImages = JSON.parse(fs.readFileSync('./data/propertyImages.json', 'utf8'));
const bookings = JSON.parse(fs.readFileSync('./data/bookings.json', 'utf8'));
const reviews = JSON.parse(fs.readFileSync('./data/reviews.json', 'utf8'));

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding StayBnB database...');

  // GOLDEN DB SAFETY
  const maybeGolden = await prisma.user.findUnique({
    where: { email: 'gbgieles@gmail.com' },
  });

  // if (maybeGolden) {
  //   console.log('❌ ABORT: This looks like your GOLDEN database.');
  //   process.exit(1);
  // }

  console.log('📊 Counts:');
  console.log(`   users:          ${users.length}`);
  console.log(`   properties:     ${properties.length}`);
  console.log(`   images:         ${propertyImages.length}`);
  console.log(`   bookings:       ${bookings.length}`);
  console.log(`   reviews:        ${reviews.length}`);

  await prisma.$transaction(async (tx) => {
    console.log('🧹 Clearing existing data...');
    await tx.review.deleteMany({});
    await tx.booking.deleteMany({});
    await tx.propertyImage.deleteMany({});
    await tx.property.deleteMany({});
    await tx.user.deleteMany({});

    console.log('👤 Seeding users...');
    await tx.user.createMany({ data: users });

    console.log('🏡 Seeding properties...');
    await tx.property.createMany({ data: properties });

    console.log('🖼️ Seeding property images...');
    await tx.propertyImage.createMany({ data: propertyImages });

    console.log('📅 Seeding bookings...');
    if (bookings.length > 0) {
      await tx.booking.createMany({ data: bookings });
    }

    console.log('⭐ Seeding reviews...');
    if (reviews.length > 0) {
      await tx.review.createMany({ data: reviews });
    }
  });

  console.log('✅ Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
