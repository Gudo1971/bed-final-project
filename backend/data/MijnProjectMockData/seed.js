import fs from "fs";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

async function main() {
  console.log("🌱 Seeding database...");

  const usersJson = readJson("./data/users.json");
  const hostsJson = readJson("./data/hosts.json");
  const propertiesJson = readJson("./data/properties.json");
  const reviewsJson = readJson("./data/reviews.json");
  const bookingsJson = readJson("./data/bookings.json");
  const amenitiesJson = readJson("./data/amenities.json");


  // 1. Clear tables in correct FK order
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.property.deleteMany();
  await prisma.host.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users (regular users)
  const createdUsers = [];

  for (const user of usersJson.users) {
    const passwordHash = await bcrypt.hash(user.password, 10);

    const created = await prisma.user.create({
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        password: passwordHash,
      },
    });

    createdUsers.push(created);
  }

  // 3. Seed Hosts (each host gets its own User)
  for (const host of hostsJson.hosts) {
    const passwordHash = await bcrypt.hash(host.password, 10);

    // Create User for Host
    const user = await prisma.user.create({
      data: {
        id: host.id, // user.id == host.id
        username: host.username,
        email: host.email,
        password: passwordHash,
      },
    });

    // Create Host profile
    await prisma.host.create({
      data: {
        id: host.id,
        name: host.name,
        userId: user.id,
      },
    });
  }

  // 4. Seed Properties (must reference existing hosts)
  for (const property of propertiesJson.properties) {
    try {
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
  },
});

    } catch (e) {
      console.error("❌ Property failed:", property);
      throw e;
    }
  }

  // 4b. Seed Amenities
for (const amenity of amenitiesJson.amenities) {
  await prisma.amenity.create({
    data: {
      id: amenity.id,
      name: amenity.name,
    },
  });
}


  // 5. Seed Listings (needed for Booking tests)
  const listing1 = await prisma.listing.create({
    data: {
      title: "Test Listing",
      description: "Seeded listing",
      price: 100,
      ownerId: createdUsers[0].id,
    },
  });

  // 6. Seed Bookings (Listing-based)
  for (const booking of bookingsJson.bookings) {
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


  // 7 Seed Reviews (Property-based)
 for (const review of reviewsJson.reviews) {
  try {
    await prisma.review.create({
      data: {
        id: review.id,
        userId: review.userId,
        propertyId: review.propertyId,
        rating: review.rating,
        comment: review.comment,
      },
    });
  } catch (e) {
    console.error("❌ Review failed:", review);
    throw e;
  }
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
