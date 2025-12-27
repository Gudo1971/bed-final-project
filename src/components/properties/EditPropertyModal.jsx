import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  Image,
  IconButton,
  useToast,
  Box,
  Spinner,
  Skeleton,
} from "@chakra-ui/react";

import { CloseIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { updateProperty, uploadPropertyImages, deletePropertyImage } from "../../api/host";

export default function EditPropertyModal({ isOpen, onClose, property, token, onSuccess }) {
  const toast = useToast();

  // ⭐ LOCAL STATE
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false); // ⭐ FIX

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      location: "",
      pricePerNight: "",
      description: "",
      bedroomCount: "",
      bathRoomCount: "",
      maxGuestCount: "",
      rating: "",
    },
  });

  /* -----------------------------------------------------------
     SYNC FORM + IMAGES WANNEER MODAL OPENT
  ----------------------------------------------------------- */
  useEffect(() => {
    if (property) {
      reset({
        title: property.title,
        location: property.location,
        pricePerNight: property.pricePerNight,
        description: property.description || "",
        bedroomCount: property.bedroomCount || 1,
        bathRoomCount: property.bathRoomCount || 1,
        maxGuestCount: property.maxGuestCount || 1,
        rating: property.rating || 0,
      });

      setImages(property.images || []);
    }
  }, [property, reset]);

  /* -----------------------------------------------------------
     JSON UPDATE (PUT)
  ----------------------------------------------------------- */
  const onSubmit = async (data) => {
    try {
      await updateProperty(property.id, data, token);

      toast({
        title: "Property bijgewerkt",
        status: "success",
        duration: 3000,
      });

      onSuccess();
      onClose();
    } catch (err) {
      toast({
        title: "Fout bij opslaan",
        status: "error",
        duration: 3000,
      });
    }
  };

  /* -----------------------------------------------------------
     FOTO VERWIJDEREN
  ----------------------------------------------------------- */
  async function handleDeleteImage(imageId) {
    try {
      await deletePropertyImage(property.id, imageId, token);

      setImages((prev) => prev.filter((img) => img.id !== imageId));

      toast({
        title: "Foto verwijderd",
        status: "info",
        duration: 3000,
      });

      onSuccess();
    } catch (err) {
      toast({
        title: "Kon foto niet verwijderen",
        status: "error",
        duration: 3000,
      });
    }
  }

  /* -----------------------------------------------------------
     FOTO'S UPLOADEN (met loader)
  ----------------------------------------------------------- */
  async function handleUploadImages() {
    if (!newImages.length) return;

    try {
      setIsUploading(true); // ⭐ START LOADER

      const updated = await uploadPropertyImages(property.id, newImages, token);

      toast({
        title: "Foto's geüpload",
        status: "success",
        duration: 3000,
      });

      setImages(updated.images);
      setNewImages([]);
      onSuccess();
    } catch (err) {
      toast({
        title: "Upload mislukt",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsUploading(false); // ⭐ STOP LOADER
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Property bewerken</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6} align="stretch">

            {/* ---------------- FOTO'S ---------------- */}
            <FormControl>
              <FormLabel>Bestaande foto's</FormLabel>

              <HStack wrap="wrap" spacing={3}>
                {images.map((img) => (
                  <Box key={img.id} position="relative">
                    <Image
                      src={img.url}
                      alt="Property"
                      boxSize="100px"
                      objectFit="cover"
                      borderRadius="md"
                    />

                    <IconButton
                      icon={<CloseIcon />}
                      size="xs"
                      colorScheme="red"
                      position="absolute"
                      top="2px"
                      right="2px"
                      onClick={() => handleDeleteImage(img.id)}
                    />
                  </Box>
                ))}
              </HStack>
            </FormControl>

            {/* ---------------- NIEUWE FOTO'S ---------------- */}
            <FormControl>
              <FormLabel>Nieuwe foto's toevoegen</FormLabel>

              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setNewImages([...e.target.files])}
              />

              {newImages.length > 0 && !isUploading && (
                <Button mt={2} size="sm" colorScheme="teal" onClick={handleUploadImages}>
                  Upload {newImages.length} foto(s)
                </Button>
              )}

              {/* ⭐ Spinner tijdens upload */}
              {isUploading && (
                <HStack mt={3}>
                  <Spinner size="sm" color="teal.500" />
                  <Box fontSize="sm" color="gray.600">Foto's worden geüpload...</Box>
                </HStack>
              )}

              {/* ⭐ Skeleton thumbnails tijdens upload */}
              {isUploading && (
                <HStack wrap="wrap" spacing={3} mt={3}>
                  {[...Array(newImages.length)].map((_, i) => (
                    <Skeleton
                      key={i}
                      height="100px"
                      width="100px"
                      borderRadius="md"
                      startColor="gray.200"
                      endColor="gray.300"
                    />
                  ))}
                </HStack>
              )}
            </FormControl>

            {/* ---------------- FORM FIELDS ---------------- */}
            <FormControl>
              <FormLabel>Titel</FormLabel>
              <Input {...register("title")} />
            </FormControl>

            <FormControl>
              <FormLabel>Locatie</FormLabel>
              <Input {...register("location")} />
            </FormControl>

            <FormControl>
              <FormLabel>Prijs per nacht (€)</FormLabel>
              <NumberInput min={1}>
                <NumberInputField {...register("pricePerNight")} />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Beschrijving</FormLabel>
              <Textarea rows={4} {...register("description")} />
            </FormControl>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Slaapkamers</FormLabel>
                <NumberInput min={1}>
                  <NumberInputField {...register("bedroomCount")} />
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Badkamers</FormLabel>
                <NumberInput min={1}>
                  <NumberInputField {...register("bathRoomCount")} />
                </NumberInput>
              </FormControl>
            </HStack>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Max gasten</FormLabel>
                <NumberInput min={1}>
                  <NumberInputField {...register("maxGuestCount")} />
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Rating</FormLabel>
                <NumberInput min={0} max={5}>
                  <NumberInputField {...register("rating")} />
                </NumberInput>
              </FormControl>
            </HStack>

          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Annuleren
          </Button>
          <Button colorScheme="teal" onClick={handleSubmit(onSubmit)}>
            Opslaan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
