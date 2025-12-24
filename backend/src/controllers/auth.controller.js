import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ===============================
// REGISTER
// ===============================
export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Missing fields → 400
    if (!email || !username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Email already exists → 409
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Username already exists → 409
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return res.status(409).json({ error: "Username already in use" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashed,
      },
    });

    // Create token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({ token, user });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// ===============================
// LOGIN
// ===============================
export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const identifier = email || username;

    if (!identifier || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const user = await prisma.user.findUnique({
      where: email ? { email } : { username },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({ token, user });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


// ===============================
// EXPORTS
// ===============================
export default {
  register,
  login,
};
