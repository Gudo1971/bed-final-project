import express from "express";
import authenticateToken from "../middleware/auth.middleware.js";
import { becomeHost, stopHost } from "../controllers/account.controller.js";

const router = express.Router();

/* ===========================================================
   Account routes
=========================================================== */
router.post("/become-host", authenticateToken, becomeHost);
router.delete("/stop-host", authenticateToken, stopHost);

export default router;
