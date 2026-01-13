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

/* ---------------------------------------------------------
   GET DISABLED DATES FOR PROPERTY
--------------------------------------------------------- */
router.get(
  "/disabled-dates/:propertyId",
  getDisabledDatesByPropertyIdController
);

/* ---------------------------------------------------------
   GET ALL BOOKINGS
--------------------------------------------------------- */
router.get("/", getAllBookingsController);

/* ---------------------------------------------------------
   GET BOOKINGS BY USER ID
--------------------------------------------------------- */
router.get("/user/:userId", getBookingsByUserIdController);

/* ---------------------------------------------------------
   GET BOOKINGS BY PROPERTY ID
--------------------------------------------------------- */
router.get("/property/:propertyId", getBookingsByPropertyIdController);

/* ---------------------------------------------------------
   GET BOOKING BY ID
--------------------------------------------------------- */
router.get("/:id", getBookingByIdController);

/* ---------------------------------------------------------
   UPDATE BOOKING (requires token)
--------------------------------------------------------- */
router.patch("/:id", updateBookingController);
router.put("/:id", updateBookingController);

/* ---------------------------------------------------------
   CREATE BOOKING (requires token)
--------------------------------------------------------- */
router.post("/", createBookingController);

/* ---------------------------------------------------------
   DELETE BOOKING (requires token)
--------------------------------------------------------- */
router.delete("/:id", deleteBookingController);

export default router;
