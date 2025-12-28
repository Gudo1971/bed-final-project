// ==============================================
// = ADD PROPERTY PAGE                           =
// = Nieuwe property toevoegen (host)            =
// ==============================================

import { Box, Heading, Container } from "@chakra-ui/react";
import PropertyForm from "../components/properties/PropertyForm";

export default function AddPropertyPage() {
  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Container maxW="800px" py={10}>
      {/* ============================================== */}
      {/* = PAGINA TITEL                               = */}
      {/* ============================================== */}
      <Heading mb={6} size="lg">
        Nieuwe Property Toevoegen
      </Heading>

      {/* ============================================== */}
      {/* = PROPERTY FORM                               = */}
      {/* ============================================== */}
      <Box>
        <PropertyForm />
      </Box>
    </Container>
  );
}
