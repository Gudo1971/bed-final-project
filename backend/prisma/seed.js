import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // --- USERS ---
  const user = await prisma.user.upsert({
    where: { username: "gudo" },
    update: {},
    create: {
      username: "gudo",
      password: "S4@rt89nj",
      name: "Gudo Gieles",
      email: "gudo@example.com",
      phoneNumber: "1234567890",
      pictureUrl: "https://picsum.photos/200"
    }
  });

  const user1 = await prisma.user.upsert({
    where: { username: "john_doe" },
    update: {},
    create: {
      username: "john_doe",
      password: "password123",
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "1234567890",
      pictureUrl: "https://picsum.photos/200"
    }
  });

  const user2 = await prisma.user.upsert({
    where: { username: "jane_smith" },
    update: {},
    create: {
      username: "jane_smith",
      password: "password123",
      name: "Jane Smith",
      email: "jane@example.com",
      phoneNumber: "0987654321",
      pictureUrl: "https://picsum.photos/200"
    }
  });

  // --- HOSTS ---
  const host1 = await prisma.host.upsert({
    where: { username: "host_maria" },
    update: {},
    create: {
      username: "host_maria",
      password: "password123",
      name: "Maria Host",
      email: "maria@example.com",
      phoneNumber: "1112223333",
      pictureUrl: "https://picsum.photos/200",
      aboutMe: "I love hosting guests from all over the world!"
    }
  });

  // --- PROPERTIES ---
  let property1 = await prisma.property.findFirst({
    where: { title: "Cozy Apartment in Groningen" }
  });

  if (!property1) {
    property1 = await prisma.property.create({
      data: {
        hostId: host1.id,
        title: "Cozy Apartment in Groningen",
        description: "A lovely apartment near the city center.",
        location: "Groningen",
        pricePerNight: 89.99,
        bedroomCount: 2,
        bathRoomCount: 1,
        maxGuestCount: 4,
        rating: 5
      }
    });
  }

  console.log("Property ID:", property1.id);

  let property2 = await prisma.property.findFirst({
    where: { title: "Spacious Loft" }
  });

  if (!property2) {
    property2 = await prisma.property.create({
      data: {
        hostId: host1.id,
        title: "Spacious Loft",
        description: "Modern loft with great views.",
        location: "Groningen",
        pricePerNight: 120.00,
        bedroomCount: 1,
        bathRoomCount: 1,
        maxGuestCount: 2,
        rating: 4
      }
    });
  }

  // --- BOOKINGS ---
  let booking1 = await prisma.booking.findFirst({
    where: {
      userId: user1.id,
      propertyId: property1.id
    }
  });

  if (!booking1) {
    booking1 = await prisma.booking.create({
      data: {
        userId: user1.id,
        propertyId: property1.id,
        checkinDate: new Date("2025-01-10"),
        checkoutDate: new Date("2025-01-15"),
        numberOfGuests: 2,
        totalPrice: 450,
        bookingStatus: "confirmed"
      }
    });
  }

  // --- REVIEWS ---
  let review1 = await prisma.review.findFirst({
    where: {
      userId: user1.id,
      propertyId: property1.id
    }
  });

  if (!review1) {
    review1 = await prisma.review.create({
      data: {
        userId: user1.id,
        propertyId: property1.id,
        rating: 5,
        comment: "Amazing stay! Highly recommended."
      }
    });
  }

  let review2 = await prisma.review.findFirst({
    where: {
      userId: user2.id,
      propertyId: property1.id
    }
  });

  if (!review2) {
    review2 = await prisma.review.create({
      data: {
        userId: user2.id,
        propertyId: property1.id,
        rating: 4,
        comment: "Very nice place, would stay again."
      }
    });
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
