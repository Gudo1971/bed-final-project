import express from "express";
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyBookings
} from "../controllers/property.controller.js";

import authenticateToken, { requireHost } from "../middleware/auth.middleware.js";
import upload from "../../config/cloudinaryStorage.js";

const router = express.Router();

/* ============================================================
   PUBLIC ROUTES
============================================================ */

// Iedereen mag properties bekijken
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

// Property updaten (optioneel met nieuwe foto's)
router.patch(
  "/:id",
  authenticateToken,
  requireHost,
  upload.array("images", 10),
  updateProperty
);

// Property verwijderen
router.delete(
  "/:id",
  authenticateToken,
  requireHost,
  deleteProperty
);

// Boekingen voor property
router.get(
  "/:id/bookings",
  authenticateToken,
  requireHost,
  getPropertyBookings
);

export default router;
