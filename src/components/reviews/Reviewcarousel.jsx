// ==============================================
// = REVIEW CAROUSEL                             =
// ==============================================

import { useState, useEffect } from "react";
import {
  Text,
  Button,
  HStack,
  VStack,
  Box,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";

import AddReviewModal from "./AddreviewModal";
import { useAuth } from "../context/AuthContext";

export default function ReviewCarousel({ reviews, propertyId, onRefresh }) {
  // ----------------------------------------------
  // HOOKS — moeten ALTIJD bovenaan staan
  // ----------------------------------------------
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, token } = useAuth();
  const isAuthenticated = !!user && !!token;

  const cardBg = useColorModeValue("gray.100", "gray.700");

  // ----------------------------------------------
  // AUTO CAROUSEL
  // ----------------------------------------------
  useEffect(() => {
    if (isPaused || reviews.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, reviews]);

  // ----------------------------------------------
  // GEEN REVIEWS
  // ----------------------------------------------
  if (reviews.length === 0) {
    return (
      <>
        <HStack justify="space-between" w="100%" mb={3}>
          <Text fontSize="xl" fontWeight="bold">Reviews</Text>

          {isAuthenticated && (
            <Button colorScheme="blue" size="sm" onClick={onOpen}>
              Review toevoegen
            </Button>
          )}
        </HStack>

        <Text color="gray.500">Geen reviews beschikbaar.</Text>

        <AddReviewModal
          isOpen={isOpen}
          onClose={onClose}
          propertyId={propertyId}   // <-- FIXED
          onReviewAdded={onRefresh}
        />
      </>
    );
  }

  // ----------------------------------------------
  // ACTIEVE REVIEW
  // ----------------------------------------------
  const review = reviews[index];

  return (
    <>
      <HStack justify="space-between" w="100%" mb={3}>
        <Text fontSize="xl" fontWeight="bold">Reviews</Text>

        {isAuthenticated && (
          <Button colorScheme="blue" size="sm" onClick={onOpen}>
            Review toevoegen
          </Button>
        )}
      </HStack>

      <VStack
        spacing={4}
        p={6}
        w="100%"
        borderRadius="md"
        bg={cardBg}
        boxShadow="md"
      >
        <Text fontSize="xl" fontWeight="bold">
          ⭐ {review.rating} / 5
        </Text>

        <Text fontSize="lg" textAlign="center" fontStyle="italic">
          “{review.comment}”
        </Text>

        <Text fontSize="sm" color="gray.500">
          — {review.user?.name || "Anonieme gast"}
        </Text>

        <HStack spacing={4} pt={4}>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setIndex((i) => (i - 1 + reviews.length) % reviews.length)
            }
          >
            Vorige
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsPaused((p) => !p)}
          >
            {isPaused ? "▶️ Play" : "⏸️ Pause"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIndex((i) => (i + 1) % reviews.length)}
          >
            Volgende
          </Button>
        </HStack>
      </VStack>

      <AddReviewModal
        isOpen={isOpen}
        onClose={onClose}
        propertyId={propertyId}   // <-- FIXED
        onReviewAdded={onRefresh}
      />
    </>
  );
}
