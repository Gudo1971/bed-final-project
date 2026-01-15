import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { errorHandler } from "./src/middleware/error.middleware.js";

import { login } from "./src/controllers/auth.controller.js";
import userRoutes from "./src/routes/user.route.js";
import bookingRoutes from "./src/routes/booking.route.js";
import propertiesRoutes from "./src/routes/property.route.js";
import reviewsRoutes from "./src/routes/review.route.js";
import hostRoutes from "./src/routes/host.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log("➡️ METHOD:", req.method);
  console.log("➡️ PATH:", req.path);
  console.log("➡️ QUERY:", req.query);
  next();
});

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Booking API is running" });
});

// ONLY THIS LOGIN ROUTE
app.post("/login", login);

// API routes
app.use("/users", userRoutes);
app.use("/bookings", bookingRoutes);
app.use("/properties", propertiesRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/hosts", hostRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
