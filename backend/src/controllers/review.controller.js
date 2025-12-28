import prisma from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

/* ============================================================
   GET ALL REVIEWS FOR A PROPERTY (public)
============================================================ */
export async function getReviews(req, res) {
  try {
    const propertyId = req.params.propertyId;

    if (!propertyId) {
      return res.status(404).json({ error: "Property not found" });
    }

    const reviews = await prisma.review.findMany({
      where: { propertyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            pictureUrl: true,
          },
        },
      },
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
}

/* ============================================================
   GET ONE REVIEW (public)
============================================================ */
export async function getReview(req, res) {
  try {
    const id = req.params.id;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    return res.status(200).json(review);
  } catch (error) {
    console.error("❌ Error fetching review:", error);
    return res.status(500).json({ error: "Failed to fetch review" });
  }
}

/* ============================================================
   CREATE REVIEW (user only)
============================================================ */
export async function createReview(req, res) {
  try {
    const { rating, comment, propertyId } = req.body;
    const userId = req.user.id;

    // Hosts mogen geen reviews plaatsen
    if (req.user.isHost) {
      return res.status(403).json({ error: "Hosts kunnen geen reviews plaatsen" });
    }

    if (!rating || !propertyId) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // User mag maar één review per property
    const existing = await prisma.review.findFirst({
      where: { userId, propertyId },
    });

    if (existing) {
      return res.status(400).json({
        error: "Je hebt deze accommodatie al beoordeeld",
      });
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
    console.error("❌ Error creating review:", error);
    return res.status(500).json({ error: "Failed to create review" });
  }
}

/* ============================================================
   UPDATE REVIEW (owner only)
============================================================ */
export async function updateReview(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Alleen eigenaar mag updaten
    if (existing.userId !== userId) {
      return res.status(403).json({ error: "Geen toegang tot deze review" });
    }

    const { rating, comment } = req.body;

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
    return res.status(500).json({ error: "Failed to update review" });
  }
}

/* ============================================================
   DELETE REVIEW (owner only)
============================================================ */
export async function deleteReview(req, res) {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Alleen eigenaar mag verwijderen
    if (existing.userId !== userId) {
      return res.status(403).json({ error: "Geen toegang tot deze review" });
    }

    await prisma.review.delete({ where: { id } });

    return res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.error("❌ Error deleting review:", error);
    return res.status(500).json({ error: "Failed to delete review" });
  }
}

/* ============================================================
   GET ALL REVIEWS (admin/debug)
============================================================ */
export async function getAllReviews(req, res) {
  try {
    const reviews = await prisma.review.findMany({
      include: { user: true, property: true },
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Error fetching all reviews:", error);
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
}

/* ============================================================
   GET REVIEWS BY USER ID
============================================================ */
export const getReviewsByUserIdController = async (req, res) => {
  try {
    const userId = req.params.userId;

    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            location: true,
            images: true,
            pricePerNight: true,
            rating: true,
          },
        },
      },
    });

    return res.status(200).json(reviews);
  } catch (err) {
    console.error("❌ ERROR (getReviewsByUserId):", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
