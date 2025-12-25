import express from "express";
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

router.get("/", getAllReviews);
router.get("/property/:propertyId", getReviews);
router.get("/user/:userId", getReviewsByUserIdController);
router.get("/:id", getReview);

router.post("/", createReview);
router.patch("/:id", updateReview);
router.put("/:id", updateReview);

router.delete("/:id", deleteReview);

export default router;
