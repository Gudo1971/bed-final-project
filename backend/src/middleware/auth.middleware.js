import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Geen geldige token meegegeven" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // bevat { id: "uuid" }
    next();
  } catch (error) {
    console.error("❌ TOKEN VERIFICATIE FOUT:", error);
    return res.status(403).json({ error: "Token is ongeldig of verlopen" });
  }
};
