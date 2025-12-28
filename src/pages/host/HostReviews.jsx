// ==============================================
// = HOST REVIEWS                                =
// = Reviews op properties van de host           =
// ==============================================

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  HStack,
  Badge,
  Divider,
  useToast,
} from "@chakra-ui/react";

import { getHostReviews } from "../../api/host.js";

export default function HostReviews({ token }) {
  // ==============================================
  // = STATE BLOKKEN                              =
  // ==============================================
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  // ==============================================
  // = REVIEWS OPHALEN                            =
  // ==============================================
  async function fetchReviews() {
    try {
      const data = await getHostReviews(token);
      setReviews(data);
    } catch (err) {
      console.error(err);

      toast({
        title: "Fout bij ophalen",
        description: "Kon jouw reviews niet laden.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  // ==============================================
  // = LOADING STATE                              =
  // ==============================================
  if (loading) {
    return (
      <HStack>
        <Spinner />
        <Text>Reviews laden...</Text>
      </HStack>
    );
  }

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Box>
      {/* ============================================== */}
      {/* = TITEL                                       = */}
      {/* ============================================== */}
      <Heading size="md" mb={4}>
        Reviews op mijn properties
      </Heading>

      {/* ============================================== */}
      {/* = GEEN REVIEWS                                = */}
      {/* ============================================== */}
      {reviews.length === 0 && (
        <Text>Er zijn nog geen reviews op jouw properties.</Text>
      )}

      {/* ============================================== */}
      {/* = REVIEW LIJST                                = */}
      {/* ============================================== */}
      <VStack align="stretch" spacing={4}>
        {reviews.map((review) => (
          <Box
            key={review.id}
            border="1px solid #ddd"
            borderRadius="md"
            p={4}
            _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
            transition="all 0.2s"
          >
            {/* ============================================== */}
            {/* = HEADER (property + rating)                  = */}
            {/* ============================================== */}
            <HStack justify="space-between">
              <Heading size="sm">
                {review.property?.title || "Onbekende property"}
              </Heading>

              <Badge colorScheme="yellow">⭐ {review.rating} / 5</Badge>
            </HStack>

            <Divider my={2} />

            {/* ============================================== */}
            {/* = COMMENT                                     = */}
            {/* ============================================== */}
            <Text fontStyle="italic">"{review.comment}"</Text>

            {/* ============================================== */}
            {/* = USER NAAM                                   = */}
            {/* ============================================== */}
            <Text mt={2} color="gray.600">
              — {review.user?.name || "Anonieme gast"}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
