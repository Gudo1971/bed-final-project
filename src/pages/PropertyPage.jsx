import { useEffect, useState } from "react";
import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import PropertyCard from "../components/PropertyCard";
import { getAllProperties } from "../api/properties";

export default function PropertyPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading)
    return (
      <Box p={6}>
        <Spinner size="xl" />
      </Box>
    );

  if (error)
    return (
      <Box p={6}>
        <Text color="red.500">Error: {error}</Text>
      </Box>
    );

  return (
    <Box p={6}>
      <Heading mb={6}>Properties</Heading>

      {properties.length === 0 && <Text>No properties found.</Text>}

      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </Box>
  );
}
