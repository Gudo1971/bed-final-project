import { useState } from "react";
import {
  VStack,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
  Text,
  useToast,
} from "@chakra-ui/react";
import { createReview } from "../../services/reviewService";
import { useAuth0 } from "@auth0/auth0-react";

// ⭐ Klikbare sterren component
function StarRating({ rating, setRating }) {
  const [hover, setHover] = useState(0);

  return (
    <Box>
      {[1, 2, 3, 4, 5].map((value) => {
        const isActive = value <= (hover > 0 ? hover : rating);

        return (
          <Text
            as="span"
            key={value}
            display="inline-block"
            fontSize="2xl"
            cursor="pointer"
            color={isActive ? "yellow.400" : "gray.400"}
            transition="color 0.2s ease, transform 0.15s ease"
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(value)}
            _hover={{ transform: "scale(1.2)" }}
            mr={1}
          >
            ★
          </Text>
        );
      })}
    </Box>
  );
}



export default function ReviewForm({ propertyId, onReviewAdded }) {
  const { getAccessTokenSilently } = useAuth0();
  const toast = useToast();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isRatingInvalid = rating < 1 || rating > 5;
  const isCommentInvalid = comment.trim().length < 5;

  const handleSubmit = async () => {
    if (isRatingInvalid || isCommentInvalid) return;

    setIsLoading(true);

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://staybnb-api/",
        },
      });

      const newReview = await createReview(
        {
          rating,
          comment,
          propertyId,
        },
        token
      );

      // ⭐ Succes toast
      toast({
        title: "Review geplaatst",
        description: "Bedankt voor je bijdrage!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onReviewAdded?.(newReview);

      // Reset form
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("Review plaatsen mislukt:", err);

      // ⭐ Error toast
      toast({
        title: "Er ging iets mis",
        description: "Probeer het later opnieuw.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="start" w="100%">
      {/* ⭐ Rating */}
      <FormControl isInvalid={isRatingInvalid}>
        <FormLabel>Jouw rating</FormLabel>
        <StarRating rating={rating} setRating={setRating} />
        {isRatingInvalid && (
          <FormErrorMessage>
            Kies een rating tussen 1 en 5 sterren.
          </FormErrorMessage>
        )}
      </FormControl>

      {/* ⭐ Comment */}
      <FormControl isInvalid={isCommentInvalid}>
        <FormLabel>Review</FormLabel>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Schrijf je review..."
        />
        {isCommentInvalid && (
          <FormErrorMessage>
            Review moet minimaal 5 karakters bevatten.
          </FormErrorMessage>
        )}
      </FormControl>

      {/* ⭐ Submit */}
      <Button
        colorScheme="blue"
        onClick={handleSubmit}
        isDisabled={isRatingInvalid || isCommentInvalid}
        isLoading={isLoading}
        loadingText="Bezig..."
      >
        Review plaatsen
      </Button>
    </VStack>
  );
}
