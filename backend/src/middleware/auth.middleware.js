import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const authenticateToken = (req, res, next) => {
  const header = req.headers["authorization"];

  if (!header) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id: "uuid" }
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
