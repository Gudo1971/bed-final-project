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

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerNight, setPricePerNight] = useState(50);
  const [guestCount, setGuestCount] = useState(1);
  const [bedroomCount, setBedroomCount] = useState(1);
  const [bathRoomCount, setBathRoomCount] = useState(1);

  // IMPORTANT: File objects
  const [images, setImages] = useState([]);

  async function handleSubmit() {
    try {
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

      const res = await fetch("http://localhost:3000/properties", {
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
        isClosable: true,
      });

      onSuccess();
      onClose();
    } catch (err) {
      toast({
        title: "Fout bij opslaan",
        description: "Kon de property niet aanmaken.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nieuwe Property</ModalHeader>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Titel</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>

            <FormControl>
              <FormLabel>Locatie</FormLabel>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </FormControl>

            <FormControl>
              <FormLabel>Beschrijving</FormLabel>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormControl>

            <FormControl>
              <FormLabel>Prijs per nacht (€)</FormLabel>
              <NumberInput min={10} value={pricePerNight} onChange={(v) => setPricePerNight(Number(v))}>
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Aantal gasten</FormLabel>
              <NumberInput min={1} value={guestCount} onChange={(v) => setGuestCount(Number(v))}>
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Slaapkamers</FormLabel>
              <NumberInput min={1} value={bedroomCount} onChange={(v) => setBedroomCount(Number(v))}>
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Badkamers</FormLabel>
              <NumberInput min={1} value={bathRoomCount} onChange={(v) => setBathRoomCount(Number(v))}>
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <ImageUpload images={images} setImages={setImages} />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>Annuleren</Button>
          <Button colorScheme="teal" onClick={handleSubmit}>Opslaan</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
