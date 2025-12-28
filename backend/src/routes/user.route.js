import { Router } from "express";
import {
  getAllUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
  becomeHost,
} from "../controllers/user.controller.js";
import authenticateToken from "../middleware/auth.middleware.js";

const router = Router();

// GET all users (public)
router.get("/", getAllUsersController);

// GET user by ID (public)
router.get("/:id", getUserByIdController);

// CREATE user (public)
router.post("/", createUserController);

// UPDATE user (protected)
router.put("/:id", authenticateToken, updateUserController);

// BECOME HOST (protected)
router.patch("/become-host", authenticateToken, becomeHost);

// DELETE user (protected)
router.delete("/:id", authenticateToken, deleteUserController);

export default router;
