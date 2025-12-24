import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  HStack,
  Badge,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { getHostProperties } from "../../api/host.js";

export default function HostProperties() {
  const { getAccessTokenSilently } = useAuth0();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  async function fetchProperties() {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://staybnb.gudo.dev/api",
        },
      });

      const data = await getHostProperties(token);
      setProperties(data);
    } catch (err) {
      console.error(err);

      toast({
        title: "Fout bij ophalen",
        description: "Kon jouw properties niet laden.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  if (loading) {
    return (
      <HStack>
        <Spinner />
        <Text>Properties laden...</Text>
      </HStack>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        Mijn Properties
      </Heading>

      {properties.length === 0 && (
        <Text>Je hebt nog geen properties toegevoegd.</Text>
      )}

      <VStack align="stretch" spacing={4}>
        {properties.map((property) => (
          <Box
            key={property.id}
            border="1px solid #ddd"
            borderRadius="md"
            p={4}
            _hover={{ boxShadow: "md" }}
          >
            <HStack justify="space-between">
              <Heading size="sm">{property.title}</Heading>

              <Badge colorScheme="green">
                {property.isActive ? "Actief" : "Inactief"}
              </Badge>
            </HStack>

            <Divider my={2} />

            <Text>
              <strong>Locatie:</strong> {property.location || "Onbekend"}
            </Text>

            <Text>
              <strong>Prijs per nacht:</strong> € {property.pricePerNight}
            </Text>

            <Text mt={2}>
              <strong>Afbeeldingen:</strong> {property.images?.length || 0}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
