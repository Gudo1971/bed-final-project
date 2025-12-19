import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import ReviewForm from "./ReviewForm";

export default function AddReviewModal({ isOpen, onClose, propertyId, onReviewAdded }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Review toevoegen</ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <ReviewForm
            propertyId={propertyId}
            onReviewAdded={(review) => {
              // ⭐ Alleen doorgeven aan parent
              onReviewAdded?.(review);

              // ⭐ Modal sluiten
              onClose();
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
