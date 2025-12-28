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
   GET HOST BY EMAIL (public)
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
   - verwijdert host + alle gekoppelde properties/bookings/reviews
============================================================ */
export const deleteHost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const host = await prisma.host.findUnique({ where: { id } });
    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    const hostEmail = host.email;

    // Reviews verwijderen
    await prisma.review.deleteMany({
      where: {
        property: { hostEmail },
      },
    });

    // Bookings verwijderen
    await prisma.booking.deleteMany({
      where: {
        property: { hostEmail },
      },
    });

    // Properties verwijderen
    await prisma.property.deleteMany({
      where: { hostEmail },
    });

    // Host verwijderen
    await prisma.host.delete({ where: { id } });

    return res.status(200).json({ message: "Host deleted" });
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   GET HOST EARNINGS (protected)
============================================================ */
export const getHostEarnings = async (req, res) => {
  try {
    const hostId = req.params.id;

    const host = await prisma.host.findUnique({ where: { id: hostId } });
    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    const hostEmail = host.email;

    // Alle properties van deze host
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

    const allBookings = await prisma.booking.findMany({
      where: {
        propertyId: { in: propertyIds },
        bookingStatus: "CONFIRMED",
      },
      select: {
        id: true,
        totalPrice: true,
        propertyId: true,
        endDate: true,
      },
    });

    const completedBookings = allBookings.filter(
      (b) => new Date(b.endDate) <= today
    );

    const upcomingBookings = allBookings.filter(
      (b) => new Date(b.endDate) > today
    );

    const totalEarningsToDate = completedBookings.reduce(
      (sum, b) => sum + b.totalPrice,
      0
    );

    const expectedEarnings = allBookings.reduce(
      (sum, b) => sum + b.totalPrice,
      0
    );

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
      totalBookings: allBookings.length,
      bookingsCompleted: completedBookings.length,
      bookingsUpcoming: upcomingBookings.length,
      properties: earningsPerProperty,
    });
  } catch (error) {
    console.error("❌ Host earnings error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
