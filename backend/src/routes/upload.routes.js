import express from "express";
import upload from "../../config/cloudinaryStorage.js";
import authenticateToken from "../middleware/auth.middleware.js";

const router = express.Router();

/* ============================================================
   IMAGE UPLOAD (authenticated users only)
============================================================ */
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Geen afbeelding ontvangen" });
      }

      return res.status(200).json({
        url: req.file.path, // Cloudinary URL
      });
    } catch (err) {
      console.error("❌ Upload error:", err);
      return res.status(500).json({ error: "Upload failed" });
    }
  }
);

export default router;
