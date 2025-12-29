// ==============================================
// = EDIT PROPERTY MODAL                         =
// = Foto’s beheren + property info bijwerken    =
// ==============================================

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
  useColorModeValue,
} from "@chakra-ui/react";

import { CloseIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  updateProperty,
  uploadPropertyImages,
  deletePropertyImage,
} from "../../api/host";

export default function EditPropertyModal({
  isOpen,
  onClose,
  property,
  token,
  onSuccess,
}) {
  const toast = useToast();

  // ==============================================
  // = DARK MODE COLORS                           =
  // ==============================================
  const labelColor = useColorModeValue("gray.700", "gray.200");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const cardBg = useColorModeValue("gray.100", "gray.700");

  // ==============================================
  // = LOCAL STATE                                =
  // ==============================================
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // ==============================================
  // = REACT HOOK FORM                            =
  // ==============================================
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

  // ==============================================
  // = SYNC FORM + IMAGES BIJ OPENEN              =
  // ==============================================
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

  // ==============================================
  // = PROPERTY UPDATEN (PUT)                     =
  // ==============================================
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

  // ==============================================
  // = FOTO VERWIJDEREN                           =
  // ==============================================
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

  // ==============================================
  // = FOTO’S UPLOADEN                            =
  // ==============================================
  async function handleUploadImages() {
    if (!newImages.length) return;

    try {
      setIsUploading(true);

      const updated = await uploadPropertyImages(
        property.id,
        newImages,
        token
      );

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
      setIsUploading(false);
    }
  }

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />

      <ModalContent borderRadius="lg" overflow="hidden">
        <ModalHeader fontSize="2xl">Property bewerken</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={8} align="stretch">

            {/* ============================================== */}
            {/* = BESTAANDE FOTO’S                            = */}
            {/* ============================================== */}
            <FormControl>
              <FormLabel fontWeight="bold" color={labelColor}>
                Bestaande foto's
              </FormLabel>

              <HStack wrap="wrap" spacing={3}>
                {images.map((img) => (
                  <Box
                    key={img.id}
                    position="relative"
                    bg={cardBg}
                    borderRadius="md"
                    overflow="hidden"
                  >
                    <Image
                      src={img.url}
                      alt="Property"
                      boxSize="100px"
                      objectFit="cover"
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

            {/* ============================================== */}
            {/* = NIEUWE FOTO’S UPLOADEN                      = */}
            {/* ============================================== */}
            <FormControl>
              <FormLabel fontWeight="bold" color={labelColor}>
                Nieuwe foto's toevoegen
              </FormLabel>

              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setNewImages([...e.target.files])}
                color={textColor}
              />

              {!isUploading && newImages.length > 0 && (
                <Button
                  mt={2}
                  size="sm"
                  colorScheme="teal"
                  onClick={handleUploadImages}
                >
                  Upload {newImages.length} foto(s)
                </Button>
              )}

              {isUploading && (
                <>
                  <HStack mt={3}>
                    <Spinner size="sm" color="teal.500" />
                    <Box fontSize="sm" color={labelColor}>
                      Foto's worden geüpload...
                    </Box>
                  </HStack>

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
                </>
              )}
            </FormControl>

            {/* ============================================== */}
            {/* = FORM FIELDS                                 = */}
            {/* ============================================== */}
            <VStack spacing={5} align="stretch">

              <FormControl>
                <FormLabel fontWeight="bold" color={labelColor}>
                  Titel
                </FormLabel>
                <Input
                  {...register("title")}
                  placeholder="Naam van de accommodatie"
                  color={textColor}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold" color={labelColor}>
                  Locatie
                </FormLabel>
                <Input
                  {...register("location")}
                  placeholder="Bijv. Amsterdam, Nederland"
                  color={textColor}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold" color={labelColor}>
                  Prijs per nacht (€)
                </FormLabel>
                <NumberInput min={1}>
                  <NumberInputField
                    {...register("pricePerNight")}
                    color={textColor}
                  />
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold" color={labelColor}>
                  Beschrijving
                </FormLabel>
                <Textarea
                  rows={4}
                  resize="vertical"
                  placeholder="Beschrijf de accommodatie..."
                  {...register("description")}
                  color={textColor}
                />
              </FormControl>

              <HStack spacing={4} flexWrap="wrap">
                <FormControl flex="1">
                  <FormLabel fontWeight="bold" color={labelColor}>
                    Slaapkamers
                  </FormLabel>
                  <NumberInput min={1}>
                    <NumberInputField
                      {...register("bedroomCount")}
                      color={textColor}
                    />
                  </NumberInput>
                </FormControl>

                <FormControl flex="1">
                  <FormLabel fontWeight="bold" color={labelColor}>
                    Badkamers
                  </FormLabel>
                  <NumberInput min={1}>
                    <NumberInputField
                      {...register("bathRoomCount")}
                      color={textColor}
                    />
                  </NumberInput>
                </FormControl>
              </HStack>

              <HStack spacing={4} flexWrap="wrap">
                <FormControl flex="1">
                  <FormLabel fontWeight="bold" color={labelColor}>
                    Max gasten
                  </FormLabel>
                  <NumberInput min={1}>
                    <NumberInputField
                      {...register("maxGuestCount")}
                      color={textColor}
                    />
                  </NumberInput>
                </FormControl>

                <FormControl flex="1">
                  <FormLabel fontWeight="bold" color={labelColor}>
                    Rating
                  </FormLabel>
                  <NumberInput min={0} max={5} step={0.1}>
                    <NumberInputField
                      {...register("rating")}
                      color={textColor}
                    />
                  </NumberInput>
                </FormControl>
              </HStack>

            </VStack>
          </VStack>
        </ModalBody>

        {/* ============================================== */}
        {/* = FOOTER KNOPPEN                              = */}
        {/* ============================================== */}
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
