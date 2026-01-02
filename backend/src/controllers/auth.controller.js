import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "supersecretkey";

export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Accept BOTH email and username
    const identifier = email || username;

    if (!identifier || !password) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    // Find user by email OR username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token });

  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
