// ==============================================
// = PROPERTY ROUTES                            =
// ==============================================

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

import authenticateToken from "../middleware/auth.middleware.js";
import upload from "../../config/cloudinaryStorage.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/* ============================================================
   HELPER: haal hostEmail uit JWT
============================================================ */
function getHostEmail(req) {
  return req.user?.email || null;
}

/* ============================================================
   HOST‑ONLY ROUTES
============================================================ */

/* ------------------------------------------------------------
   ⭐ Properties van ingelogde host
------------------------------------------------------------ */
router.get(
  "/mine",
  authenticateToken,
  async (req, res) => {
    try {
      const hostEmail = getHostEmail(req);

      const properties = await prisma.property.findMany({
        where: { hostEmail },
        include: {
          images: true,
          bookings: true,
          reviews: {
            select: { rating: true }
          }
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

/* ------------------------------------------------------------
   ⭐ GET ALL PROPERTIES (MET REVIEWS)
------------------------------------------------------------ */
router.get("/", async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      include: {
        images: true,
        reviews: {
          select: { rating: true }
        }
      }
    });

    return res.json(properties);
  } catch (err) {
    console.error("❌ Properties ophalen error:", err);
    return res.status(500).json({ error: "Kon properties niet ophalen" });
  }
});

/* ------------------------------------------------------------
   ⭐ GET PROPERTY BY ID (MET REVIEWS)
------------------------------------------------------------ */
router.get("/:id", async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: {
        images: true,
        host: true,
        reviews: true,
        bookings: true
      }
    });

    if (!property) {
      return res.status(404).json({ error: "Property niet gevonden" });
    }

    return res.json(property);
  } catch (err) {
    console.error("❌ Property ophalen error:", err);
    return res.status(500).json({ error: "Kon property niet ophalen" });
  }
});

/* ============================================================
   HOST‑ONLY MUTATION ROUTES
============================================================ */

/* ------------------------------------------------------------
   Nieuwe property aanmaken
------------------------------------------------------------ */
router.post(
  "/",
  authenticateToken,
  upload.array("images", 10),
  createProperty
);

/* ------------------------------------------------------------
   Property updaten (multipart/form-data)
------------------------------------------------------------ */
router.patch(
  "/:id",
  authenticateToken,
  upload.array("images", 10),
  updateProperty
);

/* ------------------------------------------------------------
   Property updaten via JSON
------------------------------------------------------------ */
router.put(
  "/:id",
  authenticateToken,
  updatePropertyJson
);

/* ------------------------------------------------------------
   Property actief/inactief zetten
------------------------------------------------------------ */
router.put(
  "/:id/toggle",
  authenticateToken,
  async (req, res) => {
    try {
      const hostEmail = getHostEmail(req);

      const property = await prisma.property.findUnique({
        where: { id: req.params.id },
      });

      if (!property || property.hostEmail !== hostEmail) {
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
  deleteProperty
);

/* ------------------------------------------------------------
   Foto verwijderen
------------------------------------------------------------ */
router.delete(
  "/:propertyId/images/:imageId",
  authenticateToken,
  deletePropertyImage
);

/* ------------------------------------------------------------
   Boekingen voor property
------------------------------------------------------------ */
router.get(
  "/:id/bookings",
  authenticateToken,
  getPropertyBookings
);

export default router;
