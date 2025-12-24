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
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

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
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <HStack>
        <Spinner />
        <Text>Reviews laden...</Text>
      </HStack>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        Reviews op mijn properties
      </Heading>

      {reviews.length === 0 && (
        <Text>Er zijn nog geen reviews op jouw properties.</Text>
      )}

      <VStack align="stretch" spacing={4}>
        {reviews.map((review) => (
          <Box
            key={review.id}
            border="1px solid #ddd"
            borderRadius="md"
            p={4}
            _hover={{ boxShadow: "md" }}
          >
            <HStack justify="space-between">
              <Heading size="sm">
                {review.property?.title || "Onbekende property"}
              </Heading>

              <Badge colorScheme="yellow">
                ⭐ {review.rating} / 5
              </Badge>
            </HStack>

            <Divider my={2} />

            <Text fontStyle="italic">"{review.comment}"</Text>

            <Text mt={2} color="gray.600">
              — {review.user?.name || "Anonieme gast"}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
