import { Box, Heading, Container } from "@chakra-ui/react";
import PropertyForm from "../components/properties/PropertyForm";

export default function AddPropertyPage() {
  return (
    <Container maxW="800px" py={10}>
      <Heading mb={6} size="lg">
        Nieuwe Property Toevoegen
      </Heading>

      <Box>
        <PropertyForm />
      </Box>
    </Container>
  );
}
