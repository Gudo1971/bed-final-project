import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "express-oauth2-jwt-bearer";

const router = express.Router();
const prisma = new PrismaClient();

// Auth0 middleware
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

// ============================================================
// GET /users/me  → huidige ingelogde user ophalen
// ============================================================
router.get("/me", checkJwt, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { auth0Id: req.auth.payload.sub },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to load user" });
  }
});

// ============================================================
// POST /users/become-host  → user wordt host
// ============================================================
router.post("/become-host", checkJwt, async (req, res) => {
  try {
    const updated = await prisma.user.update({
      where: { auth0Id: req.auth.payload.sub },
      data: { isHost: true },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to become host" });
  }
});

export default router;
