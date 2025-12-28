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
} from "@chakra-ui/react";

import { useState } from "react";

export default function EditReviewModal({ isOpen, onClose, review, onSave }) {
  // ==============================================
  // = FORM STATE                                 =
  // ==============================================
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);

  // ==============================================
  // = SUBMIT HANDLER                             =
  // ==============================================
  function handleSubmit() {
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
          <VStack spacing={4} align="stretch">

            {/* ============================================== */}
            {/* = RATING                                      = */}
            {/* ============================================== */}
            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">
                Rating (1–5)
              </FormLabel>

              <NumberInput
                value={rating}
                min={1}
                max={5}
                onChange={(value) => setRating(value)}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            {/* ============================================== */}
            {/* = COMMENT                                     = */}
            {/* ============================================== */}
            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">
                Review
              </FormLabel>

              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Schrijf je review..."
              />
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

          <Button colorScheme="blue" onClick={handleSubmit}>
            Opslaan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
