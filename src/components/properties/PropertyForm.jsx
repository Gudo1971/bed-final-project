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
} from "@chakra-ui/react";

export default function PropertyForm() {
  return (
    <Box p={6} borderWidth="1px" borderRadius="md" boxShadow="md">
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Titel</FormLabel>
          <Input placeholder="Bijv. Luxe appartement in Groningen" />
        </FormControl>

        <FormControl>
          <FormLabel>Beschrijving</FormLabel>
          <Textarea placeholder="Beschrijf de property..." />
        </FormControl>

        <FormControl>
          <FormLabel>Locatie</FormLabel>
          <Input placeholder="Bijv. Groningen, Nederland" />
        </FormControl>

        <FormControl>
          <FormLabel>Prijs per nacht (€)</FormLabel>
          <NumberInput min={10}>
            <NumberInputField />
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Aantal gasten</FormLabel>
          <NumberInput min={1}>
            <NumberInputField />
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Type property</FormLabel>
          <Select placeholder="Selecteer type">
            <option value="apartment">Appartement</option>
            <option value="house">Huis</option>
            <option value="studio">Studio</option>
            <option value="room">Kamer</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Amenities</FormLabel>
          <CheckboxGroup>
            <VStack align="start">
              <Checkbox>Wifi</Checkbox>
              <Checkbox>Parkeren</Checkbox>
              <Checkbox>Keuken</Checkbox>
              <Checkbox>Wasmachine</Checkbox>
              <Checkbox>Airconditioning</Checkbox>
            </VStack>
          </CheckboxGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Foto URL</FormLabel>
          <Input placeholder="https://..." />
        </FormControl>

        <Button colorScheme="teal">Property toevoegen</Button>
      </VStack>
    </Box>
  );
}
