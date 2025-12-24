// src/middleware/error.middleware.js
import { Prisma } from "@prisma/client";

export function errorHandler(err, req, res, next) {
  console.error("❌ ERROR:", err);

  // Prisma: validatiefout (bijv. ontbrekende ID of NaN)
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ error: "Invalid input", message: err.message });
  }

  // Prisma: unieke constraint (bijv. email bestaat al)
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    return res.status(409).json({ error: "Conflict", message: "Unique constraint failed" });
  }

  // Prisma: record niet gevonden
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    return res.status(404).json({ error: "Not found", message: "Record not found" });
  }

  // JWT: token ontbreekt of ongeldig
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Unauthorized", message: "Invalid or missing token" });
  }

  // Alles wat niet specifiek wordt afgevangen
  res.status(500).json({ error: "Internal server error", message: err.message });
}
