import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "../backend/src/middleware/error.middleware.js";
import authRoutes from "./src/routes/auth.route.js";
import userRoutes from "./src/routes/user.route.js";
import bookingRoutes from "./src/routes/booking.route.js";
import propertiesRoutes from "./src/routes/property.route.js";
import reviewsRoutes from "./src/routes/review.route.js";
import hostRoutes from "./src/routes/host.route.js";

import { loginController} from "./src/controllers/auth.controller.js";







dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Booking API is running" });
});



// Routes
app.post("/login", loginController);
app.use("/auth", authRoutes); 
app.use("/users", userRoutes);
app.use("/bookings", bookingRoutes);
app.use("/properties", propertiesRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/hosts", hostRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
