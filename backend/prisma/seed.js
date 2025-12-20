import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ============================================================
  // 1. USERS (hosts zitten hier ook tussen!)
  // ============================================================
  await prisma.user.createMany({
    data: [
      {
        username: "jdoe",
        password: "password123",
        name: "John Doe",
        email: "johndoe@example.com",
        phoneNumber: "123-456-7890",
        pictureUrl: "https://wincacademy.github.io/webpages/media/johndoe.jpeg",
        auth0Id: "seed|jdoe",
        isHost: true
      },
      {
        username: "asimpson",
        password: "password234",
        name: "Anna Simpson",
        email: "annasimpson@example.com",
        phoneNumber: "123-456-7891",
        pictureUrl: "https://wincacademy.github.io/webpages/media/article-author.png",
        auth0Id: "seed|asimpson",
        isHost: true
      },
      {
        username: "rjames",
        password: "password345",
        name: "Robert James",
        email: "robertjames@example.com",
        phoneNumber: "123-456-7892",
        pictureUrl: "https://wincacademy.github.io/webpages/media/robertjames.jpeg",
        auth0Id: "seed|rjames",
        isHost: true
      },
      {
        username: "klopez",
        password: "password456",
        name: "Karen Lopez",
        email: "karenlopez@example.com",
        phoneNumber: "123-456-7893",
        pictureUrl: "https://wincacademy.github.io/webpages/media/person9.jpeg",
        auth0Id: "seed|klopez",
        isHost: true
      },
      {
        username: "smiller",
        password: "password567",
        name: "Steve Miller",
        email: "stevemiller@example.com",
        phoneNumber: "123-456-7894",
        pictureUrl: "https://wincacademy.github.io/webpages/media/person6.jpeg",
        auth0Id: "seed|smiller",
        isHost: true
      }
    ]
  });

  const users = await prisma.user.findMany();

  // ============================================================
  // 2. PROPERTIES (nu gekoppeld aan userId)
  // ============================================================
  await prisma.property.createMany({
    data: [
      {
        title: "Cozy Mountain Retreat",
        description: "Experience tranquility in our cozy cabin.",
        location: "Rocky Mountains, Colorado",
        pricePerNight: 120.5,
        bedroomCount: 3,
        bathRoomCount: 2,
        maxGuestCount: 5,
        rating: 5,
        userId: users[0].id
      },
      {
        title: "Modern City Apartment",
        description: "Sleek and modern apartment in the city center.",
        location: "New York, NY",
        pricePerNight: 150.75,
        bedroomCount: 2,
        bathRoomCount: 2,
        maxGuestCount: 4,
        rating: 4,
        userId: users[1].id
      },
      {
        title: "Lakeside Cottage",
        description: "Rustic cottage by the lake.",
        location: "Lake Tahoe, California",
        pricePerNight: 95.0,
        bedroomCount: 1,
        bathRoomCount: 1,
        maxGuestCount: 3,
        rating: 5,
        userId: users[2].id
      },
      {
        title: "Beachfront Villa",
        description: "Luxurious villa right on the beach.",
        location: "Malibu, California",
        pricePerNight: 310.25,
        bedroomCount: 4,
        bathRoomCount: 3,
        maxGuestCount: 8,
        rating: 5,
        userId: users[3].id
      },
      {
        title: "Country Farmhouse",
        description: "Traditional farmhouse with vintage charm.",
        location: "Nashville, Tennessee",
        pricePerNight: 85.0,
        bedroomCount: 3,
        bathRoomCount: 2,
        maxGuestCount: 6,
        rating: 4,
        userId: users[4].id
      }
    ]
  });

  const properties = await prisma.property.findMany();

  // ============================================================
  // 3. AMENITIES
  // ============================================================
  await prisma.amenity.createMany({
    data: [
      { name: "WiFi" },
      { name: "Air Conditioning" },
      { name: "Heating" },
      { name: "Kitchen" },
      { name: "Washer" },
      { name: "Dryer" },
      { name: "TV" },
      { name: "Parking" },
      { name: "Pool" },
      { name: "Gym" }
    ]
  });

  // ============================================================
  // 4. BOOKINGS
  // ============================================================
  await prisma.booking.createMany({
    data: [
      {
        userId: users[0].id,
        propertyId: properties[0].id,
        checkinDate: new Date("2025-12-13"),
        checkoutDate: new Date("2025-12-19"),
        numberOfGuests: 2,
        totalPrice: 150.25,
        bookingStatus: "confirmed",
        name: "John Doe",
        email: "johndoe@example.com",
        notes: "Looking forward to my stay!"
      }
    ]
  });

  // ============================================================
  // 5. REVIEWS
  // ============================================================
  await prisma.review.createMany({
    data: [
      {
        userId: users[0].id,
        propertyId: properties[0].id,
        rating: 5,
        comment: "Amazing stay! Beautiful location and very clean."
      }
    ]
  });

  console.log("✅ Database seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
