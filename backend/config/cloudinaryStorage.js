import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  
  cloudinary,
  params: {
    folder: "staybnb",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});
console.log("🔥 Multer storage loaded");
const upload = multer({ storage });

export default upload;
