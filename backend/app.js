import express from 'express';
import cors from 'cors';
import http from "http";
import { Server } from "socket.io";

import propertiesRoutes from './routes/propertiesRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import hostRoutes from "./routes/hostRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ROUTES
app.use("/auth0", authRoutes);
app.get("/", (req, res) => res.send("Hello world!"));
app.use("/properties", propertiesRoutes);
app.use("/users", userRoutes);
app.use("/hosts", hostRoutes);
app.use("/bookings", bookingRoutes);
app.use("/reviews", reviewRoutes);
app.use("/auth", authRoutes);

// ⭐ HTTP SERVER + SOCKET SERVER
const server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
