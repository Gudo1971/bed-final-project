import express from "express";
import { PrismaClient } from "@prisma/client";
import { checkJwt } from "../middleware/auth0Middleware.js";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/sync", checkJwt, async (req, res) => {
  console.log("req.user:", req.user);
  console.log("req.body:", req.body);

  if (!req.user || !req.user.sub) {
    return res.status(401).json({ error: "Unauthorized: invalid or missing token" });
  }
const rawSub = req.user.sub;
const isGoogleSub = rawSub.startsWith("google-oauth2|");
const auth0Id = isGoogleSub ? `auth0|${rawSub.split("|")[1]}` : rawSub;

  const { email } = req.body;


  if (!auth0Id || !email) {
    return res.status(400).json({ error: "auth0Id and email are required" });
  }

  let user = await prisma.user.findUnique({
    where: { auth0Id }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        auth0Id,
        email,
        username: auth0Id,
        password: "auth0",
        name: "Auth0 User",
        phoneNumber: "",
        pictureUrl: ""
      }
    });
  }

  res.json(user);
});

export default router;
