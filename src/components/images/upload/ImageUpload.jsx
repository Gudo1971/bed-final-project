// ==============================================
// = IMAGE UPLOAD                                =
// = Lokale previews + verwijderen               =
// ==============================================

import {
  Box,
  Button,
  Image,
  VStack,
  HStack,
  Text,
  Input,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";

import { CloseIcon } from "@chakra-ui/icons";
import { useEffect } from "react";

// ==============================================
// = COMPONENT                                   =
// ==============================================
export default function ImageUpload({ images, setImages }) {
  const cardBg = useColorModeValue("gray.100", "gray.700");
  const labelColor = useColorModeValue("gray.700", "gray.200");

  // ==============================================
  // = FILE CHANGE HANDLER                        =
  // ==============================================
  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  }

  // ==============================================
  // = REMOVE IMAGE                               =
  // ==============================================
  function removeImage(index) {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  }

  // ==============================================
  // = URL CLEANUP (memory leak prevention)       =
  // ==============================================
  useEffect(() => {
    return () => {
      images.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [images]);

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Box>
      {/* ============================================== */}
      {/* = LABEL                                        = */}
      {/* ============================================== */}
      <Text fontWeight="bold" mb={2} color={labelColor}>
        Foto’s uploaden
      </Text>

      {/* ============================================== */}
      {/* = FILE INPUT                                   = */}
      {/* ============================================== */}
      <Input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        cursor="pointer"
      />

      {/* ============================================== */}
      {/* = PREVIEW LIJST                                = */}
      {/* ============================================== */}
      <VStack mt={4} spacing={3} align="stretch">
        {images.map((file, index) => {
          const previewUrl = URL.createObjectURL(file);

          return (
            <HStack
              key={index}
              spacing={3}
              bg={cardBg}
              p={2}
              borderRadius="md"
              boxShadow="sm"
              _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
              transition="all 0.2s ease"
            >
              <Image
                src={previewUrl}
                alt="preview"
                boxSize="80px"
                objectFit="cover"
                borderRadius="md"
              />

              <IconButton
                aria-label="Verwijderen"
                icon={<CloseIcon />}
                size="sm"
                colorScheme="red"
                onClick={() => removeImage(index)}
              />
            </HStack>
          );
        })}
      </VStack>
    </Box>
  );
}
