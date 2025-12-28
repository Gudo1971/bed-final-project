// src/controllers/auth.controller.js

import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/* ============================================================
   HELPER: JWT genereren
============================================================ */
function generateToken(user, host = null) {
  return jwt.sign(
    {
      id: user.id,          // ⭐ ALTIJD user.id
      email: user.email,
      username: user.username,
      name: user.name,
      isHost: !!host,
      hostId: host?.id || null,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/* ============================================================
   REGISTER
============================================================ */
export const register = async (req, res) => {
  try {
    const { email, username, password, name, phoneNumber } = req.body;

    if (!email || !username || !password || !name) {
      return res.status(400).json({ error: "Vul alle verplichte velden in" });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ error: "Dit email adres is niet beschikbaar" });
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ error: "Gebruikersnaam is al in gebruik" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashed,
        name,
        phoneNumber: phoneNumber ?? null,
        pictureUrl: null,
      },
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: "Account succesvol aangemaakt",
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        isHost: false,
        hostId: null,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ error: "Er ging iets mis, probeer het later opnieuw" });
  }
};

/* ============================================================
   LOGIN
============================================================ */
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Zoek user op
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "Geen account gevonden met dit e-mailadres." });
    }

    // 2. Check wachtwoord
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Het wachtwoord is onjuist." });
    }

    // 3. Check of user ook host is
    const host = await prisma.host.findUnique({ where: { email } });

    // 4. JWT genereren
    const token = generateToken(user, host);

    return res.status(200).json({
      message: "Login succesvol",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        isHost: !!host,
        hostId: host?.id || null,
      },
    });

  } catch (error) {
    console.error("❌ ERROR (loginController):", error);
    return res.status(500).json({ error: "Er ging iets mis tijdens het inloggen." });
  }
};
