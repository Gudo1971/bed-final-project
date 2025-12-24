import prisma from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

// ---------------------------------------------------------
// GET ALL HOSTS
// ---------------------------------------------------------
export const getAllHostsController = async (req, res, next) => {
  try {
    const hosts = await prisma.host.findMany();
    return res.status(200).json(hosts);
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------
// GET HOST BY ID
// ---------------------------------------------------------
export const getHostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const host = await prisma.host.findUnique({
      where: { id }
    });

    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    return res.status(200).json(host);
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------
// CREATE HOST
// ---------------------------------------------------------
export const createHostController = async (req, res, next) => {
  try {
    const {
      username,
      password,
      name,
      email,
      phoneNumber,
      pictureUrl,
      aboutMe
    } = req.body;

    // Required fields
    if (!username || !password || !name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check username uniqueness
    const existingUsername = await prisma.host.findUnique({
      where: { username }
    });
    if (existingUsername) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Check email uniqueness
    const existingEmail = await prisma.host.findUnique({
      where: { email }
    });
    if (existingEmail) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Create host
    const host = await prisma.host.create({
      data: {
        username,
        password,
        name,
        email,
        phoneNumber,
        pictureUrl,
        aboutMe
      }
    });

    return res.status(201).json(host);
  } catch (err) {
    next(err);
  }
};



// ---------------------------------------------------------
// UPDATE HOST
// ---------------------------------------------------------
export const updateHost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Host ID is required" });
    }

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



// ---------------------------------------------------------
// DELETE HOST
// ---------------------------------------------------------
export async function deleteHost(req, res, next) {
  try {
    const { id } = req.params;

    // 1. Check if host exists
    const host = await prisma.host.findUnique({ where: { id } });
    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    // 2. Delete reviews of properties of this host
    await prisma.review.deleteMany({
      where: {
        property: {
          hostId: id
        }
      }
    });

    // 3. Delete bookings of properties of this host
    await prisma.booking.deleteMany({
      where: {
        property: {
          hostId: id
        }
      }
    });

    // 4. Delete properties of this host
    await prisma.property.deleteMany({
      where: { hostId: id }
    });

    // 5. Delete the host
    await prisma.host.delete({
      where: { id }
    });

    return res.status(200).json({ message: "Host deleted" });
  } catch (err) {
    next(err);
  }
}

