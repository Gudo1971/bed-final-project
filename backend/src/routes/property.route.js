import express from "express";
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  updatePropertyJson,
  deleteProperty,
  deletePropertyImage,
  getPropertyBookings
} from "../controllers/property.controller.js";

import authenticateToken, { requireHost } from "../middleware/auth.middleware.js";
import upload from "../../config/cloudinaryStorage.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/* ============================================================
   HOST‑ONLY ROUTES (moeten BOVEN public routes!)
============================================================ */

/* ------------------------------------------------------------
   ⭐ Alleen properties van de ingelogde host
------------------------------------------------------------ */
router.get(
  "/mine",
  authenticateToken,
  requireHost,
  async (req, res) => {
    try {
      const { hostId } = req.user; // ⭐ JWT bevat hostId

      if (!hostId) {
        return res.status(403).json({ error: "Geen host account gevonden" });
      }

      const properties = await prisma.property.findMany({
        where: { hostId },
        include: {
          images: true,
          bookings: true,
        },
      });

      return res.json(properties);
    } catch (err) {
      console.error("❌ Host properties error:", err);
      return res.status(500).json({ error: "Kon properties niet ophalen" });
    }
  }
);

/* ============================================================
   PUBLIC ROUTES
============================================================ */

router.get("/", getProperties);
router.get("/:id", getProperty);

/* ============================================================
   HOST‑ONLY MUTATION ROUTES
============================================================ */

/* ------------------------------------------------------------
   Nieuwe property aanmaken
------------------------------------------------------------ */
router.post(
  "/",
  authenticateToken,
  requireHost,
  upload.array("images", 10),
  async (req, res, next) => {
    req.body.hostId = req.user.hostId; // ⭐ forceer juiste hostId
    next();
  },
  createProperty
);

/* ------------------------------------------------------------
   Property updaten (multipart/form-data)
------------------------------------------------------------ */
router.patch(
  "/:id",
  authenticateToken,
  requireHost,
  upload.array("images", 10),
  async (req, res, next) => {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
    });

    if (!property || property.hostId !== req.user.hostId) {
      return res.status(403).json({ error: "Geen toegang tot deze property" });
    }

    next();
  },
  updateProperty
);

/* ------------------------------------------------------------
   Property updaten via JSON
------------------------------------------------------------ */
router.put(
  "/:id",
  authenticateToken,
  requireHost,
  async (req, res, next) => {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
    });

    if (!property || property.hostId !== req.user.hostId) {
      return res.status(403).json({ error: "Geen toegang tot deze property" });
    }

    next();
  },
  updatePropertyJson
);

/* ------------------------------------------------------------
   Property actief/inactief zetten
------------------------------------------------------------ */
router.put(
  "/:id/toggle",
  authenticateToken,
  requireHost,
  async (req, res) => {
    try {
      const property = await prisma.property.findUnique({
        where: { id: req.params.id },
      });

      if (!property || property.hostId !== req.user.hostId) {
        return res.status(403).json({ error: "Geen toegang tot deze property" });
      }

      const updated = await prisma.property.update({
        where: { id: req.params.id },
        data: { isActive: req.body.isActive },
      });

      return res.json(updated);
    } catch (err) {
      console.error("❌ Toggle error:", err);
      return res.status(500).json({ error: "Kon status niet wijzigen" });
    }
  }
);

/* ------------------------------------------------------------
   Property verwijderen
------------------------------------------------------------ */
router.delete(
  "/:id",
  authenticateToken,
  requireHost,
  async (req, res, next) => {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
    });

    if (!property || property.hostId !== req.user.hostId) {
      return res.status(403).json({ error: "Geen toegang tot deze property" });
    }

    next();
  },
  deleteProperty
);

/* ------------------------------------------------------------
   Foto verwijderen
------------------------------------------------------------ */
router.delete(
  "/:propertyId/images/:imageId",
  authenticateToken,
  requireHost,
  async (req, res, next) => {
    const property = await prisma.property.findUnique({
      where: { id: req.params.propertyId },
    });

    if (!property || property.hostId !== req.user.hostId) {
      return res.status(403).json({ error: "Geen toegang tot deze property" });
    }

    next();
  },
  deletePropertyImage
);

/* ------------------------------------------------------------
   Boekingen voor property
------------------------------------------------------------ */
router.get(
  "/:id/bookings",
  authenticateToken,
  requireHost,
  async (req, res, next) => {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
    });

    if (!property || property.hostId !== req.user.hostId) {
      return res.status(403).json({ error: "Geen toegang tot deze property" });
    }

    next();
  },
  getPropertyBookings
);

export default router;
