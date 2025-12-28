// ==============================================
// = REVIEW FORM                                 =
// = Rating + comment voor een property          =
// ==============================================

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
import { useAuth } from "../../components/context/AuthContext.jsx";

// ==============================================
// = STAR RATING COMPONENT                       =
// ==============================================
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

// ==============================================
// = REVIEW FORM                                 =
// ==============================================
export default function ReviewForm({ propertyId, onReviewAdded }) {
  const { token } = useAuth();
  const toast = useToast();

  // ==============================================
  // = FORM STATE                                 =
  // ==============================================
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isRatingInvalid = rating < 1 || rating > 5;
  const isCommentInvalid = comment.trim().length < 5;

  // ==============================================
  // = SUBMIT HANDLER                             =
  // ==============================================
  const handleSubmit = async () => {
    if (isRatingInvalid || isCommentInvalid) return;

    setIsLoading(true);

    try {
      const newReview = await createReview(
        {
          rating,
          comment,
          propertyId,
        },
        token
      );

      toast({
        title: "Review geplaatst",
        description: "Bedankt voor je bijdrage!",
        status: "success",
        duration: 3000,
      });

      onReviewAdded?.(newReview);

      // Reset form
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("Review plaatsen mislukt:", err);

      const message = err.response?.data?.error;

      // ==============================================
      // = HOST MAG GEEN REVIEWS PLAATSEN             =
      // ==============================================
      if (message === "Hosts kunnen geen reviews plaatsen") {
        toast({
          title: "Review niet toegestaan",
          description:
            "Als geregistreerde host kun je geen reviews plaatsen. Dit zorgt voor eerlijke en betrouwbare beoordelingen.",
          status: "warning",
          duration: 4000,
        });
        return;
      }

      // ==============================================
      // = USER HEEFT AL EEN REVIEW GEPLAATST         =
      // ==============================================
      if (message === "Je hebt deze accommodatie al beoordeeld") {
        toast({
          title: "Je hebt al een review geplaatst",
          description:
            "Je kunt geen tweede review plaatsen. Je kunt je bestaande review wel bewerken via 'Mijn reviews'.",
          status: "info",
          duration: 4000,
        });
        return;
      }

      // ==============================================
      // = ALGEMENE FOUT                              =
      // ==============================================
      toast({
        title: "Review plaatsen mislukt",
        description: message || "Er ging iets mis.",
        status: "error",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <VStack spacing={4} align="start" w="100%">
      {/* ============================================== */}
      {/* = RATING                                      = */}
      {/* ============================================== */}
      <FormControl isInvalid={isRatingInvalid}>
        <FormLabel>Jouw rating</FormLabel>
        <StarRating rating={rating} setRating={setRating} />
        {isRatingInvalid && (
          <FormErrorMessage>
            Kies een rating tussen 1 en 5 sterren.
          </FormErrorMessage>
        )}
      </FormControl>

      {/* ============================================== */}
      {/* = COMMENT                                     = */}
      {/* ============================================== */}
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

      {/* ============================================== */}
      {/* = SUBMIT KNOP                                = */}
      {/* ============================================== */}
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
