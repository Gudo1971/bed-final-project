import express from "express";
import upload from "../../config/cloudinaryStorage.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), (req, res) => {
  try {
    return res.json({
      url: req.file.path, // Cloudinary URL
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
