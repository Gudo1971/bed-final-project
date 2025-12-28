// ==============================================
// = PROPERTIES PAGE                             =
// = Nieuwe property aanmaken                    =
// ==============================================

import { Box, Heading } from "@chakra-ui/react";
import PropertyForm from "../components/properties/PropertyForm";

export default function PropertiesPage() {
  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Box p={6}>
      {/* ============================================== */}
      {/* = PAGINA TITEL                               = */}
      {/* ============================================== */}
      <Heading mb={6} color="teal.300">
        Nieuwe Property Aanmelden
      </Heading>

      {/* ============================================== */}
      {/* = PROPERTY FORM                               = */}
      {/* ============================================== */}
      <PropertyForm />
    </Box>
  );
}
