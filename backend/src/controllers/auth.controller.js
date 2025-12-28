// src/controllers/auth.controller.js

import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/* ============================================================
   HELPER: JWT genereren
   - bevat ALTIJD user.id
   - bevat host-status + hostId
============================================================ */
function generateToken(user, host = null) {
  return jwt.sign(
    {
      id: user.id,
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
      return res.status(400).json({ error: "Vul alle verplichte velden in." });
    }

    // Email check
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ error: "Dit e-mailadres is al in gebruik." });
    }

    // Username check
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ error: "Gebruikersnaam is al in gebruik." });
    }

    // Wachtwoord hashen
    const hashed = await bcrypt.hash(password, 10);

    // User aanmaken
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

    // Token genereren
    const token = generateToken(user);

    return res.status(201).json({
      message: "Account succesvol aangemaakt.",
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
    console.error("❌ REGISTER ERROR:", error);
    return res.status(500).json({ error: "Er ging iets mis, probeer het later opnieuw." });
  }
};

/* ============================================================
   LOGIN
============================================================ */
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // User ophalen
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Geen account gevonden met dit e-mailadres." });
    }

    // Wachtwoord check
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Het wachtwoord is onjuist." });
    }

    // Host ophalen
    const host = await prisma.host.findUnique({ where: { email } });

    // Token genereren
    const token = generateToken(user, host);

    return res.status(200).json({
      message: "Login succesvol.",
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
    console.error("❌ LOGIN ERROR:", error);
    return res.status(500).json({ error: "Er ging iets mis tijdens het inloggen." });
  }
};
