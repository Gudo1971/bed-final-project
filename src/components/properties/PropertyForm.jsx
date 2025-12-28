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
} from "@chakra-ui/react";

import { useState } from "react";
import ImageUpload from "../images/upload/ImageUpload.jsx";

export default function PropertyForm({ isOpen, onClose, onSuccess }) {
  const toast = useToast();
  const token = localStorage.getItem("token");

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
  // = SUBMIT HANDLER                             =
  // ==============================================
  async function handleSubmit() {
    try {
      setLoading(true);

      // Multipart form data
      const formData = new FormData();
      formData.append("title", title);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("pricePerNight", pricePerNight);
      formData.append("maxGuestCount", guestCount);
      formData.append("bedroomCount", bedroomCount);
      formData.append("bathRoomCount", bathRoomCount);

      // Images toevoegen
      images.forEach((file) => {
        formData.append("images", file);
      });

      // Backend request
      const res = await fetch("http://localhost:3000/api/properties", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create property");

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
        description: "Kon de property niet aanmaken.",
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
      <ModalContent>
        <ModalHeader>Nieuwe Property</ModalHeader>

        <ModalBody>
          <VStack spacing={4} align="stretch">

            {/* ============================================== */}
            {/* = TITEL                                       = */}
            {/* ============================================== */}
            <FormControl>
              <FormLabel>Titel</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>

            {/* ============================================== */}
            {/* = LOCATIE                                     = */}
            {/* ============================================== */}
            <FormControl>
              <FormLabel>Locatie</FormLabel>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </FormControl>

            {/* ============================================== */}
            {/* = BESCHRIJVING                                = */}
            {/* ============================================== */}
            <FormControl>
              <FormLabel>Beschrijving</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>

            {/* ============================================== */}
            {/* = PRIJS PER NACHT                             = */}
            {/* ============================================== */}
            <FormControl>
              <FormLabel>Prijs per nacht (€)</FormLabel>
              <NumberInput
                min={10}
                value={pricePerNight}
                onChange={(v) => setPricePerNight(Number(v))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            {/* ============================================== */}
            {/* = AANTAL GASTEN                               = */}
            {/* ============================================== */}
            <FormControl>
              <FormLabel>Aantal gasten</FormLabel>
              <NumberInput
                min={1}
                value={guestCount}
                onChange={(v) => setGuestCount(Number(v))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            {/* ============================================== */}
            {/* = SLAAPKAMERS                                 = */}
            {/* ============================================== */}
            <FormControl>
              <FormLabel>Slaapkamers</FormLabel>
              <NumberInput
                min={1}
                value={bedroomCount}
                onChange={(v) => setBedroomCount(Number(v))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            {/* ============================================== */}
            {/* = BADKAMERS                                   = */}
            {/* ============================================== */}
            <FormControl>
              <FormLabel>Badkamers</FormLabel>
              <NumberInput
                min={1}
                value={bathRoomCount}
                onChange={(v) => setBathRoomCount(Number(v))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            {/* ============================================== */}
            {/* = IMAGE UPLOAD                                = */}
            {/* ============================================== */}
            <ImageUpload images={images} setImages={setImages} />

          </VStack>
        </ModalBody>

        {/* ============================================== */}
        {/* = FOOTER KNOPPEN                              = */}
        {/* ============================================== */}
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
