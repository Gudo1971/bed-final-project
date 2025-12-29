// ==============================================
// = EDIT REVIEW MODAL                           =
// = Review rating + comment aanpassen           =
// ==============================================

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  Textarea,
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";

import { useState } from "react";

export default function EditReviewModal({ isOpen, onClose, review, onSave }) {
  // ==============================================
  // = FORM STATE                                 =
  // ==============================================
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);

  const isRatingInvalid = rating < 1 || rating > 5;
  const isCommentInvalid = comment.trim().length < 5;

  // ==============================================
  // = SUBMIT HANDLER                             =
  // ==============================================
  function handleSubmit() {
    if (isRatingInvalid || isCommentInvalid) return;

    onSave({
      rating: Number(rating),
      comment,
    });
  }

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />

      <ModalContent>
        {/* ============================================== */}
        {/* = HEADER                                      = */}
        {/* ============================================== */}
        <ModalHeader>Review bewerken</ModalHeader>
        <ModalCloseButton />

        {/* ============================================== */}
        {/* = BODY                                        = */}
        {/* ============================================== */}
        <ModalBody>
          <VStack spacing={5} align="stretch">

            {/* ============================================== */}
            {/* = RATING                                      = */}
            {/* ============================================== */}
            <FormControl isInvalid={isRatingInvalid}>
              <FormLabel fontWeight="bold">Rating (1–5)</FormLabel>

              <NumberInput
                value={rating}
                min={1}
                max={5}
                onChange={(value) => setRating(value)}
              >
                <NumberInputField />
              </NumberInput>

              {isRatingInvalid && (
                <FormErrorMessage>
                  Rating moet tussen 1 en 5 liggen.
                </FormErrorMessage>
              )}
            </FormControl>

            {/* ============================================== */}
            {/* = COMMENT                                     = */}
            {/* ============================================== */}
            <FormControl isInvalid={isCommentInvalid}>
              <FormLabel fontWeight="bold">Review</FormLabel>

              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Schrijf je review..."
                resize="vertical"
                minH="120px"
              />

              {isCommentInvalid && (
                <FormErrorMessage>
                  Review moet minimaal 5 karakters bevatten.
                </FormErrorMessage>
              )}
            </FormControl>

          </VStack>
        </ModalBody>

        {/* ============================================== */}
        {/* = FOOTER                                      = */}
        {/* ============================================== */}
        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Annuleren
          </Button>

          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isDisabled={isRatingInvalid || isCommentInvalid}
          >
            Opslaan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
