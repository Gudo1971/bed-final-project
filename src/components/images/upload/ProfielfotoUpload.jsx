// ==============================================
// = PROFILE IMAGE UPLOAD                        =
// = Lokale preview + Cloudinary upload          =
// ==============================================

import {
  Box,
  Text,
  Input,
  Image,
  IconButton,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

import { CloseIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { uploadToCloudinary } from "../../../api/cloudinary"; // jouw upload functie

export default function ProfileImageUpload({ pictureUrl, setPictureUrl }) {
  const cardBg = useColorModeValue("gray.100", "gray.700");
  const labelColor = useColorModeValue("gray.700", "gray.200");

  const [localPreview, setLocalPreview] = useState(null);

  // ==============================================
  // = FILE CHANGE HANDLER                        =
  // ==============================================
  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Lokale preview
    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);

    // Upload naar Cloudinary
    const url = await uploadToCloudinary(file);

    // Update parent state
    setPictureUrl(url);
  }

  // ==============================================
  // = REMOVE IMAGE                               =
  // ==============================================
  function removeImage() {
    setLocalPreview(null);
    setPictureUrl("");
  }

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Box>
      <Text fontWeight="bold" mb={2} color={labelColor}>
        Profielfoto
      </Text>

      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        cursor="pointer"
      />

      {(localPreview || pictureUrl) && (
        <VStack
          mt={4}
          bg={cardBg}
          p={3}
          borderRadius="md"
          boxShadow="sm"
          spacing={3}
        >
          <Image
            src={localPreview || pictureUrl}
            alt="preview"
            boxSize="100px"
            objectFit="cover"
            borderRadius="full"
          />

          <IconButton
            aria-label="Verwijderen"
            icon={<CloseIcon />}
            size="sm"
            colorScheme="red"
            onClick={removeImage}
          />
        </VStack>
      )}
    </Box>
  );
}
