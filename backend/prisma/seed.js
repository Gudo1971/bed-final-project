import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ✅ 1. USERS
  await prisma.user.createMany({
    data: [
      {
        username: "jdoe",
        password: "password123",
        name: "John Doe",
        email: "johndoe@example.com",
        phoneNumber: "123-456-7890",
        pictureUrl: "https://wincacademy.github.io/webpages/media/johndoe.jpeg"
      },
      {
        username: "asimpson",
        password: "password234",
        name: "Anna Simpson",
        email: "annasimpson@example.com",
        phoneNumber: "123-456-7891",
        pictureUrl: "https://wincacademy.github.io/webpages/media/article-author.png"
      },
      {
        username: "rjames",
        password: "password345",
        name: "Robert James",
        email: "robertjames@example.com",
        phoneNumber: "123-456-7892",
        pictureUrl: "https://wincacademy.github.io/webpages/media/robertjames.jpeg"
      },
      {
        username: "klopez",
        password: "password456",
        name: "Karen Lopez",
        email: "karenlopez@example.com",
        phoneNumber: "123-456-7893",
        pictureUrl: "https://wincacademy.github.io/webpages/media/person9.jpeg"
      },
      {
        username: "smiller",
        password: "password567",
        name: "Steve Miller",
        email: "stevemiller@example.com",
        phoneNumber: "123-456-7894",
        pictureUrl: "https://wincacademy.github.io/webpages/media/person6.jpeg"
      }
    ]
  });

  // ✅ 2. USERS OPHALEN MET ECHTE ID’S
  const users = await prisma.user.findMany();

  // ✅ 3. HOSTS (met vaste ID’s)
  await prisma.host.createMany({
    data: [
      {
        id: "f1234567-89ab-cdef-0123-456789abcdef",
        username: "johnDoe",
        password: "johnDoe123",
        name: "John Doe",
        email: "johndoe@email.com",
        phoneNumber: "+11234567890",
        pictureUrl: "https://wincacademy.github.io/webpages/media/johndoe.jpeg",
        aboutMe: "I'm a passionate traveler who loves to share my home."
      },
      {
        id: "e2345678-90bc-def0-0123-456789abcdef",
        username: "lindaSmith",
        password: "lindaS123",
        name: "Linda Smith",
        email: "lindasmith@email.com",
        phoneNumber: "+12234567891",
        pictureUrl: "https://wincacademy.github.io/webpages/media/lindasmith.jpg",
        aboutMe: "A professional chef and part-time host."
      },
      {
        id: "d3456789-01cd-def0-1234-56789abcdef0",
        username: "mikeBrown",
        password: "mikeB2023",
        name: "Mike Brown",
        email: "mikebrown@email.com",
        phoneNumber: "+13234567892",
        pictureUrl: "https://wincacademy.github.io/webpages/media/mikebrown.jpg",
        aboutMe: "Nature enthusiast and art lover."
      },
      {
        id: "c4567890-12de-f012-3456-789abcdef012",
        username: "sarahLee",
        password: "sarahL456",
        name: "Sarah Lee",
        email: "sarahlee@email.com",
        phoneNumber: "+14234567893",
        pictureUrl: "https://wincacademy.github.io/webpages/media/sarahlee.jpg",
        aboutMe: "Travel blogger turned host."
      },
      {
        id: "b5678901-23ef-0123-4567-89abcdef0123",
        username: "paulGreen",
        password: "greenP789",
        name: "Paul Green",
        email: "paulgreen@email.com",
        phoneNumber: "+15234567894",
        pictureUrl: "https://wincacademy.github.io/webpages/media/paulgreen.jpg",
        aboutMe: "Engineer passionate about history."
      },
      {
        id: "d2345678-90ab-cdef-1234-567890abcdef",
        username: "sofieJansen",
        password: "amsterdam2025",
        name: "Sofie Jansen",
        email: "sofie.jansen@email.com",
        phoneNumber: "+31612345678",
        pictureUrl: "https://wincacademy.github.io/webpages/media/sofiejansen.jpg",
        aboutMe: "Born and raised in Amsterdam."
      }
    ]
  });

  // ✅ 4. PROPERTIES
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

  // ✅ 5. PROPERTIES OPHALEN MET ECHTE ID’S
  const properties = await prisma.property.findMany();

  // ✅ 6. AMENITIES
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

  // ✅ 7. BOOKINGS (met echte ID’s)

await prisma.booking.createMany({
  data: [
    {
      userId: users[0].id,
      propertyId: properties[0].id,
      checkinDate: new Date("2025-12-13"),
      checkoutDate: new Date("2025-12-19"),
      numberOfGuests: 2,
      totalPrice: 150.25,
      bookingStatus: "confirmed"
    },
    {
      userId: users[1].id,
      propertyId: properties[1].id,
      checkinDate: new Date("2025-12-24"),
      checkoutDate: new Date("2025-12-31"),
      numberOfGuests: 3,
      totalPrice: 220.0,
      bookingStatus: "pending"
    },
    {
      userId: users[2].id,
      propertyId: properties[2].id,
      checkinDate: new Date("2026-01-10"),
      checkoutDate: new Date("2026-01-15"),
      numberOfGuests: 4,
      totalPrice: 290.5,
      bookingStatus: "confirmed"
    },
    {
      userId: users[3].id,
      propertyId: properties[3].id,
      checkinDate: new Date("2026-02-05"),
      checkoutDate: new Date("2026-02-12"),
      numberOfGuests: 1,
      totalPrice: 80.75,
      bookingStatus: "canceled"
    }
  ]
});

  // ✅ REVIEWS (met echte ID’s)
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
    },
    {
      userId: users[2].id,
      propertyId: properties[2].id,
      rating: 3,
      comment: "Nice cottage, but a bit smaller than expected."
    },
    {
      userId: users[3].id,
      propertyId: properties[3].id,
      rating: 5,
      comment: "Absolutely loved the beachfront villa. Worth every cent."
    },
    {
      userId: users[4].id,
      propertyId: properties[4].id,
      rating: 4,
      comment: "Cozy farmhouse with a great atmosphere."
    }
  ]
});
}
main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  
  });
