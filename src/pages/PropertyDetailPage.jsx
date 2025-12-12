import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Box, Heading, Text, Spinner, Stack
} from '@chakra-ui/react';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`http://localhost:3000/properties/${id}`);
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  if (loading) return <Spinner />;
  if (!property) return <Text>Property not found.</Text>;

  return (
    <Box p={6}>
      <Heading mb={4}>{property.title}</Heading>
      <Stack spacing={2}>
        <Text>{property.description}</Text>
        <Text>📍 {property.location}</Text>
        <Text>💰 €{property.pricePerNight} per night</Text>
        <Text>🛏 {property.bedroomCount} | 🛁 {property.bathRoomCount} | 👥 {property.maxGuestCount}</Text>
        <Text>⭐ {property.rating}</Text>
      </Stack>
    </Box>
  );
}
