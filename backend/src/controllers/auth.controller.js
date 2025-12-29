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
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      phoneNumber: user.phoneNumber,
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

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ error: "Dit e-mailadres is al in gebruik." });
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ error: "Gebruikersnaam is al in gebruik." });
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
      message: "Account succesvol aangemaakt.",
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
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

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Geen account gevonden met dit e-mailadres." });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Het wachtwoord is onjuist." });
    }

    const host = await prisma.host.findUnique({ where: { email } });

    const token = generateToken(user, host);

    return res.status(200).json({
      message: "Login succesvol.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
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

/* ============================================================
   UPDATE PROFILE
============================================================ */
export const updateProfile = async (req, res) => {
  try {
    const { email } = req.user;
    const { name, phoneNumber, email: newEmail } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Gebruiker niet gevonden." });
    }

    if (newEmail && newEmail !== email) {
      const existing = await prisma.user.findUnique({
        where: { email: newEmail },
      });

      if (existing) {
        return res.status(409).json({
          error: "Dit nieuwe e-mailadres is al in gebruik.",
        });
      }
    }

    const updated = await prisma.user.update({
      where: { email },
      data: {
        name,
        phoneNumber,
        email: newEmail || email,
      },
    });

    const host = await prisma.host.findUnique({
      where: { email },
    });

    if (host && newEmail && newEmail !== email) {
      await prisma.host.update({
        where: { email },
        data: { email: newEmail },
      });
    }

    const updatedHost = newEmail
      ? await prisma.host.findUnique({ where: { email: newEmail } })
      : host;

    const token = generateToken(updated, updatedHost);

    return res.json({
      message: "Profiel succesvol bijgewerkt.",
      token,
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        phoneNumber: updated.phoneNumber,
        username: updated.username,
        isHost: !!updatedHost,
        hostId: updatedHost?.id || null,
      },
    });

  } catch (error) {
    console.error("❌ UPDATE PROFILE ERROR:", error);
    return res.status(500).json({ error: "Kon profiel niet bijwerken." });
  }
};

/* ============================================================
   CHECK EMAIL BESTAAT?
============================================================ */
export const checkEmailExists = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is verplicht." });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({
        error: "We hebben geen account gevonden met dit email adres",
      });
    }

    return res.status(200).json({ exists: true });
  } catch (err) {
    console.error("❌ Error in checkEmailExists:", err);
    return res.status(500).json({
      error: "Er ging iets mis bij het controleren van het email adres.",
    });
  }
};
