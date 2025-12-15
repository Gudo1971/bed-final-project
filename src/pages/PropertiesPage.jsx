import { Box, Heading } from "@chakra-ui/react";
import PropertyForm from "../components/properties/PropertyForm";

export default function PropertiesPage() {
  return (
    <Box p={6}>
      <Heading mb={6} color="teal.300">
        Nieuwe Property Aanmelden
      </Heading>

      <PropertyForm />
    </Box>
  );
}
