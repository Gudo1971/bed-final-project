import express from "express";
import prisma from "../lib/prisma.js";
import { validate as isUuid } from "uuid";
import { checkJwt } from "../middleware/auth0Middleware.js";

const router = express.Router();

/* -------------------------------------------
   GET /users/me  (Auth0 protected)
   Haalt volledige user + bookings + property op
------------------------------------------- */
router.get("/me", checkJwt, async (req, res) => {
  try {
    const auth0Id = req.user.sub;

    const user = await prisma.user.findUnique({
      where: { auth0Id },
      include: {
        bookings: {
          include: {
            property: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

/* -------------------------------------------
   GET /users
------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   PUT /users/me  (Auth0 protected)
   Wijzigt persoonsgegevens van de ingelogde user
------------------------------------------- */
router.put("/me", checkJwt, async (req, res) => {
  try {
    const auth0Id = req.user.sub;
    const { name, email, phoneNumber, address, pictureUrl } = req.body;

    const updatedUser = await prisma.user.update({
      where: { auth0Id },
      data: {
        name,
        email,
        phoneNumber,
        address,
        pictureUrl
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(500).json({ error: "Failed to update user profile" });
  }
});


/* -------------------------------------------
   GET /users/:id/reviews
------------------------------------------- */
router.get("/:id/reviews", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const reviews = await prisma.review.findMany({
      where: { userId: id },
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   GET /users/:id/bookings
------------------------------------------- */
router.get("/:id/bookings", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: id },
      include: {
        property: true,
      },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   GET /users/:id
------------------------------------------- */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   POST /users
------------------------------------------- */
router.post("/", async (req, res) => {
  const { username, name, email, phoneNumber, pictureUrl } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: "Username and email are required" });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const newUser = await prisma.user.create({
      data: { username, name, email, phoneNumber, pictureUrl },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   PUT /users/:id
------------------------------------------- */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { username, name, email, phoneNumber, pictureUrl } = req.body;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { username, name, email, phoneNumber, pictureUrl },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating user:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

/* -------------------------------------------
   DELETE /users/:id
------------------------------------------- */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
