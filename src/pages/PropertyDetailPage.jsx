import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertyById } from "../services/propertiesService";
import { getReviewsByPropertyId } from "../services/reviews";
import { useNavigate } from "react-router-dom";


export default function PropertyDetailPage() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch property
  useEffect(() => {
    async function fetchProperty() {
      const data = await getPropertyById(id);
      setProperty(data);
    }
    fetchProperty();
  }, [id]);

  // ✅ Fetch reviews
  useEffect(() => {
    async function fetchReviews() {
      const data = await getReviewsByPropertyId(id);
      setReviews(data);
    }
    fetchReviews();
  }, [id]);

  if (!property) {
    return <Text>Loading...</Text>;
  }
console.log("Property object:", property);
  return (
    <Box>
     <Text
  onClick={() => navigate("/")}
  cursor="pointer"
  textDecoration="underline"
>
  ← Terug naar overzicht
</Text> 
      {/* ✅ Property info */}
      <Heading>{property.title}</Heading>
      <Text>{property.description}</Text>
      {/* etc... */}

      {/* ✅ Reviews */}
      <Box mt={10}>
        
        <Heading size="md" mb={4}>Reviews</Heading>

        {reviews.length === 0 && (
          <Text>Er zijn nog geen reviews voor deze property.</Text>
        )}

        <VStack align="stretch" spacing={4}>
          {reviews.map((review) => (
            
            <Box
              key={review.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="sm"
            >
              <Text fontWeight="bold">{review.author}</Text>
              <Text fontSize="sm" color="gray.500">
                {review.rating} / 5 ⭐
              </Text>
              <Text mt={2}>{review.comment}</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
