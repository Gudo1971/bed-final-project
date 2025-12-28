import { Prisma } from "@prisma/client";

export function errorHandler(err, req, res, next) {
  console.error("❌ ERROR:", err);

  /* ============================================================
     PRISMA: RECORD NOT FOUND (P2025)
  ============================================================= */
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    return res.status(404).json({
      error: "Record not found",
      details: err.meta?.cause || null,
    });
  }

  /* ============================================================
     PRISMA: UNIQUE CONSTRAINT (P2002)
  ============================================================= */
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    return res.status(409).json({
      error: "Duplicate value",
      details: err.meta?.target || null,
    });
  }

  /* ============================================================
     PRISMA: FOREIGN KEY CONSTRAINT (P2003)
  ============================================================= */
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
    return res.status(400).json({
      error: "Invalid reference",
      details: err.meta?.field_name || null,
    });
  }

  /* ============================================================
     JWT ERRORS
  ============================================================= */
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expired" });
  }

  if (err.name === "NotBeforeError") {
    return res.status(401).json({ error: "Token not active yet" });
  }

  /* ============================================================
     DEFAULT FALLBACK
  ============================================================= */
  return res.status(500).json({
    error: "Internal server error",
    message: err.message || "Something went wrong",
  });
}
