import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    console.log("LOGIN START", req.body);

    const { username, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { username },
    });

    console.log("USER RESULT", user);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (password !== user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ⭐ DIT is wat de test wil
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error("LOGIN ERROR >>>", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
