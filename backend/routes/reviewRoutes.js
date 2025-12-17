import express from "express";
import prisma from "../lib/prisma.js";
import { validate as isUuid } from "uuid";

const router = express.Router();

/* -------------------------------------------
   GET /reviews
------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany();
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   GET /properties/:id/reviews  (specifiek → boven /reviews/:id)
------------------------------------------- */
router.get("/property/:id", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid property ID format" });
  }

  try {
    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const reviews = await prisma.review.findMany({
      where: { propertyId: id },
      include: {
        user: true,
      },
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching property reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   GET /reviews/:id
------------------------------------------- */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid review ID format" });
  }

  try {
    const review = await prisma.review.findUnique({ where: { id } });

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
   POST /reviews
------------------------------------------- */
router.post("/", async (req, res) => {
  const { userId, propertyId, rating, comment } = req.body;

  if (!userId || !propertyId || !rating) {
    return res.status(400).json({
      error: "userId, propertyId and rating are required",
    });
  }

  if (!isUuid(userId) || !isUuid(propertyId)) {
    return res.status(400).json({ error: "Invalid UUID format" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const property = await prisma.property.findUnique({ where: { id: propertyId } });

    if (!user) return res.status(404).json({ error: "User not found" });
    if (!property) return res.status(404).json({ error: "Property not found" });

    const review = await prisma.review.create({
      data: {
        userId,
        propertyId,
        rating: Number(rating),
        comment,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   PUT /reviews/:id
------------------------------------------- */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid review ID format" });
  }

  try {
    const updated = await prisma.review.update({
      where: { id },
      data: { rating: Number(rating), comment },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating review:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   DELETE /reviews/:id
------------------------------------------- */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid review ID format" });
  }

  try {
    await prisma.review.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting review:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
