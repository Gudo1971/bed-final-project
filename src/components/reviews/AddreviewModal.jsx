// ==============================================
// = ADD REVIEW MODAL                            =
// = Nieuwe review toevoegen via ReviewForm      =
// ==============================================

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import ReviewForm from "./ReviewForm";

// ==============================================
// = COMPONENT                                   =
// ==============================================
export default function AddReviewModal({
  isOpen,
  onClose,
  propertyId,
  onReviewAdded,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />

      <ModalContent>
        {/* ============================================== */}
        {/* = HEADER                                      = */}
        {/* ============================================== */}
        <ModalHeader>Review toevoegen</ModalHeader>
        <ModalCloseButton />

        {/* ============================================== */}
        {/* = BODY                                        = */}
        {/* ============================================== */}
        <ModalBody pb={6}>
          <ReviewForm
            propertyId={propertyId}
            onReviewAdded={(review) => {
              // ==============================================
              // = REVIEW DOORGEVEN AAN PARENT                =
              // ==============================================
              onReviewAdded?.(review);

              // ==============================================
              // = MODAL SLUITEN                              =
              // ==============================================
              onClose();
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
