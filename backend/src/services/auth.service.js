import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ============================================================
   HELPER: generate JWT
============================================================ */
function generateToken(user, isHost) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      isHost,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/* ============================================================
   LOGIN USER
============================================================ */
export async function loginUser(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw { status: 401, message: "Invalid credentials" };
  }

  // Check host status
  const host = await prisma.host.findUnique({
    where: { email: user.email },
  });

  const token = generateToken(user, !!host);

  return {
    token,
    user,
    isHost: !!host,
  };
}

/* ============================================================
   REGISTER USER
============================================================ */
export async function registerUser(email, password, username) {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw { status: 409, message: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username,
    },
  });

  // New users are never hosts
  const token = generateToken(user, false);

  return {
    token,
    user,
    isHost: false,
  };
}
