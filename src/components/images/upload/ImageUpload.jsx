import {
  Box,
  Button,
  Image,
  VStack,
  HStack,
  Text,
  Input,
} from "@chakra-ui/react";

export default function ImageUpload({ images, setImages }) {

  function handleFileChange(e) {
    const files = Array.from(e.target.files);

    // Voeg File objects toe
    setImages([...images, ...files]);
  }

  function removeImage(index) {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  }

  return (
    <Box>
      <Text fontWeight="bold" mb={2}>Foto’s uploaden</Text>

      <Input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />

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
