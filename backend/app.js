import express from 'express';
import cors from 'cors';
import propertiesRoutes from './routes/propertiesRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import hostRoutes from "./routes/hostRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use ("/auth0", authRoutes);

app.use(cors()); // ✅ voeg dit toe
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/properties", propertiesRoutes);

app.use("/users", userRoutes);
app.use("/hosts", hostRoutes);
app.use("/bookings", bookingRoutes);
app.use("/reviews", reviewRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
