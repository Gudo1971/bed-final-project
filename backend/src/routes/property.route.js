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

router.get("/", getProperties);
router.get("/:id/bookings", getPropertyBookings);
router.get("/:id", getProperty);
router.post("/", createProperty);
router.patch("/:id", updateProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);

export default router;
