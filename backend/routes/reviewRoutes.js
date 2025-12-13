import express from "express";
import { getReviewsByProperty } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/:id/reviews", getReviewsByProperty);

export default router;
