import { Router } from "express";
import {
  getAllUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
} from "../controllers/user.controller.js";
import authenticateToken, { requireHost } from "../middleware/auth.middleware.js";
import { becomeHost } from "../controllers/user.controller.js";

const router = Router();

// GET all users (public)
router.get("/", getAllUsersController);

// GET user by ID (public)
router.get("/:id", getUserByIdController);

// CREATE user (public)
router.post("/", createUserController);

// UPDATE user (public - Winc expects PUT)
router.put("/:id", updateUserController);

router.patch("/become-host", authenticateToken, becomeHost);

// DELETE user (public)
router.delete("/:id", deleteUserController);

export default router;
