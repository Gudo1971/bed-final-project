import express from "express";
import prisma from "../lib/prisma.js";
import { checkJwt } from "../middleware/auth0Middleware.js";
import { getDbUser } from "../middleware/getDbUser.js";

const router = express.Router();

/* -------------------------------------------
   GET /reviews  → alle reviews
------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: { user: true, property: true },
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   GET /reviews/me  → reviews van ingelogde user
------------------------------------------- */
router.get("/me", checkJwt, getDbUser, async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: req.dbUser.id },
      include: { property: true },
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   GET /reviews/property/:id  → reviews per property
------------------------------------------- */
router.get("/property/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const reviews = await prisma.review.findMany({
      where: { propertyId: id },
      include: { user: true },
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching property reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   GET /reviews/:id  → één review
------------------------------------------- */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const review = await prisma.review.findUnique({
      where: { id },
      include: { user: true, property: true },
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   POST /reviews  → nieuwe review
------------------------------------------- */
router.post("/", checkJwt, getDbUser, async (req, res) => {
  const { propertyId, rating, comment } = req.body;

  if (!propertyId || !rating) {
    return res.status(400).json({
      error: "propertyId and rating are required",
    });
  }

  try {
    const review = await prisma.review.create({
      data: {
        userId: req.dbUser.id,
        propertyId,
        rating: Number(rating),
        comment: comment || "",
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   PUT /reviews/:id  → review updaten (alleen eigenaar)
------------------------------------------- */
router.put("/:id", checkJwt, getDbUser, async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await prisma.review.findUnique({ where: { id } });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.userId !== req.dbUser.id) {
      return res.status(403).json({ error: "Not allowed" });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        rating: Number(rating),
        comment,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   DELETE /reviews/:id  → review verwijderen (alleen eigenaar)
------------------------------------------- */
router.delete("/:id", checkJwt, getDbUser, async (req, res) => {
  const { id } = req.params;

  try {
    const review = await prisma.review.findUnique({ where: { id } });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.userId !== req.dbUser.id) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await prisma.review.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
