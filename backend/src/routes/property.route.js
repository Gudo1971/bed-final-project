import express from "express";
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyBookings,
} from "../controllers/property.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ---------------------------------------------------------
   GET ALL PROPERTIES OR FILTER BY QUERY
   /properties
   /properties?location=Malibu
   /properties?pricePerNight=310.25
   /properties?location=Malibu&pricePerNight=310.25
   --------------------------------------------------------- */
router.get("/", getProperties);

/* ---------------------------------------------------------
   OPTIONAL: GET BOOKINGS FOR A PROPERTY
   /properties/:id/bookings
   --------------------------------------------------------- */
router.get("/:id/bookings", getPropertyBookings);

/* ---------------------------------------------------------
   GET PROPERTY BY ID
   /properties/:id
   --------------------------------------------------------- */
router.get("/:id", getProperty);

/* ---------------------------------------------------------
   CREATE PROPERTY (requires token)
   /properties
   --------------------------------------------------------- */
router.post("/", authenticateToken, createProperty);

/* ---------------------------------------------------------
   UPDATE PROPERTY (requires token)
   /properties/:id
   --------------------------------------------------------- */
router.put("/:id", updateProperty);
router.patch("/:id", updateProperty);

/* ---------------------------------------------------------
   DELETE PROPERTY (requires token)
   /properties/:id
   --------------------------------------------------------- */
router.delete("/:id", deleteProperty);

export default router;
