import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { errorHandler } from "./src/middleware/error.middleware.js";
import { logger } from "./src/middleware/logger.middleware.js";

import authRoutes from "./src/routes/auth.route.js";
import userRoutes from "./src/routes/user.route.js";
import bookingRoutes from "./src/routes/booking.route.js";
import propertiesRoutes from "./src/routes/property.route.js";
import reviewsRoutes from "./src/routes/review.route.js";
import hostRoutes from "./src/routes/host.route.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import accountRoutes from "./src/routes/account.route.js";
import { loginController } from "./src/controllers/auth.controller.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* ============================================================
   GLOBAL MIDDLEWARE
============================================================ */
app.use(cors());
app.use(express.json());
app.use(logger);

/* ============================================================
   HEALTH CHECK
============================================================ */
app.get("/", (req, res) => {
  res.json({ message: "Booking API is running" });
});

/* ============================================================
   AUTH (login shortcut)
============================================================ */
app.post("/login", loginController);

/* ============================================================
   API ROUTES
============================================================ */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/bookings", bookingRoutes);
app.use("/properties", propertiesRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/hosts", hostRoutes);
app.use("/upload", uploadRoutes);
app.use("/account", accountRoutes);

/* ============================================================
   404 HANDLER
============================================================ */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ============================================================
   GLOBAL ERROR HANDLER
============================================================ */
app.use(errorHandler);

/* ============================================================
   START SERVER
============================================================ */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
