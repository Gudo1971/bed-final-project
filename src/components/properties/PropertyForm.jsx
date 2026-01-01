// ==============================================
// = PROPERTY FORM                               =
// = Nieuwe property aanmaken (host)             =
// ==============================================

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  VStack,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

import { useState } from "react";
import ImageUpload from "../images/upload/ImageUpload.jsx";

// 👉 JOUW AXIOS INSTANCE
import api from "../../api/axios.js";

export default function PropertyForm({ isOpen, onClose, onSuccess }) {
  const toast = useToast();

  // ==============================================
  // = DARK MODE COLORS                           =
  // ==============================================
  const labelColor = useColorModeValue("gray.700", "gray.200");
  const textColor = useColorModeValue("gray.800", "gray.100");

  // ==============================================
  // = FORM STATE                                 =
  // ==============================================
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerNight, setPricePerNight] = useState(50);
  const [guestCount, setGuestCount] = useState(1);
  const [bedroomCount, setBedroomCount] = useState(1);
  const [bathRoomCount, setBathRoomCount] = useState(1);

  // ==============================================
  // = IMAGE STATE                                =
  // ==============================================
  const [images, setImages] = useState([]);

  // ==============================================
  // = LOADING STATE                              =
  // ==============================================
  const [loading, setLoading] = useState(false);

  // ==============================================
  // = SUBMIT HANDLER (AXIOS INSTANCE)            =
  // ==============================================
  async function handleSubmit() {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("pricePerNight", pricePerNight);
      formData.append("maxGuestCount", guestCount);
      formData.append("bedroomCount", bedroomCount);
      formData.append("bathRoomCount", bathRoomCount);

      images.forEach((file) => {
        formData.append("images", file);
      });

      // 👉 axios instance regelt:
      // - baseURL
      // - /api prefix
      // - Authorization header
      // - error flattening
      await api.post("/properties", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Property toegevoegd",
        status: "success",
        duration: 3000,
      });

      onSuccess();
      onClose();
    } catch (err) {
      toast({
        title: "Fout bij opslaan",
        description: err.error || "Kon de property niet aanmaken.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      autoFocus={false}
      trapFocus={false}
    >
      <ModalOverlay />

      <ModalContent borderRadius="lg">
        <ModalHeader color={textColor}>Nieuwe Property</ModalHeader>

        <ModalBody>
          <VStack spacing={5} align="stretch">

            {/* TITEL */}
            <FormControl>
              <FormLabel fontWeight="bold" color={labelColor}>
                Titel
              </FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                color={textColor}
                placeholder="Naam van de accommodatie"
              />
            </FormControl>

            {/* LOCATIE */}
            <FormControl>
              <FormLabel fontWeight="bold" color={labelColor}>
                Locatie
              </FormLabel>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                color={textColor}
                placeholder="Bijv. Amsterdam, Nederland"
              />
            </FormControl>

            {/* BESCHRIJVING */}
            <FormControl>
              <FormLabel fontWeight="bold" color={labelColor}>
                Beschrijving
              </FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                color={textColor}
                resize="vertical"
                rows={4}
                placeholder="Beschrijf de accommodatie..."
              />
            </FormControl>

            {/* PRIJS PER NACHT */}
            <FormControl>
              <FormLabel fontWeight="bold" color={labelColor}>
                Prijs per nacht (€)
              </FormLabel>
              <NumberInput
                min={10}
                value={pricePerNight}
                onChange={(v) => setPricePerNight(Number(v))}
              >
                <NumberInputField color={textColor} />
              </NumberInput>
            </FormControl>

            {/* AANTAL GASTEN */}
            <FormControl>
              <FormLabel fontWeight="bold" color={labelColor}>
                Aantal gasten
              </FormLabel>
              <NumberInput
                min={1}
                value={guestCount}
                onChange={(v) => setGuestCount(Number(v))}
              >
                <NumberInputField color={textColor} />
              </NumberInput>
            </FormControl>

            {/* SLAAPKAMERS */}
            <FormControl>
              <FormLabel fontWeight="bold" color={labelColor}>
                Slaapkamers
              </FormLabel>
              <NumberInput
                min={1}
                value={bedroomCount}
                onChange={(v) => setBedroomCount(Number(v))}
              >
                <NumberInputField color={textColor} />
              </NumberInput>
            </FormControl>

            {/* BADKAMERS */}
            <FormControl>
              <FormLabel fontWeight="bold" color={labelColor}>
                Badkamers
              </FormLabel>
              <NumberInput
                min={1}
                value={bathRoomCount}
                onChange={(v) => setBathRoomCount(Number(v))}
              >
                <NumberInputField color={textColor} />
              </NumberInput>
            </FormControl>

            {/* IMAGE UPLOAD */}
            <ImageUpload images={images} setImages={setImages} />

          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} disabled={loading} mr={3}>
            Annuleren
          </Button>

          <Button
            type="button"
            colorScheme="teal"
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Opslaan..."
          >
            Opslaan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
