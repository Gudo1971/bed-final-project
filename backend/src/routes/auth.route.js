import express from "express";
import { login,register } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// LOGIN
router.post("/login", login);
console.log("AUTH ROUTE FILE IS LOADED");

// CHECK TOKEN
router.get("/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

//register route

router.post("/register", register);


export default router;
