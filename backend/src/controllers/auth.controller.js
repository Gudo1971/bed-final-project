import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ===============================
// REGISTER
// ===============================
export const register = async (req, res) => {
  try {
    const { email, username, password,name, phoneNumber } = req.body;

    // Missing fields → 400
    if (!email || !username || !password || !name ) {
      return res.status(400).json({ error: "Vul alle verplichte velden in" });
    }

    // Email already exists → 409
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return res.status(409).json({ error: "Dit email adres is niet beschikbaar " });
    }

    // Username already exists → 409
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return res.status(409).json({ error: "Gebruikersnaaam is al in gebruik " });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashed,
        name, 
        phoneNumber: phoneNumber ?? null,
        pictureUrl: null, // optioneel → later via edit modal
      },
    });

    // Create token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({ token, user });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ error: "Er ging iets mis, probeer het later nog een keer " });
  }
};

// ===============================
// LOGIN
// ===============================

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if email exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        error: "Er is geen account gevonden met dit e-mailadres."
      });
    }

    // 2. Check password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        error: "Het wachtwoord is onjuist."
      });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

console.log("LOGIN RETURNING USER:", user);

          // 3. Success
      return res.status(200).json({
        message: "Login succesvol",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });



  } catch (error) {
    console.error("❌ ERROR (loginController):", error);
    return res.status(500).json({ error: "Er ging iets mis tijdens het inloggen." });
  }
};



// ===============================
// EXPORTS
// ===============================
export default {
  register,
  loginController,
};
