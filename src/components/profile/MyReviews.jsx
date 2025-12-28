import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Spinner,
  HStack,
  VStack,
  Image,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { getUserReviews, deleteReview, updateReview } from "../../api/reviews";
import EditReviewModal from "../reviews/EditReviewModal";


// Haal userId uit jouw backend-JWT
function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.id;
}

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedReview, setSelectedReview] = useState(null);
  const [sortBy, setSortBy] = useState("date_desc");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const userId = getUserIdFromToken();

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

  async function handleDelete(id) {
    if (!confirm("Weet je zeker dat je deze review wilt verwijderen?")) return;

    try {
      const token = localStorage.getItem("token");
      await deleteReview(id, token);

      toast({
        title: "Review verwijderd",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      loadReviews();
    } catch (err) {
      toast({
        title: "Verwijderen mislukt",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  async function handleSave(updatedData) {
    try {
      const token = localStorage.getItem("token");
      await updateReview(selectedReview.id, updatedData, token);

      toast({
        title: "Review bijgewerkt",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
      loadReviews();
    } catch (err) {
      toast({
        title: "Fout bij opslaan",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  if (loading) return <Spinner />;

  if (reviews.length === 0)
    return <Text>Je hebt nog geen reviews geschreven.</Text>;

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

  return (
    <>
      {/* Modal */}
      {selectedReview && (
        <EditReviewModal
          isOpen={isOpen}
          onClose={onClose}
          review={selectedReview}
          onSave={handleSave}
        />
      )}

      {/* Sorteren */}
      <HStack mb={4}>
        <Text fontWeight="bold">Sorteren op:</Text>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="date_desc">Datum (nieuwste eerst)</option>
          <option value="date_asc">Datum (oudste eerst)</option>
          <option value="property_asc">Property (A–Z)</option>
          <option value="property_desc">Property (Z–A)</option>
        </select>
      </HStack>

      {/* Review lijst */}
      <VStack spacing={4} align="start" w="100%">
        {sortReviews(reviews, sortBy).map((review) => (
          <Box
            key={review.id}
            p={4}
            border="1px solid #ddd"
            borderRadius="md"
            w="100%"
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
                  <Text fontWeight="bold" fontSize="lg" color="blue.500">
                    {review.property?.title || "Onbekende accommodatie"}
                  </Text>
                </Link>

                <Text>⭐ {review.rating} / 5</Text>
                <Text>{review.comment}</Text>

                <Text fontSize="sm" color="gray.500">
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
