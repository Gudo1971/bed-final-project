import { Router } from "express";
import {
  getAllUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
  getUserByUsernameController,
  getUserByEmailController,
} from "../controllers/user.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

/* ---------------------------------------------------------
   GET ALL USERS OR FILTER BY QUERY
   /users
   /users?username=jdoe
   /users?email=john@example.com
   --------------------------------------------------------- */
router.get("/", (req, res, next) => {
  const { username, email } = req.query;

  if (username) {
    return getUserByUsernameController(req, res, next);
  }

  if (email) {
    return getUserByEmailController(req, res, next);
  }

  return getAllUsersController(req, res, next);
});

/* ---------------------------------------------------------
   GET USER BY ID
   /users/:id
   --------------------------------------------------------- */
router.get("/:id", getUserByIdController);

/* ---------------------------------------------------------
   CREATE USER (requires token)
   /users
   --------------------------------------------------------- */
router.post("/", createUserController);

/* ---------------------------------------------------------
   UPDATE USER (requires token)
   /users/:id
   --------------------------------------------------------- */
router.put("/:id", updateUserController);

/* ---------------------------------------------------------
   DELETE USER (requires token)
   /users/:id
   --------------------------------------------------------- */
router.delete("/:id", deleteUserController);

export default router;
