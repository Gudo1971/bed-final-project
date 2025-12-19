import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ============================================================
  // 1. USERS
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
        auth0Id: "seed|jdoe"
      },
      {
        username: "asimpson",
        password: "password234",
        name: "Anna Simpson",
        email: "annasimpson@example.com",
        phoneNumber: "123-456-7891",
        pictureUrl: "https://wincacademy.github.io/webpages/media/article-author.png",
        auth0Id: "seed|asimpson"
      },
      {
        username: "rjames",
        password: "password345",
        name: "Robert James",
        email: "robertjames@example.com",
        phoneNumber: "123-456-7892",
        pictureUrl: "https://wincacademy.github.io/webpages/media/robertjames.jpeg",
        auth0Id: "seed|rjames"
      },
      {
        username: "klopez",
        password: "password456",
        name: "Karen Lopez",
        email: "karenlopez@example.com",
        phoneNumber: "123-456-7893",
        pictureUrl: "https://wincacademy.github.io/webpages/media/person9.jpeg",
        auth0Id: "seed|klopez"
      },
      {
        username: "smiller",
        password: "password567",
        name: "Steve Miller",
        email: "stevemiller@example.com",
        phoneNumber: "123-456-7894",
        pictureUrl: "https://wincacademy.github.io/webpages/media/person6.jpeg",
        auth0Id: "seed|smiller"
      }
    ]
  });

  const users = await prisma.user.findMany();

  // ============================================================
  // 2. HOSTS
  // ============================================================
  await prisma.host.createMany({
    data: [
      {
        id: "f1234567-89ab-cdef-0123-456789abcdef",
        username: "johnDoe",
        password: "johnDoe123",
        name: "John Doe",
        email: "john@example.com",
        phoneNumber: "+11234567890",
        pictureUrl: "https://wincacademy.github.io/webpages/media/johndoe.jpeg",
        aboutMe: "I'm a passionate traveler who loves to share my home.",
        auth0Id: "host|johnDoe"
      },
      {
        id: "e2345678-90bc-def0-0123-456789abcdef",
        username: "lindaSmith",
        password: "lindaS123",
        name: "Linda Smith",
        email: "linda@example.com",
        phoneNumber: "+12234567891",
        pictureUrl: "https://wincacademy.github.io/webpages/media/lindasmith.jpg",
        aboutMe: "A professional chef and part-time host.",
        auth0Id: "host|lindaSmith"
      },
      {
        id: "d3456789-01cd-def0-1234-56789abcdef0",
        username: "mikeBrown",
        password: "mikeB2023",
        name: "Mike Brown",
        email: "mike@example.com",
        phoneNumber: "+13234567892",
        pictureUrl: "https://wincacademy.github.io/webpages/media/mikebrown.jpg",
        aboutMe: "Nature enthusiast and art lover.",
        auth0Id: "host|mikeBrown"
      },
      {
        id: "c4567890-12de-f012-3456-789abcdef012",
        username: "sarahLee",
        password: "sarahL456",
        name: "Sarah Lee",
        email: "sarah@example.com",
        phoneNumber: "+14234567893",
        pictureUrl: "https://wincacademy.github.io/webpages/media/sarahlee.jpg",
        aboutMe: "Travel blogger turned host.",
        auth0Id: "host|sarahLee"
      },
      {
        id: "b5678901-23ef-0123-4567-89abcdef0123",
        username: "paulGreen",
        password: "greenP789",
        name: "Paul Green",
        email: "paul@example.com",
        phoneNumber: "+15234567894",
        pictureUrl: "https://wincacademy.github.io/webpages/media/paulgreen.jpg",
        aboutMe: "Engineer passionate about history.",
        auth0Id: "host|paulGreen"
      },
      {
        id: "d2345678-90ab-cdef-1234-567890abcdef",
        username: "sofieJansen",
        password: "amsterdam2025",
        name: "Sofie Jansen",
        email: "sofie@example.com",
        phoneNumber: "+31612345678",
        pictureUrl: "https://wincacademy.github.io/webpages/media/sofiejansen.jpg",
        aboutMe: "Born and raised in Amsterdam.",
        auth0Id: "host|sofieJansen"
      }
    ]
  });

  // ============================================================
  // 3. PROPERTIES (ZONDER imageUrl!)
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
        hostId: "f1234567-89ab-cdef-0123-456789abcdef"
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
        hostId: "e2345678-90bc-def0-0123-456789abcdef"
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
        hostId: "d3456789-01cd-def0-1234-56789abcdef0"
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
        hostId: "c4567890-12de-f012-3456-789abcdef012"
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
        hostId: "b5678901-23ef-0123-4567-89abcdef0123"
      },
      {
        title: "Charming Canal Apartment",
        description: "Authentic Amsterdam canal-side apartment.",
        location: "Amsterdam, Netherlands",
        pricePerNight: 120.0,
        bedroomCount: 2,
        bathRoomCount: 1,
        maxGuestCount: 4,
        rating: 5,
        hostId: "d2345678-90ab-cdef-1234-567890abcdef"
      }
    ]
  });

  const properties = await prisma.property.findMany();

  // ============================================================
  // 4. AMENITIES
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
  // 5. BOOKINGS (met verplichte velden!)
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
      },
      {
        userId: users[1].id,
        propertyId: properties[1].id,
        checkinDate: new Date("2025-12-24"),
        checkoutDate: new Date("2025-12-31"),
        numberOfGuests: 3,
        totalPrice: 220.0,
        bookingStatus: "pending",
        name: "Anna Simpson",
        email: "annasimpson@example.com"
      }
    ]
  });

  // ============================================================
  // 6. REVIEWS
  // ============================================================
  await prisma.review.createMany({
    data: [
      {
        userId: users[0].id,
        propertyId: properties[0].id,
        rating: 5,
        comment: "Amazing stay! Beautiful location and very clean."
      },
      {
        userId: users[1].id,
        propertyId: properties[1].id,
        rating: 4,
        comment: "Great apartment, perfect location. WiFi could be faster."
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
