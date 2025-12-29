// ==============================================
// = REVIEW CAROUSEL                             =
// = Automatisch roterende reviews + modal       =
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

// ==============================================
// = COMPONENT                                   =
// ==============================================
export default function ReviewCarousel({ reviews, onRefresh }) {
  // ==============================================
  // = STATE                                      =
  // ==============================================
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // ==============================================
  // = AUTH                                       =
  // ==============================================
  const { user, token } = useAuth();
  const isAuthenticated = !!user && !!token;

  // ==============================================
  // = AUTO CAROUSEL                              =
  // ==============================================
  useEffect(() => {
    if (isPaused || !reviews || reviews.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, reviews]);

  // ==============================================
  // = GEEN REVIEWS                               =
  // ==============================================
  if (!reviews || reviews.length === 0) {
    return (
      <>
        <HStack justify="space-between" w="100%" mb={3}>
          <Text fontSize="xl" fontWeight="bold">
            Reviews
          </Text>

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
          propertyId={null}
          onReviewAdded={onRefresh}
        />
      </>
    );
  }

  // ==============================================
  // = ACTIEVE REVIEW                             =
  // ==============================================
  const review = reviews[index];

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <>
      {/* ============================================== */}
      {/* = HEADER                                      = */}
      {/* ============================================== */}
      <HStack justify="space-between" w="100%" mb={3}>
        <Text fontSize="xl" fontWeight="bold">
          Reviews
        </Text>

        {isAuthenticated && (
          <Button colorScheme="blue" size="sm" onClick={onOpen}>
            Review toevoegen
          </Button>
        )}
      </HStack>

      {/* ============================================== */}
      {/* = REVIEW CARD                                = */}
      {/* ============================================== */}
      <VStack
        spacing={4}
        p={6}
        w="100%"
        borderRadius="md"
        bg={useColorModeValue("gray.100", "gray.700")}
        boxShadow="md"
        transition="all 0.2s ease"
        _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
      >
        <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
          ⭐ {review.rating} / 5
        </Text>

        <Text
          fontSize={{ base: "md", md: "lg" }}
          textAlign="center"
          fontStyle="italic"
        >
          “{review.comment}”
        </Text>

        <Text fontSize="sm" color="gray.500">
          — {review.user?.name || "Anonieme gast"}
        </Text>

        {/* ============================================== */}
        {/* = CAROUSEL CONTROLS                           = */}
        {/* ============================================== */}
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

      {/* ============================================== */}
      {/* = ADD REVIEW MODAL                            = */}
      {/* ============================================== */}
      <AddReviewModal
        isOpen={isOpen}
        onClose={onClose}
        propertyId={review.propertyId}
        onReviewAdded={onRefresh}
      />
    </>
  );
}
