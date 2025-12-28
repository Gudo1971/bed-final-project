import { Router } from "express";
import {
  getAllHostsController,
  getHostById,
  createHostController,
  updateHost,
  deleteHost,
  getHostEarnings,
} from "../controllers/host.controller.js";

import authenticateToken from "../middleware/auth.middleware.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

/* ============================================================
   GET ALL HOSTS (public)
============================================================ */
router.get("/", getAllHostsController);

/* ============================================================
   GET PROPERTIES FOR LOGGED-IN HOST
============================================================ */
router.get("/properties", authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;

    // ==============================================
    // = HOST OPHALEN VIA EMAIL                     =
    // ==============================================
    const host = await prisma.host.findUnique({
      where: { email },
    });

    if (!host) {
      return res.status(403).json({
        error: "Alleen hosts kunnen hun properties bekijken",
      });
    }

    // ==============================================
    // = PROPERTIES OPHALEN VIA RELATION            =
    // ==============================================
    const properties = await prisma.property.findMany({
      where: {
        host: {
          email: host.email, // ⭐ JUISTE RELATION FILTER
        },
      },
      include: { images: true },
    });

    return res.status(200).json(properties);
  } catch (error) {
    console.error("❌ Error fetching host properties:", error);
    return res.status(500).json({ error: "Failed to fetch properties" });
  }
});



/* ============================================================
   HOST EARNINGS (protected)
============================================================ */
router.get("/:id/earnings", authenticateToken, getHostEarnings);

/* ============================================================
   GET HOST BY ID (public)
============================================================ */
router.get("/:id", getHostById);

/* ============================================================
   CREATE HOST (protected)
============================================================ */
router.post("/", authenticateToken, createHostController);

/* ============================================================
   UPDATE HOST (protected)
============================================================ */
router.put("/:id", authenticateToken, updateHost);

/* ============================================================
   DELETE HOST (protected)
============================================================ */
router.delete("/:id", authenticateToken, deleteHost);

export default router;
