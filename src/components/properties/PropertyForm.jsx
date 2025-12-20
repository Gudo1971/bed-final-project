import { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  Select,
  CheckboxGroup,
  Checkbox,
  VStack,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";

export default function PropertyForm() {
  const toast = useToast();
  const { getAccessTokenSilently } = useAuth0();

  // STATE
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerNight, setPricePerNight] = useState(50);
  const [guestCount, setGuestCount] = useState(1);
  const [type, setType] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token = await getAccessTokenSilently();

      const res = await fetch("http://localhost:3000/properties/host/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          location,
          pricePerNight,
          maxGuestCount: guestCount,
          type,
          amenities,
          imageUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to create property");

      toast({
        title: "Property toegevoegd",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Form reset
      setTitle("");
      setDescription("");
      setLocation("");
      setPricePerNight(50);
      setGuestCount(1);
      setType("");
      setAmenities([]);
      setImageUrl("");

    } catch (err) {
      console.error(err);
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
    <Box
      as="form"
      onSubmit={handleSubmit}
      p={6}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
    >
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Titel</FormLabel>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Bijv. Luxe appartement in Groningen"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Beschrijving</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschrijf de property..."
          />
        </FormControl>

        <FormControl>
          <FormLabel>Locatie</FormLabel>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Bijv. Groningen, Nederland"
          />
        </FormControl>

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

        <FormControl>
          <FormLabel>Type property</FormLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Selecteer type"
          >
            <option value="apartment">Appartement</option>
            <option value="house">Huis</option>
            <option value="studio">Studio</option>
            <option value="room">Kamer</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Amenities</FormLabel>
          <CheckboxGroup
            value={amenities}
            onChange={(values) => setAmenities(values)}
          >
            <VStack align="start">
              <Checkbox value="wifi">Wifi</Checkbox>
              <Checkbox value="parking">Parkeren</Checkbox>
              <Checkbox value="kitchen">Keuken</Checkbox>
              <Checkbox value="washer">Wasmachine</Checkbox>
              <Checkbox value="airco">Airconditioning</Checkbox>
            </VStack>
          </CheckboxGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Foto URL</FormLabel>
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
          />
        </FormControl>

        <Button type="submit" colorScheme="teal">
          Property toevoegen
        </Button>
      </VStack>
    </Box>
  );
}
