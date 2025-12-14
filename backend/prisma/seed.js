import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.property.deleteMany();
  await prisma.host.deleteMany();
  await prisma.user.deleteMany();

  // ✅ USERS
  const users = await prisma.user.createMany({
    data: [
      {
        id: "a1234567-89ab-cdef-0123-456789abcdef",
        username: "jdoe",
        password: "password123",
        name: "John Doe",
        email: "johndoe@example.com",
        phoneNumber: "123-456-7890",
        pictureUrl: "https://wincacademy.github.io/webpages/media/johndoe.jpeg"
      },
      {
        id: "b2345678-90cd-ef01-2345-6789abcdef01",
        username: "asimpson",
        password: "password234",
        name: "Anna Simpson",
        email: "annasimpson@example.com",
        phoneNumber: "123-456-7891",
        pictureUrl: "https://wincacademy.github.io/webpages/media/article-author.png"
      },
      {
        id: "c3456789-01de-f012-3456-789abcdef012",
        username: "rjames",
        password: "password345",
        name: "Robert James",
        email: "robertjames@example.com",
        phoneNumber: "123-456-7892",
        pictureUrl: "https://wincacademy.github.io/webpages/media/robertjames.jpeg"
      },
      {
        id: "d4567890-12ef-0123-4567-89abcdef0123",
        username: "klopez",
        password: "password456",
        name: "Karen Lopez",
        email: "karenlopez@example.com",
        phoneNumber: "123-456-7893",
        pictureUrl: "https://wincacademy.github.io/webpages/media/person9.jpeg"
      },
      {
        id: "e5678901-23f0-1234-5678-9abcdef01234",
        username: "smiller",
        password: "password567",
        name: "Steve Miller",
        email: "stevemiller@example.com",
        phoneNumber: "123-456-7894",
        pictureUrl: "https://wincacademy.github.io/webpages/media/person6.jpeg"
      }
    ]
  });

  // ✅ HOSTS
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
        aboutMe: "I'm a passionate traveler who loves to share my home with fellow explorers. Welcome!"
      },
      {
        id: "e2345678-90bc-def0-0123-456789abcdef",
        username: "lindaSmith",
        password: "lindaS123",
        name: "Linda Smith",
        email: "lindasmith@email.com",
        phoneNumber: "+12234567891",
        pictureUrl: "https://wincacademy.github.io/webpages/media/lindasmith.jpg",
        aboutMe: "A professional chef and a part-time host. I love curating unique experiences for my guests."
      },
      {
        id: "d3456789-01cd-def0-1234-56789abcdef0",
        username: "mikeBrown",
        password: "mikeB2023",
        name: "Mike Brown",
        email: "mikebrown@email.com",
        phoneNumber: "+13234567892",
        pictureUrl: "https://wincacademy.github.io/webpages/media/mikebrown.jpg",
        aboutMe: "Nature enthusiast, hiker, and a lover of arts. My home reflects my passions. Stay and enjoy!"
      },
      {
        id: "c4567890-12de-f012-3456-789abcdef012",
        username: "sarahLee",
        password: "sarahL456",
        name: "Sarah Lee",
        email: "sarahlee@email.com",
        phoneNumber: "+14234567893",
        pictureUrl: "https://wincacademy.github.io/webpages/media/sarahlee.jpg",
        aboutMe: "Travel blogger turned host. My home is filled with artifacts from around the world. Feel the global vibe!"
      },
      {
        id: "b5678901-23ef-0123-4567-89abcdef0123",
        username: "paulGreen",
        password: "greenP789",
        name: "Paul Green",
        email: "paulgreen@email.com",
        phoneNumber: "+15234567894",
        pictureUrl: "https://wincacademy.github.io/webpages/media/paulgreen.jpg",
        aboutMe: "Engineer by profession, passionate about history. Stay in my vintage-themed home and relive the past."
      },
      {
        id: "d2345678-90ab-cdef-1234-567890abcdef",
        username: "sofieJansen",
        password: "amsterdam2025",
        name: "Sofie Jansen",
        email: "sofie.jansen@email.com",
        phoneNumber: "+31612345678",
        pictureUrl: "https://wincacademy.github.io/webpages/media/sofiejansen.jpg",
        aboutMe: "Born and raised in Amsterdam. I love sharing hidden gems of the city with travelers from all over the world."
      }
    ]
  });

  // ✅ PROPERTIES
  await prisma.property.createMany({
    data: [
      {
        id: "g9012345-67ef-0123-4567-89abcdef0123",
        hostId: "f1234567-89ab-cdef-0123-456789abcdef",
        title: "Cozy Mountain Retreat",
        description: "Experience tranquility in our cozy cabin situated on a serene mountain peak.",
        location: "Rocky Mountains, Colorado",
        pricePerNight: 120.5,
        bedroomCount: 3,
        bathRoomCount: 2,
        maxGuestCount: 5,
        rating: 5
      },
      {
        id: "h0123456-78f0-1234-5678-9abcdef01234",
        hostId: "e2345678-90bc-def0-0123-456789abcdef",
        title: "Modern City Apartment",
        description: "Stay in our sleek and modern apartment right in the heart of the city.",
        location: "New York, NY",
        pricePerNight: 150.75,
        bedroomCount: 2,
        bathRoomCount: 2,
        maxGuestCount: 4,
        rating: 4
      },
      {
        id: "i1234567-89f0-1234-5678-9abcdef01234",
        hostId: "d3456789-01cd-def0-1234-56789abcdef0",
        title: "Lakeside Cottage",
        description: "Unwind by the lake in our rustic cottage, perfect for weekend getaways.",
        location: "Lake Tahoe, California",
        pricePerNight: 95.0,
        bedroomCount: 1,
        bathRoomCount: 1,
        maxGuestCount: 3,
        rating: 5
      },
      {
        id: "j2345678-90f1-2345-6789-abcdef012345",
        hostId: "c4567890-12de-f012-3456-789abcdef012",
        title: "Beachfront Villa",
        description: "Experience paradise in our luxurious villa right on the beach.",
        location: "Malibu, California",
        pricePerNight: 310.25,
        bedroomCount: 4,
        bathRoomCount: 3,
        maxGuestCount: 8,
        rating: 5
      },
      {
        id: "k3456789-01f2-3456-789a-bcdef0123456",
        hostId: "b5678901-23ef-0123-4567-89abcdef0123",
        title: "Country Farmhouse",
        description: "Step back in time and enjoy the simple pleasures of our traditional farmhouse.",
        location: "Nashville, Tennessee",
        pricePerNight: 85.0,
        bedroomCount: 3,
        bathRoomCount: 2,
        maxGuestCount: 6,
        rating: 4
      },
      {
        id: "a9876543-21dc-4321-ba98-fedcba098765",
        hostId: "d2345678-90ab-cdef-1234-567890abcdef",
        title: "Charming Canal Apartment",
        description: "Experience authentic Amsterdam living in this cozy canal-side apartment with classic Dutch architecture and modern comforts.",
        location: "Amsterdam, Netherlands",
        pricePerNight: 120.0,
        bedroomCount: 2,
        bathRoomCount: 1,
        maxGuestCount: 4,
        rating: 5
      }
    ]
  });

  // ✅ REVIEWS
  await prisma.review.createMany({
    data: [
      {
        id: "g7890123-45cd-ef01-2345-6789abcdef01",
        userId: "a1234567-89ab-cdef-0123-456789abcdef",
        propertyId: "g9012345-67ef-0123-4567-89abcdef0123",
        rating: 5,
        comment: "The property was amazing, and the host was very accommodating!"
      },
      {
        id: "h8901234-56de-f012-3456-789abcdef012",
        userId: "b2345678-90cd-ef01-2345-6789abcdef01",
        propertyId: "k3456789-01f2-3456-789a-bcdef0123456",
        rating: 4,
        comment: "Lovely place, but the WiFi was a bit slow."
      },
      {
        id: "i9012345-67ef-0123-4567-89abcdef0123",
        userId: "c3456789-01de-f012-3456-789abcdef012",
        propertyId: "k3456789-01f2-3456-789a-bcdef0123456",
        rating: 3,
        comment: "Decent place for the price. Would visit again."
      },
      {
        id: "j0123456-78f0-1234-5678-9abcdef01234",
        userId: "d4567890-12ef-0123-4567-89abcdef0123",
        propertyId: "j2345678-90f1-2345-6789-abcdef012345",
        rating: 4,
        comment: "Beautiful view! However, there were some minor issues with the bathroom."
      },
      {
        id: "k1234567-89f0-1234-5678-9abcdef01234",
        userId: "e5678901-23f0-1234-5678-9abcdef01234",
        propertyId: "j2345678-90f1-2345-6789-abcdef012345",
        rating: 5,
        comment: "A perfect stay! Can't wait to come back."
      }
    ]
  });

// ✅ AMENITIES
await prisma.amenity.createMany({
  data: [
    { id: "l4567890-12gh-ijkl-1234-56789abcdef0", name: "Wifi" },
    { id: "m5678901-23ij-klmn-2345-6789abcdef01", name: "Gym" },
    { id: "n6789012-34kl-mnop-3456-789abcdef012", name: "Pool" },
    { id: "o7890123-45lm-nopq-4567-89abcdef0123", name: "Kitchen" },
    { id: "p8901234-56mn-opqr-5678-9abcdef01234", name: "Air Conditioning" },
    { id: "q9012345-67no-pqrs-6789-abcdef012345", name: "Heating" },
    { id: "r0123456-78op-qrst-789a-bcdef0123456", name: "Washer" },
    { id: "s1234567-89pq-rstu-89ab-cdef01234567", name: "Dryer" },
    { id: "t2345678-90qr-stuv-90bc-def012345678", name: "TV" },
    { id: "u3456789-01rs-tuvw-01cd-ef0123456789", name: "Free Parking" }
  ]
});

// ✅ BOOKINGS
await prisma.booking.createMany({
  data: [
    {
      id: "b001",
      userId: "a1234567-89ab-cdef-0123-456789abcdef",
      propertyId: "g9012345-67ef-0123-4567-89abcdef0123",
      checkinDate: new Date("2024-06-01"),
      checkoutDate: new Date("2024-06-05"),
      numberOfGuests: 2,
      totalPrice: 480.0,
      bookingStatus: "confirmed"
    },
    {
      id: "b002",
      userId: "b2345678-90cd-ef01-2345-6789abcdef01",
      propertyId: "h0123456-78f0-1234-5678-9abcdef01234",
      checkinDate: new Date("2024-07-10"),
      checkoutDate: new Date("2024-07-15"),
      numberOfGuests: 3,
      totalPrice: 753.75,
      bookingStatus: "pending"
    },
    {
      id: "b003",
      userId: "c3456789-01de-f012-3456-789abcdef012",
      propertyId: "i1234567-89f0-1234-5678-9abcdef01234",
      checkinDate: new Date("2024-08-20"),
      checkoutDate: new Date("2024-08-22"),
      numberOfGuests: 1,
      totalPrice: 190.0,
      bookingStatus: "confirmed"
    },
    {
      id: "b004",
      userId: "d4567890-12ef-0123-4567-89abcdef0123",
      propertyId: "j2345678-90f1-2345-6789-abcdef012345",
      checkinDate: new Date("2024-09-01"),
      checkoutDate: new Date("2024-09-07"),
      numberOfGuests: 4,
      totalPrice: 1861.5,
      bookingStatus: "cancelled"
    },
    {
      id: "b005",
      userId: "e5678901-23f0-1234-5678-9abcdef01234",
      propertyId: "k3456789-01f2-3456-789a-bcdef0123456",
      checkinDate: new Date("2024-10-12"),
      checkoutDate: new Date("2024-10-14"),
      numberOfGuests: 2,
      totalPrice: 170.0,
      bookingStatus: "confirmed"
    }
  ]
});


  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
