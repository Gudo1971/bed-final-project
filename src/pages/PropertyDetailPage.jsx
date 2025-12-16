import { Box, Heading, Text, VStack, Button,} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById } from "../services/propertiesService";
import { getReviewsByPropertyId } from "../services/reviews";
import ReviewList from "../components/reviews/ReviewList";
import ReviewForm from "../components/reviews/ReviewForm";
import { Link } from "react-router-dom";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);

  const user = { id: "ae62ded3-d6a5-480c-b471-de38efd885c1" }; // Mocked logged-in user

  const handleReviewAdded = (newReview) => {
    setReviews((prevReviews) => [...prevReviews, newReview]);
  };  

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
console.log("URL PARAM ID:", id);
console.log("PROPERTY FROM BACKEND:", property);
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



<Button
  as={Link}
  to={`/booking/${property.id}`}
  colorScheme="teal"
  mt={4}
>
  Boek nu
</Button>



      <VStack align="start" spacing={6} w="100%" mt={8}>
        {/* ✅ ReviewForm */}
        <ReviewForm
          propertyId={property.id}
          userId={user.id}
          onReviewAdded={handleReviewAdded}
          />

        {/* ✅ ReviewList (met echte reviews) */}
       
        <ReviewList reviews={reviews} />
      </VStack>
    </Box>
  );
}
