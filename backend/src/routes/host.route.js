import { Router } from "express";
import {
  getAllHostsController,
  getHostById,
  createHostController,
  updateHost,
  deleteHost,
} from "../controllers/host.controller.js";

const router = Router();

// GET all hosts
router.get("/", getAllHostsController);

// GET host by ID
router.get("/:id", getHostById);

// CREATE host
router.post("/", createHostController);

// UPDATE host
router.put("/:id", updateHost);

// DELETE host
router.delete("/:id", deleteHost);

export default router;
