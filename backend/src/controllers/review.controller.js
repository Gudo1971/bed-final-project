import prisma from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

// ---------------------------------------------------------
// GET ALL REVIEWS
// ---------------------------------------------------------
export async function getAllReviews(req, res) {
  try {
    const reviews = await prisma.review.findMany({
      include: { user: true, property: true },
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
}

// ---------------------------------------------------------
// GET ONE REVIEW
// ---------------------------------------------------------
export async function getReview(req, res) {
  const id = req.params.id;

  try {
    const review = await prisma.review.findUnique({ where: { id } });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    return res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    return res.status(500).json({ error: "Failed to fetch review" });
  }
}

// ---------------------------------------------------------
// CREATE REVIEW
// ---------------------------------------------------------
export async function createReview(req, res) {
  try {
    const { rating, comment, propertyId } = req.body;

    const userId = req.user?.id || req.user?.sub;

    if (!rating || !propertyId) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingReview = await prisma.review.findFirst({
      where: { userId, propertyId },
    });

    if (existingReview) {
      return res
        .status(409)
        .json({ error: "Review already exists for this property" });
    }

    const review = await prisma.review.create({
      data: { rating, comment, propertyId, userId },
    });

    return res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ error: "Failed to create review" });
  }
}

// ---------------------------------------------------------
// UPDATE REVIEW
// ---------------------------------------------------------
export async function updateReview(req, res) {
  const { id } = req.params;

  try {
    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Review not found" });
    }

    const { rating, comment } = req.body;

    const updated = await prisma.review.update({
      where: { id },
      data: {
        rating: rating ?? existing.rating,
        comment: comment ?? existing.comment,
      },
    });

    return res.status(200).json({ message: "Review updated", review: updated });
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json({ error: "Failed to update review" });
  }
}

// ---------------------------------------------------------
// DELETE REVIEW
// ---------------------------------------------------------
export async function deleteReview(req, res) {
  const { id } = req.params;

  try {
    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Review not found" });
    }

    await prisma.review.delete({ where: { id } });

    return res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ error: "Failed to delete review" });
  }
}
