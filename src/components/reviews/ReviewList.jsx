import { Box, Text, VStack } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";

function renderStars(rating) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    let icon = "☆";

    if (i <= fullStars) {
      icon = "★";
    } else if (i === fullStars + 1 && hasHalfStar) {
      icon = "⯨"; // half star
    }

    stars.push(
      <Text
        as="span"
        key={i}
        fontSize="lg"
        color={
          icon === "★"
            ? "yellow.500"
            : icon === "⯨"
            ? "yellow.400"
            : "gray.400"
        }
      >
        {icon}
      </Text>
    );
  }

  return stars;
}



export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <Text>Er zijn nog geen reviews voor deze property.</Text>;
  }

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
  <VStack align="start" spacing={4} w="100%">
    {/* Gemiddelde rating als getal */}
    <Text fontWeight="bold" fontSize="lg">
      Gemiddelde rating: {averageRating}
    </Text>

    {/* Gemiddelde rating als 5 sterren */}
    <Box>{renderStars(averageRating)}</Box>

    {/* Individuele reviews */}
    {reviews.map((review) => (
      <Box
        key={review.id}
        bg={useColorModeValue("gray.100", "gray.700")}
        color={useColorModeValue("gray.900", "whiteAlpha.900")}
        borderRadius="md"
        p={4}
        mb={3}
        boxShadow="md"
        w="100%"
      >
        {/* Sterrenweergave voor deze review */}
        <Box>{renderStars(review.rating)}</Box>

        {/* Reviewtekst */}
        <Text mt={1}>{review.comment}</Text>

        {/* Naam van reviewer (fallback indien leeg) */}
        <Text mt={2} fontSize="sm" fontStyle="italic">
          {review.user?.name || "Anonieme gebruiker"}
        </Text>
      </Box>
    ))}
  </VStack>
);
}