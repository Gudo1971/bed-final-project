import express from "express";
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyBookings
} from "../controllers/property.controller.js";

const router = express.Router();

// READ
router.get("/", getProperties);
router.get("/:id", getProperty);

// CREATE
router.post("/", createProperty);

// UPDATE
router.patch("/:id", updateProperty);
router.put("/:id", updateProperty);


// DELETE
router.delete("/:id", deleteProperty);

// EXTRA
router.get("/:id/bookings", getPropertyBookings);

export default router;
