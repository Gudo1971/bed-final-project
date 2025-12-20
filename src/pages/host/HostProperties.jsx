import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Spinner,
  HStack,
  VStack,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function HostProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  async function fetchProperties() {
    try {
      const token = await getAccessTokenSilently();

      const res = await fetch("http://localhost:3000/properties/host/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Backend returned error:", res.status);
        return;
      }

      const data = await res.json();
      setProperties(data);
    } catch (err) {
      console.error("Fetch error in HostProperties:", err);
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
      <HStack justify="space-between" mb={4}>
        <Heading size="md">Mijn Properties</Heading>
        <Button colorScheme="blue" onClick={() => navigate("/add-property")}>
          Nieuwe property toevoegen
        </Button>
      </HStack>

      {properties.length === 0 && (
        <Text>Je hebt nog geen properties toegevoegd.</Text>
      )}

      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {properties.map((property) => (
          <Box
            key={property.id}
            border="1px solid #ddd"
            borderRadius="md"
            overflow="hidden"
            cursor="pointer"
            onClick={() => navigate(`/property/${property.id}`)}
            _hover={{ boxShadow: "md" }}
          >
            <Image
              src={property.images?.[0]?.url || "/placeholder.jpg"}
              alt={property.title}
              h="180px"
              w="100%"
              objectFit="cover"
            />

            <VStack align="start" p={4} spacing={1}>
              <Heading size="sm">{property.title}</Heading>
              <Text fontSize="sm" color="gray.600">
                {property.location}
              </Text>
              <Text fontWeight="bold">€ {property.pricePerNight} / nacht</Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
