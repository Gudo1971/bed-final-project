import express from "express";
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  updatePropertyJson,
  deleteProperty,
  deletePropertyImage,   // ⭐ HIER TOEGEVOEGD
  getPropertyBookings
} from "../controllers/property.controller.js";

import authenticateToken, { requireHost } from "../middleware/auth.middleware.js";
import upload from "../../config/cloudinaryStorage.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = express.Router();

/* ============================================================
   PUBLIC ROUTES
============================================================ */

router.get("/", getProperties);
router.get("/:id", getProperty);

/* ============================================================
   HOST-ONLY ROUTES
============================================================ */

// Nieuwe property aanmaken (met Cloudinary upload)
router.post(
  "/",
  authenticateToken,
  requireHost,
  upload.array("images", 10),
  createProperty
);

// Property updaten (met nieuwe foto's — multipart/form-data)
router.patch(
  "/:id",
  authenticateToken,
  requireHost,
  upload.array("images", 10),
  updateProperty
);

// Property updaten via JSON (Edit Modal)
router.put(
  "/:id",
  authenticateToken,
  requireHost,
  updatePropertyJson
);

// Property actief/inactief zetten
router.put(
  "/:id/toggle",
  authenticateToken,
  requireHost,
  async (req, res) => {
    try {
      const property = await prisma.property.update({
        where: { id: req.params.id },
        data: { isActive: req.body.isActive },
      });

      return res.json(property);
    } catch (err) {
      console.error("Toggle error:", err);
      return res.status(500).json({ error: "Kon status niet wijzigen" });
    }
  }
);

// Property verwijderen
router.delete(
  "/:id",
  authenticateToken,
  requireHost,
  deleteProperty
);

// Foto verwijderen
router.delete(
  "/:propertyId/images/:imageId",
  authenticateToken,
  requireHost,
  deletePropertyImage
);

// Boekingen voor property
router.get(
  "/:id/bookings",
  authenticateToken,
  requireHost,
  getPropertyBookings
);

export default router;
