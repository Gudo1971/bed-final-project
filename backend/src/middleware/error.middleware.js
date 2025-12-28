// src/middleware/error.middleware.js
import { Prisma } from "@prisma/client";

export function errorHandler(err, req, res, next) {
  console.error("❌ ERROR:", err);

  /* ============================================================
     PRISMA VALIDATION ERROR (bijv. verkeerde types, NaN, null)
  ============================================================= */
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      error: "Invalid input",
      message: err.message,
    });
  }

  /* ============================================================
     PRISMA UNIQUE CONSTRAINT (P2002)
  ============================================================= */
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    return res.status(409).json({
      error: "Conflict",
      message: "Unique constraint failed",
    });
  }

  /* ============================================================
     PRISMA RECORD NOT FOUND (P2025)
  ============================================================= */
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    return res.status(404).json({
      error: "Not found",
      message: "Record not found",
    });
  }

  /* ============================================================
     PRISMA FOREIGN KEY CONSTRAINT (P2003)
     - komt vaak voor bij delete van gekoppelde records
  ============================================================= */
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
    return res.status(400).json({
      error: "Invalid operation",
      message: "Foreign key constraint failed",
    });
  }

  /* ============================================================
     JWT ERROR (alleen relevant als een library UnauthorizedError gooit)
  ============================================================= */
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or missing token",
    });
  }

  /* ============================================================
     FALLBACK: INTERNAL SERVER ERROR
  ============================================================= */
  return res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
}
