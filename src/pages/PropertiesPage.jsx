// ===============================================
// = PROPERTIES PAGE                             =
// = Nieuwe property aanmaken                    =
// ===============================================

import { Box, Heading, Container, useColorModeValue } from "@chakra-ui/react";
import PropertyForm from "../components/properties/PropertyForm";

export default function PropertiesPage() {
  // Kleuren afhankelijk van light/dark mode
  const titleColor = useColorModeValue("teal.600", "teal.300");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardShadow = useColorModeValue("md", "dark-lg");

  return (
    <Container maxW="container.md" py={{ base: 6, md: 10 }}>
      {/* ============================================== */}
      {/* = PAGINA TITEL                               = */}
      {/* ============================================== */}
      <Heading
        mb={8}
        fontSize={{ base: "2xl", md: "3xl" }}
        fontWeight="extrabold"
        color={titleColor}
        textAlign="center"
      >
        Nieuwe Property Aanmelden
      </Heading>

      {/* ============================================== */}
      {/* = FORM CARD                                   = */}
      {/* ============================================== */}
      <Box
        bg={cardBg}
        p={{ base: 4, md: 6 }}
        borderRadius="lg"
        boxShadow={cardShadow}
      >
        <PropertyForm />
      </Box>
    </Container>
  );
}
