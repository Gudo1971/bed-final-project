import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/sync", async (req, res) => {
  const { auth0Id, email } = req.body;

  if (!auth0Id || !email) {
    return res.status(400).json({ error: "auth0Id and email are required" });
  }

  // ✅ Check of user al bestaat
  let user = await prisma.user.findUnique({
    where: { auth0Id }
  });

  // ✅ Als user niet bestaat → maak nieuwe user aan
  if (!user) {
    user = await prisma.user.create({
      data: {
        auth0Id,
        email,
        username: auth0Id,   // fallback
        password: "auth0",   // irrelevant
        name: "Auth0 User",
        phoneNumber: "",
        pictureUrl: ""
      }
    });
  }

  res.json(user);
});

export default router;
