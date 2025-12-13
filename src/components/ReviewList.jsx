import { Box, Text, VStack } from "@chakra-ui/react";

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
          key={review.id}
          p={4}
          borderWidth="1px"
          borderRadius="md"
          w="100%"
          bg="gray.50"
          _hover={{ bg: "gray.100", transition: "0.2s" }}
        >
          <Text fontWeight="bold">{review.rating} ⭐</Text>
          <Text>{review.comment}</Text>
        </Box>
      ))}
    </VStack>
  );
}
