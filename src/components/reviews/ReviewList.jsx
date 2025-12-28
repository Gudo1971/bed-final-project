// ==============================================
// = REVIEW LIST                                 =
// = Gemiddelde rating + individuele reviews     =
// ==============================================

import { Box, Text, VStack } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";

// ==============================================
// = STERREN RENDEREN                            =
// ==============================================
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

// ==============================================
// = REVIEW LIST COMPONENT                       =
// ==============================================
export default function ReviewList({ reviews }) {
  // ==============================================
  // = GEEN REVIEWS                               =
  // ==============================================
  if (!reviews || reviews.length === 0) {
    return <Text>Er zijn nog geen reviews voor deze property.</Text>;
  }

  // ==============================================
  // = GEMIDDELDE RATING                          =
  // ==============================================
  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <VStack align="start" spacing={4} w="100%">
      {/* ============================================== */}
      {/* = GEMIDDELDE RATING                           = */}
      {/* ============================================== */}
      <Text fontWeight="bold" fontSize="lg">
        Gemiddelde rating: {averageRating}
      </Text>

      <Box>{renderStars(averageRating)}</Box>

      {/* ============================================== */}
      {/* = INDIVIDUELE REVIEWS                         = */}
      {/* ============================================== */}
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
          {/* Sterrenweergave */}
          <Box>{renderStars(review.rating)}</Box>

          {/* Reviewtekst */}
          <Text mt={1}>{review.comment}</Text>

          {/* Reviewer naam */}
          <Text mt={2} fontSize="sm" fontStyle="italic">
            {review.user?.name || "Anonieme gebruiker"}
          </Text>
        </Box>
      ))}
    </VStack>
  );
}
