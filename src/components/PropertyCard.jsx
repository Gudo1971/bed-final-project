import { Box, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
export default function PropertyCard({ property }) {
  return (
    <Link to={`/properties/${property.id}`} >
 <Box borderWidth="1px" borderRadius="lg" p={4} shadow="md">
  <Heading size="md">{property.title}</Heading>
  <Text>{property.description}</Text>
  <Text fontWeight="bold">€{property.pricePerNight} / night</Text>
  <Text>🛏 {property.bedroomCount} | 🛁 {property.bathRoomCount} | 👥 {property.maxGuestCount}</Text>
  <Text>⭐ {property.rating}</Text>
</Box>
    </Link>
  );
}
