import prisma from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

// ---------------------------------------------------------
// GET ALL REVIEWS FOR A PROPERTY
// ---------------------------------------------------------
export async function getReviews(req, res) {
  const propertyId = req.params.propertyId; // no Number()

  try {
    if (!propertyId || typeof propertyId !== "string") {
      return res.status(404).json({ error: "Property not found" });
    }

    const reviews = await prisma.review.findMany({
      where: { propertyId },
      include: { user: true },
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);

    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({ error: "Invalid input" });
    }

    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
}

// ---------------------------------------------------------
// GET ONE REVIEW
// ---------------------------------------------------------
export async function getReview(req, res) {
  const id = req.params.id; // no Number()

  try {
    if (!id || typeof id !== "string") {
      return res.status(404).json({ error: "Review not found" });
    }

    const review = await prisma.review.findUnique({
      where: { id },
     
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    return res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);

    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({ error: "Invalid input" });
    }

    return res.status(500).json({ error: "Failed to fetch review" });
  }
}

// ---------------------------------------------------------
// CREATE REVIEW
// ---------------------------------------------------------
export async function createReview(req, res) {
  try {
    const { rating, comment, propertyId, userId } = req.body;

    // Negative test expects 400 for invalid input
    if (!rating || !propertyId || !userId) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        propertyId, 
        userId,     
      },
    });

    return res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);

    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({ error: "Invalid input" });
    }

    return res.status(500).json({ error: "Failed to create review" });
  }
}

// ---------------------------------------------------------
// UPDATE REVIEW
// ---------------------------------------------------------


export async function updateReview(req, res) {
  const { id } = req.params;

  try {
    // Validate ID
    if (!id || typeof id !== "string") {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check if review exists
    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Review not found" });
    }

    const { rating, comment } = req.body;

    // Update only allowed fields
    const updated = await prisma.review.update({
      where: { id },
      data: {
        rating: rating ?? existing.rating,
        comment: comment ?? existing.comment,
      },
    });

    return res.status(200).json({
      message: "Review updated",
      review: updated,
    });

  } catch (error) {
    console.error("❌ ERROR (updateReview):", error);

    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({ error: "Invalid input" });
    }

    return res.status(500).json({ error: "Failed to update review" });
  }
}


// ---------------------------------------------------------
// DELETE REVIEW
// ---------------------------------------------------------
export async function deleteReview(req, res) {
  const id = req.params.id; // no Number()

  try {
    if (!id || typeof id !== "string") {
      return res.status(404).json({ error: "Review not found" });
    }

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Review not found" });
    }

    await prisma.review.delete({ where: { id } });

    return res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(404).json({ error: "Review not found" });
    }

    return res.status(500).json({ error: "Failed to delete review" });
  }
}

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
