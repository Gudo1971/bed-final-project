// ============================================================
// = PROPERTY PAGE                                             =
// = Overzicht van alle beschikbare properties                =
// ============================================================

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Spinner,
  Text,
  SimpleGrid,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";

import PropertyCard from "../components/PropertyCard.jsx";
import { getAllProperties } from "../api/properties.js";

// ============================================================
// = COMPONENT                                                 =
// ============================================================
export default function PropertyPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const textColor = useColorModeValue("gray.800", "gray.100");

  // ==============================================
  // = FETCH PROPERTIES                           =
  // ==============================================
  useEffect(() => {
    getAllProperties()
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // ==============================================
  // = LOADING STATE                              =
  // ==============================================
  if (loading)
    return (
      <Center py={20}>
        <Spinner size="xl" thickness="4px" speed="0.65s" />
      </Center>
    );

  // ==============================================
  // = ERROR STATE                                =
  // ==============================================
  if (error)
    return (
      <Center py={20}>
        <Text color="red.500" fontSize="lg">
          Error: {error}
        </Text>
      </Center>
    );

  // ==============================================
  // = PAGE CONTENT                               =
  // ==============================================
  return (
    <Box px={{ base: 4, md: 6 }} py={{ base: 6, md: 10 }}>
      <Heading mb={8} color={textColor}>
        Properties
      </Heading>

      {/* ============================================== */}
      {/* = EMPTY STATE                                 = */}
      {/* ============================================== */}
      {properties.length === 0 && (
        <Text fontSize="lg" color={textColor}>
          No properties found.
        </Text>
      )}

      {/* ============================================== */}
      {/* = PROPERTY GRID                               = */}
      {/* ============================================== */}
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3 }}
        spacing={6}
        mt={properties.length === 0 ? 0 : 4}
      >
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
