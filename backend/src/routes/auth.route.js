import express from "express";
import { loginController, register } from "../controllers/auth.controller.js";
import authenticateToken from "../middleware/auth.middleware.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/* ============================================================
   LOGIN
============================================================ */
router.post("/login", loginController);

/* ============================================================
   /auth/me — user + host info
============================================================ */
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const { email } = req.user;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const host = await prisma.host.findUnique({ where: { email } });

    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      isHost: !!host,
      hostId: host?.id || null,
    });

  } catch (error) {
    console.error("❌ /me error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/* ============================================================
   REGISTER
============================================================ */
router.post("/register", register);

/* ============================================================
   BECOME HOST — maak Host record aan
============================================================ */
router.post("/become-host", authenticateToken, async (req, res) => {
  try {
    const { email } = req.user;

    // 1. User ophalen
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // 2. Bestaat host al?
    let host = await prisma.host.findUnique({ where: { email } });

    // 3. Zo niet → maak host aan
    if (!host) {
      host = await prisma.host.create({
        data: {
          email: user.email,
          username: user.username,
          password: user.password,
          name: user.name,
          phoneNumber: user.phoneNumber,
          pictureUrl: user.pictureUrl,
          aboutMe: user.aboutMe,
        },
      });
    }

    // 4. Nieuwe JWT genereren
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        isHost: true,
        hostId: host.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. User + token terugsturen
    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        isHost: true,
        hostId: host.id,
      },
      token,
    });

  } catch (error) {
    console.error("❌ /become-host error:", error);
    return res.status(500).json({ error: "Host worden mislukt" });
  }
});

export default router;
