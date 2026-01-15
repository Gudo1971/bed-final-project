import { Router } from "express";
import {
  getAllHostsController,
  getHostById,
  createHostController,
  updateHost,
  deleteHost,
  getHostByNameController,
} from "../controllers/host.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

/* ---------------------------------------------------------
   GET ALL HOSTS OR FILTER BY NAME
   /hosts
   /hosts?name=John+Doe
--------------------------------------------------------- */
router.get("/", (req, res, next) => {
  const { name } = req.query;

  if (name) {
    return getHostByNameController(req, res, next);
  }

  return getAllHostsController(req, res, next);
});

/* ---------------------------------------------------------
   GET HOST BY ID
   /hosts/:id
--------------------------------------------------------- */
router.get("/:id", getHostById);

/* ---------------------------------------------------------
   CREATE HOST (requires token)
   /hosts
--------------------------------------------------------- */
router.post("/", authenticateToken, createHostController);

/* ---------------------------------------------------------
   UPDATE HOST (requires token)
   /hosts/:id
--------------------------------------------------------- */
router.put("/:id", updateHost);

/* ---------------------------------------------------------
   DELETE HOST (requires token)
   /hosts/:id
--------------------------------------------------------- */
router.delete("/:id", deleteHost);

export default router;
