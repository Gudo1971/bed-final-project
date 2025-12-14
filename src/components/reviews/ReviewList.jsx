import { Box, Text, VStack } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";

export default function ReviewList({ reviews }) {
  // ✅ Fallback bij lege lijst
  if (!reviews || reviews.length === 0) {
    return <Text>Er zijn nog geen reviews voor deze property.</Text>;
  }

  // ✅ Gemiddelde rating berekenen
  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <VStack align="start" spacing={4} w="100%">
      {/* ✅ Gemiddelde rating tonen */}
      <Text fontWeight="bold" fontSize="lg">
        Gemiddelde rating: {averageRating} ⭐
      </Text>

      {/* ✅ Review cards */}
      {reviews.map((review) => (
 <Box
  bg={useColorModeValue("gray.100", "gray.700")}
  color={useColorModeValue("gray.900", "whiteAlpha.900")}
  borderRadius="md"
  p={4}
  mb={3}
  boxShadow="md"
>
  <Text fontSize="lg" fontWeight="bold">
    ⭐ {review.rating}
  </Text>
  <Text mt={1}>{review.comment}</Text>
  <Text mt={2} fontSize="sm" fontStyle="italic">
    {review.user?.name}
  </Text>
</Box>
))}
    </VStack>
  );
}
