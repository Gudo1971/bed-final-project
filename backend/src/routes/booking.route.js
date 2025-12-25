import { Router } from "express";
import {
  createBookingController,
  getAllBookingsController,
  getBookingByIdController,
  getBookingsByUserIdController,
  getBookingsByPropertyIdController,
  deleteBookingController,
  updateBookingController,
  getDisabledDatesByPropertyIdController,
} from "../controllers/booking.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/disabled-dates/:propertyId",
  getDisabledDatesByPropertyIdController
);

// GET all bookings
router.get("/", getAllBookingsController);

// GET bookings by userId
router.get("/user/:userId", getBookingsByUserIdController);

// GET bookings by propertyId
router.get("/property/:propertyId", getBookingsByPropertyIdController);

// GET booking by ID (dynamic route LAST)
router.get("/:id", getBookingByIdController);

// PATCH booking
router.patch("/:id",  updateBookingController);
router.put("/:id",  updateBookingController);


// POST create booking
router.post("/",authenticateToken, createBookingController);

// DELETE booking
router.delete("/:id",authenticateToken, deleteBookingController);



export default router;
