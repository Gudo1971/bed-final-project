import express from "express";
import {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllReviews);
router.get("/:id", getReview);

router.post("/", authenticateToken, createReview);

router.put("/:id", updateReview);
router.patch("/:id", updateReview);

router.delete("/:id", deleteReview);

export default router;
