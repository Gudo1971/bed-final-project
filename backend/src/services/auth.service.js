import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function loginUser(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token, user };
}

export async function registerUser(email, password, username) {
  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (existing) {
    throw { status: 409, message: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username
    }
  });

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token, user };
}
