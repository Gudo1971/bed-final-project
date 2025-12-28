import { Router } from "express";
import {
  getAllUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
} from "../controllers/user.controller.js";

import authenticateToken from "../middleware/auth.middleware.js";

const router = Router();

/* ============================================================
   PUBLIC ROUTES
============================================================ */
router.get("/", getAllUsersController);
router.get("/:id", getUserByIdController);
router.post("/", createUserController);

/* ============================================================
   PROTECTED ROUTES
============================================================ */
router.put("/:id", authenticateToken, updateUserController);
router.delete("/:id", authenticateToken, deleteUserController);

/* ============================================================
   REMOVED: become-host (moved to /api/account)
============================================================ */
// router.patch("/become-host", authenticateToken, becomeHost);

export default router;
