import express from "express";
import {
  loginController,
  register,
  updateProfile,
  checkEmailExists
} from "../controllers/auth.controller.js";

import authenticateToken from "../middleware/auth.middleware.js";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/* ============================================================
   LOGIN
============================================================ */
router.post("/login", loginController);

/* ============================================================
   DIRECTE EMAIL CHECK
   - gebruikt door LoginPage
============================================================ */
router.get("/check-email", checkEmailExists);

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
      phoneNumber: user.phoneNumber,
      isHost: Boolean(host),
      hostId: host?.id || null,
    });

  } catch (error) {
    console.error("❌ /auth/me error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

/* ============================================================
   REGISTER
============================================================ */
router.post("/register", register);

/* ============================================================
   UPDATE PROFILE
============================================================ */
router.patch("/update-profile", authenticateToken, updateProfile);

/* ============================================================
   UPDATE PASSWORD
============================================================ */
router.patch("/password", authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { email } = req.user;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.password) {
      return res.status(400).json({
        error: "Dit account heeft geen lokaal wachtwoord. Gebruik Auth0 login."
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Het wachtwoord is onjuist." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashed },
    });

    return res.json({ message: "Wachtwoord succesvol gewijzigd." });

  } catch (error) {
    console.error("❌ /auth/password error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

/* ============================================================
   EXPORT
============================================================ */
export default router;
