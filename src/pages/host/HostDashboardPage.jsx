import { useEffect, useState } from "react";
import { Box, Button, Heading, Flex, Text, Image } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function HostDashboardPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = await getAccessTokenSilently({
  authorizationParams: {
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  },
});
   console.log("🔑 ACCESS TOKEN:", token);     

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/properties/host/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProperties(res.data);
      } catch (err) {
        console.error("Error fetching host properties:", err);
      }
    };

    fetchProperties();
  }, []);

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Your Properties</Heading>

        <Button as={Link} to="/host/add-property" colorScheme="teal">
          + Add Property
        </Button>
      </Flex>

      {properties.length === 0 ? (
        <Text>No properties yet. Add your first one!</Text>
      ) : (
        <Flex direction="column" gap={4}>
          {properties.map((p) => (
            <Flex
              key={p.id}
              p={4}
              border="1px solid #ddd"
              borderRadius="10px"
              align="center"
              justify="space-between"
            >
              <Flex align="center" gap={4}>
                <Image
                  src={p.images[0]?.url}
                  width="80px"
                  height="80px"
                  objectFit="cover"
                  borderRadius="8px"
                />
                <Box>
                  <Heading size="md">{p.title}</Heading>
                  <Text>€{p.pricePerNight} / night</Text>
                </Box>
              </Flex>

              <Flex gap={3}>
                <Button as={Link} to={`/properties/${p.id}`} variant="outline">
                  View
                </Button>
                <Button as={Link} to={`/host/edit-property/${p.id}`} colorScheme="teal">
                  Edit
                </Button>
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}
    </Box>
  );
}
