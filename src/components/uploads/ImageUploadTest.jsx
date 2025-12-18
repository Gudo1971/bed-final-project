import { useState } from "react";
import { Input, Image, VStack } from "@chakra-ui/react";

export default function ImageUploadTest() {
  const [preview, setPreview] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      console.warn("⚠️ Geen bestand geselecteerd");
      return;
    }

    console.log("📦 Bestand:", file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    console.log("Cloud name:", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    console.log("Preset:", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    // 🔥 Belangrijk: toon Cloudinary foutmelding als die bestaat
    if (data.error) {
      console.error("❌ Cloudinary error:", data.error.message);
      return;
    }

    console.log("🌐 Cloudinary response:", data);
    console.log("✅ Uploaded image URL:", data.secure_url);

    setPreview(data.secure_url);
  };

  return (
    <VStack spacing={4}>
      <Input type="file" accept="image/*" onChange={handleUpload} />
      {preview && <Image src={preview} boxSize="300px" borderRadius="md" />}
    </VStack>
  );
}
