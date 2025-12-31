// ==============================================
// = HOST CONTROLLER                            =
// ==============================================

import prisma from "../lib/prisma.js";

/* ============================================================
   GET ALL HOSTS (public)
============================================================ */
export const getAllHostsController = async (req, res, next) => {
  try {
    const hosts = await prisma.host.findMany();
    return res.status(200).json(hosts);
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   GET HOST BY ID (public)
============================================================ */
export const getHostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const host = await prisma.host.findUnique({ where: { id } });
    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    return res.status(200).json(host);
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   CREATE HOST (admin / tooling)
============================================================ */
export const createHostController = async (req, res, next) => {
  try {
    const {
      username,
      password,
      name,
      email,
      phoneNumber,
      pictureUrl,
      aboutMe,
    } = req.body;

    if (!username || !password || !name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUsername = await prisma.host.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const existingEmail = await prisma.host.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const host = await prisma.host.create({
      data: {
        username,
        password,
        name,
        email,
        phoneNumber,
        pictureUrl,
        aboutMe,
      },
    });

    return res.status(201).json(host);
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   UPDATE HOST (protected)
============================================================ */
export const updateHost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const host = await prisma.host.findUnique({ where: { id } });
    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    const updated = await prisma.host.update({
      where: { id },
      data: {
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        pictureUrl: req.body.pictureUrl,
        aboutMe: req.body.aboutMe,
      },
    });

    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   DELETE HOST (protected)
============================================================ */
export const deleteHost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const host = await prisma.host.findUnique({ where: { id } });
    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    const hostEmail = host.email;

    await prisma.review.deleteMany({
      where: { property: { hostEmail } },
    });

    await prisma.booking.deleteMany({
      where: { property: { hostEmail } },
    });

    await prisma.property.deleteMany({
      where: { hostEmail },
    });

    await prisma.host.delete({ where: { id } });

    return res.status(200).json({ message: "Host deleted" });
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   GET HOST EARNINGS (protected)
   - Inclusief debug logs
   - Inclusief case-insensitive status fix
============================================================ */
export const getHostEarnings = async (req, res) => {
  try {
    const hostId = req.params.id;

    const host = await prisma.host.findUnique({ where: { id: hostId } });
    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    const hostEmail = host.email;

    const properties = await prisma.property.findMany({
      where: { hostEmail },
      select: { id: true, title: true },
    });

    if (properties.length === 0) {
      return res.json({
        hostEmail,
        totalEarningsToDate: 0,
        expectedEarnings: 0,
        totalBookings: 0,
        bookingsCompleted: 0,
        bookingsUpcoming: 0,
        properties: [],
      });
    }

    const propertyIds = properties.map((p) => p.id);
    const today = new Date();

    // ==============================================
    // = RAW BOOKINGS (NO FILTER)
    // ==============================================
    const rawBookings = await prisma.booking.findMany({
      where: { propertyId: { in: propertyIds } },
    });
    console.log("🔍 RAW BOOKINGS:", rawBookings);

    // ==============================================
    // = FILTERED BOOKINGS (CASE-INSENSITIVE)
    // ==============================================
    const allBookings = await prisma.booking.findMany({
      where: {
        propertyId: { in: propertyIds },
        OR: [
          { bookingStatus: "CONFIRMED" },
          { bookingStatus: "confirmed" },
          { bookingStatus: "Confirmed" },
        ],
      },
      select: {
        id: true,
        totalPrice: true,
        propertyId: true,
        startDate: true,
        endDate: true,
        bookingStatus: true,
      },
    });
    console.log("🔍 FILTERED BOOKINGS (CONFIRMED, CASE-INSENSITIVE):", allBookings);

    // ==============================================
    // = SAFE BOOKINGS (VALID endDate)
    // ==============================================
    const safeBookings = allBookings.filter(
      (b) => b.endDate !== null && b.totalPrice !== null
    );
    console.log("🔍 SAFE BOOKINGS (VALID endDate):", safeBookings);

    // ==============================================
    // = COMPLETED VS UPCOMING
    // ==============================================
    const completedBookings = safeBookings.filter(
      (b) => new Date(b.endDate).getTime() <= today.getTime()
    );

    const upcomingBookings = safeBookings.filter(
      (b) => new Date(b.endDate).getTime() > today.getTime()
    );

    // ==============================================
    // = TOTALS
    // ==============================================
    const totalEarningsToDate = completedBookings.reduce(
      (sum, b) => sum + b.totalPrice,
      0
    );

    const expectedEarnings = safeBookings.reduce(
      (sum, b) => sum + b.totalPrice,
      0
    );

    // ==============================================
    // = PER PROPERTY
    // ==============================================
    const earningsPerProperty = properties.map((p) => {
      const completed = completedBookings.filter((b) => b.propertyId === p.id);
      const upcoming = upcomingBookings.filter((b) => b.propertyId === p.id);

      return {
        propertyId: p.id,
        title: p.title,
        bookingsCompleted: completed.length,
        bookingsUpcoming: upcoming.length,
        earningsToDate: completed.reduce((sum, b) => sum + b.totalPrice, 0),
        expectedEarnings: [...completed, ...upcoming].reduce(
          (sum, b) => sum + b.totalPrice,
          0
        ),
      };
    });

    return res.json({
      hostEmail,
      totalEarningsToDate,
      expectedEarnings,
      totalBookings: safeBookings.length,
      bookingsCompleted: completedBookings.length,
      bookingsUpcoming: upcomingBookings.length,
      properties: earningsPerProperty,
    });
  } catch (error) {
    console.error("❌ Host earnings error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
