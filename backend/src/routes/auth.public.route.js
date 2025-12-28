import express from "express";
import { loginController, register } from "../controllers/auth.controller.js";

const router = express.Router();

/* ============================================================
   AUTH ROUTES
============================================================ */
router.post("/login", loginController);
router.post("/register", register);

export default router;
