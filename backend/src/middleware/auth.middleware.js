import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ============================================================
// AUTHENTICATIE: controleer of token geldig is
// ============================================================
export default function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Geen geldige token meegegeven" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ TOKEN VERIFICATIE FOUT:", error);
    return res.status(403).json({ error: "Token is ongeldig of verlopen" });
  }
}

// ============================================================
// AUTORISATIE: alleen hosts mogen host-routes gebruiken
// ============================================================
export async function requireHost(req, res, next) {
  try {
    const host = await prisma.host.findUnique({
      where: { email: req.user.email },
    });

    if (!host) {
      return res.status(403).json({ error: "Alleen hosts mogen deze actie uitvoeren" });
    }

    next();
  } catch (error) {
    console.error("❌ requireHost error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
