import prisma from "../lib/prisma.js";

export async function getReviewsByProperty(req, res) {
  const { id } = req.params;

  try {
    const reviews = await prisma.review.findMany({
      where: { propertyId: id },
      include: {
        user: {
          select: { name: true }
        }
      }
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
}
