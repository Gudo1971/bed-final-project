import { useState } from "react";
import {
  VStack,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { createReview } from "../../services/reviewService";

export default function ReviewForm({ propertyId, userId, onReviewAdded }) {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const isRatingInvalid = rating < 1 || rating > 5 || rating === "";
  const isCommentInvalid = comment.trim().length < 5;

  const handleSubmit = async () => {
    if (isRatingInvalid || isCommentInvalid) return;

    const newReview = await createReview({
      rating: Number(rating),
      comment,
      propertyId,
      userId,
    });

    onReviewAdded(newReview);

    setRating("");
    setComment("");
  };

  return (
    <VStack spacing={4} align="start" w="100%">
      <FormControl isInvalid={isRatingInvalid}>
        <FormLabel>Rating (1-5)</FormLabel>
        <Input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          placeholder="Geef een rating van 1 t/m 5"
        />
        {isRatingInvalid && (
          <FormErrorMessage>
            Rating moet tussen 1 en 5 zijn.
          </FormErrorMessage>
        )}
      </FormControl>

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

      <Button
        colorScheme="blue"
        onClick={handleSubmit}
        isDisabled={isRatingInvalid || isCommentInvalid}
      >
        Review plaatsen
      </Button>
    </VStack>
  );
}
