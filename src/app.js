import express from 'express';
import propertiesRoutes from './routes/propertiesRoutes.js';

const app =express();
app.use (express.json());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/properties", propertiesRoutes);

export default app;

