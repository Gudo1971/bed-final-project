// ============================================================
// = ADD PROPERTY PAGE (RESPONSIVE + VISUAL POLISH)           =
// ============================================================

import { Box, Heading, Container, useColorModeValue } from "@chakra-ui/react";
import PropertyForm from "../components/properties/PropertyForm";

export default function AddPropertyPage() {
  const titleColor = useColorModeValue("teal.600", "teal.300");

  return (
    <Container
      maxW="800px"
      py={{ base: 6, md: 10 }}
      px={{ base: 4, md: 0 }}
    >
      {/* ============================================== */}
      {/* = PAGINA TITEL                               = */}
      {/* ============================================== */}
      <Heading
        mb={6}
        size="lg"
        textAlign="center"
        color={titleColor}
      >
        Nieuwe Property Toevoegen
      </Heading>

      {/* ============================================== */}
      {/* = PROPERTY FORM                               = */}
      {/* ============================================== */}
      <Box
        p={{ base: 4, md: 6 }}
        borderRadius="md"
        boxShadow="md"
        bg={useColorModeValue("white", "gray.800")}
      >
        <PropertyForm />
      </Box>
    </Container>
  );
}
