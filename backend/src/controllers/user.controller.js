// src/controllers/user.controller.js
import prisma from "../lib/prisma.js";
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

    // VALIDATION (required by Winc tests)
    if (!email || !password || !username) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // CHECK IF EMAIL ALREADY EXISTS (required by Winc tests)
    const existing = await prisma.user.findUnique({
      where: { email }
    });

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

    // 1. Check if user exists
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Validate body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { email, password, username } = req.body;

    if (email === undefined && password === undefined && username === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 3. Build update object
    const updateData = {};

    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;

    if (password !== undefined) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // 4. Update user
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

    // 1. Haal de user op
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Check of deze user al host is
    const existingHost = await prisma.host.findUnique({
      where: { email: user.email },
    });

    if (existingHost) {
      return res.status(400).json({ error: "Je bent al host" });
    }

    // 3. Maak een Host record aan
    const host = await prisma.host.create({
      data: {
        username: user.username,
        password: user.password, // hashed password hergebruiken
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        pictureUrl: user.pictureUrl,
        aboutMe: user.aboutMe,
      },
    });

    return res.json({
      message: "Je bent nu host!",
      host,
    });

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

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete reviews by this user
    await prisma.review.deleteMany({
      where: { userId: id }
    });

    // Delete bookings by this user
    await prisma.booking.deleteMany({
      where: { userId: id }
    });

    // DO NOT delete hosts — hosts are not linked to users anymore

    // Finally delete the user
    await prisma.user.delete({
      where: { id }
    });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
