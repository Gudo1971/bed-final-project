import { useState, useEffect } from "react";
import { Text, Button, HStack, VStack, useDisclosure } from "@chakra-ui/react";
import AddReviewModal from "./AddreviewModal";

// Gebruik jouw eigen AuthContext (NIET Auth0)
import { useAuth } from "../context/AuthContext";

export default function ReviewCarousel({ reviews, onRefresh }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // AuthContext
  const { user, token } = useAuth();
  const isAuthenticated = !!user && !!token;

  // Auto‑carousel
  useEffect(() => {
    if (isPaused || !reviews || reviews.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, reviews]);

  // Geen reviews
  if (!reviews || reviews.length === 0) {
    return (
      <>
        <HStack justify="space-between" w="100%" mb={2}>
          <Text fontSize="xl" fontWeight="bold">Reviews</Text>

          {isAuthenticated && (
            <Button colorScheme="blue" size="sm" onClick={onOpen}>
              Review toevoegen
            </Button>
          )}
        </HStack>

        <Text>Geen reviews beschikbaar.</Text>

        <AddReviewModal
          isOpen={isOpen}
          onClose={onClose}
          propertyId={null}
          onReviewAdded={onRefresh}
        />
      </>
    );
  }

  const review = reviews[index];

  return (
    <>
      <HStack justify="space-between" w="100%" mb={2}>
        <Text fontSize="xl" fontWeight="bold">Reviews</Text>

        {isAuthenticated && (
          <Button colorScheme="blue" size="sm" onClick={onOpen}>
            Review toevoegen
          </Button>
        )}
      </HStack>

      <VStack spacing={4} p={6} border="1px solid #ddd" borderRadius="md">
        <Text fontSize="lg" fontWeight="bold">
          ⭐ {review.rating} / 5
        </Text>

        <Text fontSize="md" textAlign="center">
          "{review.comment}"
        </Text>

        <Text fontSize="sm" color="gray.500">
          — {review.user?.name || "Anonieme gast"}
        </Text>

        <HStack spacing={4} pt={4}>
          <Button onClick={() => setIndex((i) => (i - 1 + reviews.length) % reviews.length)}>
            Vorige
          </Button>

          <Button onClick={() => setIsPaused((p) => !p)}>
            {isPaused ? "▶️ Play" : "⏸️ Pause"}
          </Button>

          <Button onClick={() => setIndex((i) => (i + 1) % reviews.length)}>
            Volgende
          </Button>
        </HStack>
      </VStack>

      <AddReviewModal
        isOpen={isOpen}
        onClose={onClose}
        propertyId={review.propertyId}
        onReviewAdded={onRefresh}
      />
    </>
  );
}
