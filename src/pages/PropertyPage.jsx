// ============================================================
// = PROPERTY PAGE (MET AIRBNB-STYLE SKELETON GRID)           =
// ============================================================

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Center,
  Skeleton,
  SkeletonText,
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
  // = LOADING STATE (SKELETON GRID)              =
  // ==============================================
  if (loading) {
    return (
      <Box px={{ base: 4, md: 6 }} py={{ base: 6, md: 10 }}>
        <Heading mb={8} color={textColor}>
          Properties
        </Heading>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Box
              key={i}
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              bg={useColorModeValue("white", "gray.700")}
              p={0}
            >
              {/* IMAGE SKELETON */}
              <Skeleton height="180px" width="100%" />

              {/* TEXT SKELETON */}
              <Box p={4}>
                <Skeleton height="20px" width="70%" mb={3} />
                <Skeleton height="16px" width="50%" mb={2} />
                <SkeletonText noOfLines={2} spacing="3" />
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    );
  }

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

      {/* EMPTY STATE */}
      {properties.length === 0 && (
        <Text fontSize="lg" color={textColor}>
          No properties found.
        </Text>
      )}

      {/* PROPERTY GRID */}
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3 }}
        spacing={6}
        mt={properties.length === 0 ? 0 : 4}
        alignItems="start"
      >
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
