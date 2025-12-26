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
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { useAuth } from "../../components/context/AuthContext.jsx";
import PropertyForm from "../../components/properties/PropertyForm.jsx";
import { getHostProperties } from "../../api/host.js";

export default function HostProperties() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, token } = useAuth();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Blokkeer niet-hosts (maar alleen als user geladen is)
  if (user && user.isHost === false) {
    window.location.href = "/profile";
    return null;
  }

  async function fetchProperties() {
    try {
      const data = await getHostProperties(token);
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
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
    // Wacht tot token bestaat
    if (!token) return;

    fetchProperties();
  }, [token]);

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
      <HStack justify="space-between" mb={4}>
        <Heading size="md">Mijn Properties</Heading>

        <Button colorScheme="teal" size="sm" onClick={onOpen}>
          Nieuwe Property
        </Button>
      </HStack>

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

              <Badge colorScheme={property.isActive ? "green" : "red"}>
                {property.isActive ? "Actief" : "Inactief"}
              </Badge>
            </HStack>

            <Divider my={2} />

            <Text>
              <strong>Locatie:</strong> {property.location}
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

      {/* MODAL */}
      <PropertyForm
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={fetchProperties}
      />
    </Box>
  );
}
