import express from "express";
import { getReviewsByProperty } from "../controllers/reviewController.js";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.post("/", async (req, res)=>{
    try{
        const{userId, propertyId, rating, comment} = req.body;

        const review = await prisma.review.create({
            data: {
                userId,
                propertyId,
                rating: Number(rating),
                comment,
            
            },
        });
        
            res.status(201).json(review);
        } catch(error){
            console.error("Error creating review:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    
});

// ✅ GET /properties/:id/reviews

router.get("/:id/reviews", getReviewsByProperty);

export default router;
