import prisma from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

/* ---------------------------------------------------------
   GET ALL HOSTS
--------------------------------------------------------- */
export const getAllHostsController = async (req, res, next) => {
  try {
    const hosts = await prisma.host.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        pictureUrl: true,
        aboutMe: true,
      },
    });

    return res.status(200).json(hosts);
  } catch (err) {
    next(err);
  }
};

/* ---------------------------------------------------------
   GET HOST BY NAME
--------------------------------------------------------- */
export const getHostByNameController = async (req, res, next) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: "Missing name parameter" });
    }

    const host = await prisma.host.findFirst({
      where: { name },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        pictureUrl: true,
        aboutMe: true,
      },
    });

    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    return res.status(200).json(host);
  } catch (err) {
    next(err);
  }
};

/* ---------------------------------------------------------
   GET HOST BY ID
--------------------------------------------------------- */
export const getHostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const host = await prisma.host.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        pictureUrl: true,
        aboutMe: true,
      },
    });

    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    return res.status(200).json(host);
  } catch (error) {
    next(error);
  }
};

/* ---------------------------------------------------------
   CREATE HOST (Winc expects 409 on duplicate)
--------------------------------------------------------- */
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

    //  PRE-CHECK (Winc expects this)
    const existing = await prisma.host.findFirst({
      where: {
        OR: [{ username }],
      },
    });

    if (existing) {
      return res.status(409).json({ error: "Host already exists" });
    }

    const host = await prisma.host.create({
      data: {
        username,
        password,
        name,
        email,
        phoneNumber: phoneNumber || null,
        pictureUrl: pictureUrl || null,
        aboutMe: aboutMe || null,
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        pictureUrl: true,
        aboutMe: true,
      },
    });

    return res.status(201).json(host);
  } catch (err) {
    next(err);
  }
};

/* ---------------------------------------------------------
   UPDATE HOST
--------------------------------------------------------- */
export const updateHost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const host = await prisma.host.findUnique({ where: { id } });
    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    const { username, email } = req.body;

    // ⭐ PRE-CHECK for duplicates
    if (username || email) {
      const duplicate = await prisma.host.findFirst({
        where: {
          OR: [
            username ? { username } : undefined,
            email ? { email } : undefined,
          ],
          NOT: { id },
        },
      });

      if (duplicate) {
        return res.status(409).json({ error: "Host already exists" });
      }
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
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        pictureUrl: true,
        aboutMe: true,
      },
    });

    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

/* ---------------------------------------------------------
   DELETE HOST
--------------------------------------------------------- */
export const deleteHost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const host = await prisma.host.findUnique({ where: { id } });
    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    await prisma.review.deleteMany({
      where: { property: { hostId: id } },
    });

    await prisma.booking.deleteMany({
      where: { property: { hostId: id } },
    });

    await prisma.property.deleteMany({
      where: { hostId: id },
    });

    await prisma.host.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Host deleted" });
  } catch (err) {
    next(err);
  }
};
