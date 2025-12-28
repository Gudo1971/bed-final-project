import express from "express";
import authenticateToken from "../middleware/auth.middleware.js";

import {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  getReviewsByUserIdController
} from "../controllers/review.controller.js";

const router = express.Router();

/* ============================================================
   PUBLIC ROUTES
============================================================ */
router.get("/", getAllReviews);
router.get("/property/:propertyId", getReviews);
router.get("/user/:userId", getReviewsByUserIdController);
router.get("/:id", getReview);

/* ============================================================
   AUTHENTICATED USER ROUTES (NO HOSTS)
============================================================ */

// Create review
router.post("/", authenticateToken, createReview);

// Update review (only owner)
router.patch("/:id", authenticateToken, updateReview);
router.put("/:id", authenticateToken, updateReview);

// Delete review (only owner)
router.delete("/:id", authenticateToken, deleteReview);

export default router;
