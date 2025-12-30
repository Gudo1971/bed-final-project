// src/controllers/user.controller.js
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../services/user.service.js";

/* ============================================================
   GET ALL USERS (public)
============================================================ */
export const getAllUsersController = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   GET USER BY ID (public)
============================================================ */
export const getUserByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   CREATE USER (public)
============================================================ */
export const createUserController = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const newUser = await createUser({ email, password, username });
    return res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   UPDATE USER (protected)
   → ondersteunt nu pictureUrl
   → geen verplichte velden meer
============================================================ */
export const updateUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "User not found" });
    }

    const { email, password, username, pictureUrl, name, phoneNumber } = req.body;

    const updateData = {};

    // Email unique check
    if (email !== undefined) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists && emailExists.id !== id) {
        return res.status(409).json({ error: "Email already exists" });
      }
      updateData.email = email;
    }

    // Username unique check
    if (username !== undefined) {
      const usernameExists = await prisma.user.findUnique({ where: { username } });
      if (usernameExists && usernameExists.id !== id) {
        return res.status(409).json({ error: "Username already exists" });
      }
      updateData.username = username;
    }

    // Password hashing
    if (password !== undefined) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // ⭐ NEW: Profielfoto opslaan
    if (pictureUrl !== undefined) {
      updateData.pictureUrl = pictureUrl;
    }

    // ⭐ NEW: Naam & telefoonnummer opslaan
    if (name !== undefined) {
      updateData.name = name;
    }

    if (phoneNumber !== undefined) {
      updateData.phoneNumber = phoneNumber;
    }

    // Als er niets te updaten is
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   DELETE USER (protected)
============================================================ */
export const deleteUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Cascade delete
    await prisma.review.deleteMany({ where: { userId: id } });
    await prisma.booking.deleteMany({ where: { userId: id } });

    await prisma.user.delete({ where: { id } });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   UPDATE USER PASSWORD (protected)
============================================================ */
export const updateUserPasswordController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Ongeldige combinatie" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id },
      data: { password: hashed },
    });

    return res.status(200).json({ message: "Wachtwoord succesvol gewijzigd" });
  } catch (error) {
    next(error);
  }
};
