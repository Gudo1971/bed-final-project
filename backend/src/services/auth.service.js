import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function loginUser(email, password) {
  const user = await prisma.user.findFirst({ where: { email } });

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
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token, user };
}
