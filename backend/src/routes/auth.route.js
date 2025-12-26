import express from "express";
import { loginController, register } from "../controllers/auth.controller.js";
import authenticateToken from "../middleware/auth.middleware.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// ============================================================
// LOGIN
// ============================================================
router.post("/login", loginController);

console.log("✅ AUTH ROUTE FILE IS LOADED");

// ============================================================
// CHECK TOKEN / CURRENT USER
// ============================================================
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const { id, email } = req.user;

    // Probeer user op te halen
    const user = await prisma.user.findUnique({ where: { id } });

    // Als user niet bestaat → probeer host
    if (!user) {
      const host = await prisma.host.findUnique({ where: { id } });

      if (!host) {
        return res.status(404).json({ error: "Gebruiker niet gevonden" });
      }

      return res.json({
        ...host,
        isHost: true,
      });
    }

    // Check of user ook host is
    const host = await prisma.host.findUnique({ where: { email: user.email } });

    return res.json({
      ...user,
      isHost: !!host,
    });
  } catch (error) {
    console.error("❌ /me error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================
// REGISTER
// ============================================================
router.post("/register", register);

// ============================================================
// BECOME HOST — user → host
// ============================================================
router.post("/become-host", authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const existingHost = await prisma.host.findUnique({ where: { email: user.email } });

    if (!existingHost) {
      await prisma.host.create({
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
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        isHost: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Je bent nu een host!",
      token,
    });
  } catch (error) {
    console.error("❌ /become-host error:", error);
    return res.status(500).json({ error: "Host worden mislukt" });
  }
});

export default router;
