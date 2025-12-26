import { Router } from "express";
import {
  getAllHostsController,
  getHostById,
  createHostController,
  updateHost,
  deleteHost,
} from "../controllers/host.controller.js";
import authenticateToken from "../middleware/auth.middleware.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

/* ============================================================
   GET ALL HOSTS
   ============================================================ */
router.get("/", getAllHostsController);

/* ============================================================
   GET PROPERTIES FOR LOGGED-IN HOST
   ============================================================ */
router.get("/properties", authenticateToken, async (req, res) => {
  try {
    const hostId = req.user.hostId; // ⭐ DIT IS DE FIX

    const properties = await prisma.property.findMany({
      where: { hostId },
      include: { images: true },
    });

    return res.json(properties);
  } catch (error) {
    console.error("Error fetching host properties:", error);
    return res.status(500).json({ error: "Failed to fetch properties" });
  }
});


/* ============================================================
   GET HOST BY ID
   ============================================================ */
router.get("/:id", getHostById);

/* ============================================================
   CREATE HOST
   ============================================================ */
router.post("/", createHostController);

/* ============================================================
   UPDATE HOST
   ============================================================ */
router.put("/:id", updateHost);

/* ============================================================
   DELETE HOST
   ============================================================ */
router.delete("/:id", deleteHost);

export default router;
