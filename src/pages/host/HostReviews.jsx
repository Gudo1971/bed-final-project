// ============================================================
// = HOST REVIEWS                                              =
// = Reviews op properties van de host                         =
// ============================================================

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
  useColorModeValue,
} from "@chakra-ui/react";

import { getHostReviews } from "../../api/host.js";

export default function HostReviews({ token }) {
  // ============================================================
  // = STATE                                                    =
  // ============================================================
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  // ============================================================
  // = REVIEWS OPHALEN                                          =
  // ============================================================
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

  // ============================================================
  // = LOADING STATE                                            =
  // ============================================================
  if (loading) {
    return (
      <HStack spacing={3} py={4}>
        <Spinner />
        <Text>Reviews laden...</Text>
      </HStack>
    );
  }

  // ============================================================
  // = RENDER                                                   =
  // ============================================================
  return (
    <Box>
      {/* ====================================================== */}
      {/* = TITEL                                               = */}
      {/* ====================================================== */}
      <Heading
        size="md"
        mb={6}
        color={useColorModeValue("teal.700", "teal.300")}
        textAlign="center"
      >
        Reviews op mijn properties
      </Heading>

      {/* ====================================================== */}
      {/* = GEEN REVIEWS                                        = */}
      {/* ====================================================== */}
      {reviews.length === 0 && (
        <Text color="gray.500" textAlign="center">
          Er zijn nog geen reviews op jouw properties.
        </Text>
      )}

      {/* ====================================================== */}
      {/* = REVIEW LIJST                                        = */}
      {/* ====================================================== */}
      <VStack align="stretch" spacing={5}>
        {reviews.map((review) => (
          <Box
            key={review.id}
            border="1px solid"
            borderColor={useColorModeValue("gray.300", "gray.600")}
            borderRadius="lg"
            p={{ base: 4, md: 5 }}
            bg={useColorModeValue("white", "gray.800")}
            boxShadow="sm"
            _hover={{
              boxShadow: "md",
              transform: "translateY(-3px)",
            }}
            transition="all 0.2s ease"
          >
            {/* ================================================== */}
            {/* = HEADER (property + rating)                      = */}
            {/* ================================================== */}
            <HStack
              justify="space-between"
              align="center"
              flexWrap="wrap"
              gap={2}
            >
              <Heading size="sm" noOfLines={1}>
                {review.property?.title || "Onbekende property"}
              </Heading>

              <Badge
                colorScheme="yellow"
                fontSize="0.9em"
                px={2}
                py={0.5}
                borderRadius="md"
              >
                ⭐ {review.rating} / 5
              </Badge>
            </HStack>

            <Divider my={3} />

            {/* ================================================== */}
            {/* = COMMENT                                         = */}
            {/* ================================================== */}
            <Text fontStyle="italic" mb={3} lineHeight="1.6">
              "{review.comment}"
            </Text>

            {/* ================================================== */}
            {/* = USER NAAM                                       = */}
            {/* ================================================== */}
            <Text fontSize="sm" color="gray.600">
              — {review.user?.name || "Anonieme gast"}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
