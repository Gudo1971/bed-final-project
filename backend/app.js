import express from 'express';
import cors from 'cors';
import http from "http";
import { Server } from "socket.io";

import propertiesRoutes from './routes/propertiesRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/auth.js";
import { auth } from "express-oauth2-jwt-bearer";

// Auth0 JWT check (nog niet gebruikt in routes)
const checkJwt = auth({
  audience: "https://staybnb-api/",
  issuerBaseURL: "https://dev-u34emqv2lh0qdxoi.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS voor frontend op localhost:5173
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// ROUTES
app.use("/auth0", authRoutes);
app.get("/", (req, res) => res.send("Hello world!"));
app.use("/properties", propertiesRoutes);
app.use("/users", userRoutes);
app.use("/bookings", bookingRoutes);
app.use("/reviews", reviewRoutes);


// HTTP SERVER + SOCKET SERVER
const server = http.createServer(app);

// ⭐ BELANGRIJK: Socket.IO correct configureren
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"], // Fix voor WebSocket handshake
});

// Socket.IO connectie
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

// Server starten
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
