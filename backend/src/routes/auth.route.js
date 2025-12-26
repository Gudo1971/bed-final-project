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
// /auth/me — ALTIJD CORRECTE USER OF HOST TERUG
// ============================================================
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const { email } = req.user; // <-- BELANGRIJK: email gebruiken

    // 1. Haal user op via email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Check of deze user ook een host-profiel heeft
    const host = await prisma.host.findUnique({
      where: { email }, // koppeling via email
    });

    // 3. Als user een host is → stuur host-id terug
    if (host) {
  return res.json({
    id: user.id,
    hostId: host.id,
    email: user.email,
    name: user.name,
    username: user.username,
    isHost: true,
  });
}


    // 4. Anders: normale user
    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      isHost: false,
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
    const { email } = req.user;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    let host = await prisma.host.findUnique({ where: { email } });

    if (!host) {
      host = await prisma.host.create({
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
        id: host.id,
        username: host.username,
        name: host.name,
        email: host.email,
        isHost: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ token });

  } catch (error) {
    console.error("❌ /become-host error:", error);
    return res.status(500).json({ error: "Host worden mislukt" });
  }
});





export default router;
