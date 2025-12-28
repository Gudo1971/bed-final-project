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
} from "@chakra-ui/react";

// ==============================================
// = COMPONENT                                   =
// ==============================================
export default function ImageUpload({ images, setImages }) {

  // ==============================================
  // = FILE CHANGE HANDLER                        =
  // ==============================================
  function handleFileChange(e) {
    const files = Array.from(e.target.files);

    // Voeg File objects toe aan bestaande lijst
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
  // = RENDER                                      =
  // ==============================================
  return (
    <Box>
      {/* ============================================== */}
      {/* = LABEL                                        = */}
      {/* ============================================== */}
      <Text fontWeight="bold" mb={2}>
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
      />

      {/* ============================================== */}
      {/* = PREVIEW LIJST                                = */}
      {/* ============================================== */}
      <VStack mt={3} spacing={3} align="stretch">
        {images.map((file, index) => (
          <HStack key={index} spacing={3}>
            <Image
              src={URL.createObjectURL(file)}
              alt="preview"
              boxSize="80px"
              objectFit="cover"
              borderRadius="md"
            />

            <Button
              size="sm"
              colorScheme="red"
              onClick={() => removeImage(index)}
            >
              Verwijderen
            </Button>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
