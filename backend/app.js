import express from 'express';
import cors from 'cors';
import propertiesRoutes from './routes/propertiesRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors()); // ✅ voeg dit toe
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/properties", propertiesRoutes);
app.use("/properties", reviewRoutes );
app.use("/users", userRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
