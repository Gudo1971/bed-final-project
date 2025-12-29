// ==============================================
// = REVIEW LIST                                 =
// = Gemiddelde rating + individuele reviews     =
// ==============================================

import { Box, Text, VStack, HStack } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";

// ============================================================
// = DATUM FORMATTER                                           =
// ============================================================
function formatDate(dateString) {
  const d = new Date(dateString);

  if (isNaN(d.getTime())) {
    return "Onbekende datum";
  }

  return d.toLocaleDateString("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

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
      icon = "⯨";
    }

    stars.push(
      <Text
        as="span"
        key={i}
        fontSize={{ base: "lg", md: "xl" }}
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
  if (!reviews || reviews.length === 0) {
    return (
      <Text fontSize="md" color="gray.500">
        Er zijn nog geen reviews voor deze property.
      </Text>
    );
  }

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  const avgRatingNumber = parseFloat(averageRating);

  return (
    <VStack align="start" spacing={6} w="100%">
      <Box>
        <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }}>
          Gemiddelde rating: {averageRating}
        </Text>

        <HStack spacing={1} mt={1}>
          {renderStars(avgRatingNumber)}
        </HStack>
      </Box>

      <VStack align="start" spacing={4} w="100%">
        {reviews.map((review) => (
          <Box
            key={review.id}
            bg={useColorModeValue("gray.100", "gray.700")}
            color={useColorModeValue("gray.900", "whiteAlpha.900")}
            borderRadius="md"
            p={4}
            w="100%"
            boxShadow="sm"
            _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
            transition="all 0.2s ease"
          >
            <HStack spacing={1}>{renderStars(review.rating)}</HStack>

            <Text mt={2} fontSize={{ base: "sm", md: "md" }}>
              {review.comment}
            </Text>

            <Text mt={3} fontSize="sm" fontStyle="italic" color="gray.500">
              {review.user?.name || "Anonieme gebruiker"}
            </Text>

            {/* Datum */}
            <Text fontSize="xs" color="gray.400">
              {formatDate(review.createdAt)}
            </Text>
          </Box>
        ))}
      </VStack>
    </VStack>
  );
}
