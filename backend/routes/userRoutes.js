import express from "express";
import prisma from "../lib/prisma.js";
import { validate as isUuid } from "uuid";

const router = express.Router();

// ✅ GET /users/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

   // ✅ UUID-validatie
  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });


    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ GET /users/:id/reviews
router.get("/:id/reviews", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)){
    return res.status(400).json({error: "invalid user Id Format"});
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id } });

    if(!user){
        return res.status(404).json({ error: "User not found" });
    }

    const reviews = await prisma.review.findMany({
      where: { userId: id },
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ GET /users/:id/bookings
router.get("/:id/bookings", async (req, res) => {
  const { id } = req.params;
if (!isUuid(id)){
    return res.status(400).json({error: "invalid user Id Format"});
  }

  try {
    const user = await prisma.user.findUnique({
        where: { id }});
        
        if(!user){ 
            return res.status(404).json({ error: "User not found" });
            }
            const bookings = await prisma.booking.findMany({        
      where: { userId: id },
      include: {
        property: true, // optioneel: geeft property info mee
      },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;