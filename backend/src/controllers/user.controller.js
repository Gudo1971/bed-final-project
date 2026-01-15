import prisma from "../lib/prisma.js";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { authenticateToken } from "../middleware/auth.middleware.js";

// ---------------------------------------------------------
// REGISTER USER (open route)
// ---------------------------------------------------------
export const registerUserController = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashed, username },
      select: { id: true, email: true, username: true },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------
// GET ALL USERS
// ---------------------------------------------------------
export const getAllUsersController = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    if (users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------
// GET USER BY ID
// ---------------------------------------------------------
export const getUserByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------
// CREATE USER (Winc expects 409 on duplicate)
// ---------------------------------------------------------
export const createUserController = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // PRE-CHECK (Winc expects this)
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username }],
      },
    });

    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashed, username },
      select: { id: true, email: true, username: true },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------
// UPDATE USER
// ---------------------------------------------------------
export const updateUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "User not found" });
    }

    const { email, password, username } = req.body;

    if (
      email === undefined &&
      password === undefined &&
      username === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // PRE-CHECK (Winc expects this)
    if (email || username) {
      const duplicate = await prisma.user.findFirst({
        where: {
          OR: [username ? { username } : undefined],
          NOT: { id },
        },
      });

      if (duplicate) {
        return res.status(409).json({ error: "User already exists" });
      }
    }

    const updateData = {};

    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;
    if (password !== undefined)
      updateData.password = await bcrypt.hash(password, 10);

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, username: true },
    });

    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------
// DELETE USER
// ---------------------------------------------------------
export const deleteUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.review.deleteMany({ where: { userId: id } });
    await prisma.booking.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------
// GET USER BY USERNAME
// ---------------------------------------------------------
export const getUserByUsernameController = async (req, res, next) => {
  try {
    const { username } = req.query;

    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true, email: true, username: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------
// GET USER BY EMAIL
// ---------------------------------------------------------
export const getUserByEmailController = async (req, res, next) => {
  try {
    const { email } = req.query;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, username: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
