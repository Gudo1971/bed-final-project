export function errorHandler(err, req, res, next) {
  console.error("❌ ERROR:", err);

  // Prisma: record not found
  if (err.code === "P2025") {
    return res.status(404).json({
      error: "Record not found",
      details: err.meta?.cause || null,
    });
  }

  // Prisma: unique constraint
  if (err.code === "P2002") {
    return res.status(409).json({
      error: "Duplicate value",
      details: err.meta?.target || null,
    });
  }

  // Prisma: foreign key constraint
  if (err.code === "P2003") {
    return res.status(400).json({
      error: "Invalid reference",
      details: err.meta?.field_name || null,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expired" });
  }

  // Default fallback
  return res.status(500).json({
    error: "Internal server error",
    message: err.message || "Something went wrong",
  });
}
