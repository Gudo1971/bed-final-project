// ==============================================
// = MY REVIEWS PAGE                             =
// = Overzicht van reviews geschreven door user  =
// ==============================================

import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Spinner,
  HStack,
  VStack,
  Image,
  Button,
  Select,
  useDisclosure,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

import { Link } from "react-router-dom";

import {
  getUserReviews,
  deleteReview,
  updateReview,
} from "../../api/reviews";

import EditReviewModal from "../reviews/EditReviewModal";

// ==============================================
// = USER ID UIT JWT                            =
// ==============================================
function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.id;
}

// ==============================================
// = COMPONENT                                   =
// ==============================================
export default function MyReviews() {
  // ==============================================
  // = STATE                                      =
  // ==============================================
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedReview, setSelectedReview] = useState(null);
  const [sortBy, setSortBy] = useState("date_desc");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const userId = getUserIdFromToken();

  // ==============================================
  // = DARK MODE COLORS                           =
  // ==============================================
  const cardBg = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const subTextColor = useColorModeValue("gray.600", "gray.400");

  // ==============================================
  // = REVIEWS OPHALEN                            =
  // ==============================================
  async function loadReviews() {
    try {
      const token = localStorage.getItem("token");
      const data = await getUserReviews(userId, token);
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Kon reviews niet laden:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  // ==============================================
  // = REVIEW VERWIJDEREN                         =
  // ==============================================
  async function handleDelete(id) {
    if (!confirm("Weet je zeker dat je deze review wilt verwijderen?")) return;

    try {
      const token = localStorage.getItem("token");
      await deleteReview(id, token);

      toast({
        title: "Review verwijderd",
        status: "success",
        duration: 3000,
      });

      loadReviews();
    } catch (err) {
      toast({
        title: "Verwijderen mislukt",
        status: "error",
        duration: 3000,
      });
    }
  }

  // ==============================================
  // = REVIEW OPSLAAN (EDIT)                      =
  // ==============================================
  async function handleSave(updatedData) {
    try {
      const token = localStorage.getItem("token");
      await updateReview(selectedReview.id, updatedData, token);

      toast({
        title: "Review bijgewerkt",
        status: "success",
        duration: 3000,
      });

      onClose();
      loadReviews();
    } catch (err) {
      toast({
        title: "Fout bij opslaan",
        status: "error",
        duration: 3000,
      });
    }
  }

  // ==============================================
  // = LOADING STATE                              =
  // ==============================================
  if (loading) {
    return (
      <HStack justify="center" w="100%" mt={10}>
        <Spinner size="lg" />
      </HStack>
    );
  }

  // ==============================================
  // = GEEN REVIEWS                               =
  // ==============================================
  if (reviews.length === 0) {
    return (
      <Text fontSize="lg" color={subTextColor}>
        Je hebt nog geen reviews geschreven.
      </Text>
    );
  }

  // ==============================================
  // = SORT LOGICA                                =
  // ==============================================
  function sortReviews(list, sortBy) {
    const sorted = [...list];

    switch (sortBy) {
      case "date_asc":
        return sorted.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

      case "date_desc":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

      case "property_asc":
        return sorted.sort((a, b) =>
          a.property.title.localeCompare(b.property.title)
        );

      case "property_desc":
        return sorted.sort((a, b) =>
          b.property.title.localeCompare(a.property.title)
        );

      default:
        return sorted;
    }
  }

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <>
      {/* ============================================== */}
      {/* = EDIT MODAL                                  = */}
      {/* ============================================== */}
      {selectedReview && (
        <EditReviewModal
          isOpen={isOpen}
          onClose={onClose}
          review={selectedReview}
          onSave={handleSave}
        />
      )}

      {/* ============================================== */}
      {/* = SORTERING                                   = */}
      {/* ============================================== */}
      <HStack mb={4} spacing={3}>
        <Text fontWeight="bold" color={textColor}>
          Sorteren op:
        </Text>

        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          maxW="250px"
          bg={cardBg}
          color={textColor}
          borderColor="gray.500"
        >
          <option value="date_desc">Datum (nieuwste eerst)</option>
          <option value="date_asc">Datum (oudste eerst)</option>
          <option value="property_asc">Property (A–Z)</option>
          <option value="property_desc">Property (Z–A)</option>
        </Select>
      </HStack>

      {/* ============================================== */}
      {/* = REVIEW LIJST                                = */}
      {/* ============================================== */}
      <VStack spacing={4} align="stretch" w="100%">
        {sortReviews(reviews, sortBy).map((review) => (
          <Box
            key={review.id}
            p={4}
            bg={cardBg}
            borderRadius="md"
            boxShadow="sm"
            _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
            transition="all 0.2s ease"
          >
            <HStack spacing={4} align="start">
              <Image
                src={review.property?.images?.[0] || "/placeholder.jpg"}
                alt="property"
                boxSize="80px"
                borderRadius="md"
                objectFit="cover"
              />

              <VStack align="start" spacing={1} flex="1">
                <Link to={`/properties/${review.propertyId}`}>
                  <Text fontWeight="bold" fontSize="lg" color="teal.400">
                    {review.property?.title || "Onbekende accommodatie"}
                  </Text>
                </Link>

                <Text color={textColor}>⭐ {review.rating} / 5</Text>
                <Text color={textColor}>{review.comment}</Text>

                <Text fontSize="sm" color={subTextColor}>
                  {new Date(review.createdAt).toLocaleDateString("nl-NL")}
                </Text>

                <HStack pt={2}>
                  <Button
                    size="sm"
                    colorScheme="yellow"
                    onClick={() => {
                      setSelectedReview(review);
                      onOpen();
                    }}
                  >
                    Bewerken
                  </Button>

                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(review.id)}
                  >
                    Verwijderen
                  </Button>
                </HStack>
              </VStack>
            </HStack>
          </Box>
        ))}
      </VStack>
    </>
  );
}
