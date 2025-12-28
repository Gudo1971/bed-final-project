// src/controllers/user.controller.js
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs"; // ⭐ FIXED
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../services/user.service.js";

// ---------------------------------------------------------
// GET ALL USERS
// ---------------------------------------------------------
export const getAllUsersController = async (req, res, next) => {
  try {
    const users = await getAllUsers();
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

    if (!id || typeof id !== "string") {
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

// ---------------------------------------------------------
// CREATE USER
// ---------------------------------------------------------
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

    if (!email && !password && !username) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updateData = {};

    // ⭐ EMAIL UNIQUE CHECK
    if (email !== undefined) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists && emailExists.id !== id) {
        return res.status(409).json({ error: "Email already exists" });
      }
      updateData.email = email;
    }

    // ⭐ USERNAME UNIQUE CHECK
    if (username !== undefined) {
      const usernameExists = await prisma.user.findUnique({ where: { username } });
      if (usernameExists && usernameExists.id !== id) {
        return res.status(409).json({ error: "Username already exists" });
      }
      updateData.username = username;
    }

    if (password !== undefined) {
      updateData.password = await bcrypt.hash(password, 10);
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

// ===============================
// BECOME HOST
// ===============================
export const becomeHost = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const existingHost = await prisma.host.findUnique({
      where: { email: user.email },
    });

    if (existingHost) {
      return res.status(400).json({ error: "Je bent al host" });
    }

    const host = await prisma.host.create({
      data: {
        username: user.username,
        password: user.password,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        pictureUrl: user.pictureUrl,
        aboutMe: user.aboutMe,
      },
    });

    return res.json({ message: "Je bent nu host!", host });
  } catch (error) {
    console.error("❌ Become Host error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// ---------------------------------------------------------
// DELETE USER
// ---------------------------------------------------------
export const deleteUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    await prisma.review.deleteMany({ where: { userId: id } });
    await prisma.booking.deleteMany({ where: { userId: id } });

    await prisma.user.delete({ where: { id } });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
// ---------------------------------------------------------
// UPDATE USER PASSWORD
// ---------------------------------------------------------
export const updateUserPasswordController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // 1. Check required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 2. Check if user exists
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 3. Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Ongeldige combinatie" });
    }

    // 4. Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // 5. Update password
    await prisma.user.update({
      where: { id },
      data: { password: hashed },
    });

    return res.status(200).json({ message: "Wachtwoord succesvol gewijzigd" });
  } catch (error) {
    next(error);
  }
};
