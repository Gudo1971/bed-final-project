// ==============================================
// = BOOKING MODAL                              =
// ==============================================

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import BookingForm from "./BookingForm";

export default function BookingModal({
  isOpen,
  onClose,
  propertyId,
  pricePerNight,
  checkIn,
  checkOut,
  isActive,              // ⭐ FIX 1 — property status doorgeven
  onBookingCreated,
  onBookingCancelled,
}) {
  // ==============================================
  // = RENDER MODAL                               =
  // ==============================================
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />

      <ModalContent>
        {/* ============================================== */}
        {/* = HEADER                                      = */}
        {/* ============================================== */}
        <ModalHeader>Boeking afronden</ModalHeader>
        <ModalCloseButton />

        {/* ============================================== */}
        {/* = BODY MET FORM                               = */}
        {/* ============================================== */}
        <ModalBody pb={6}>
          <BookingForm
            propertyId={propertyId}
            pricePerNight={pricePerNight}
            checkIn={checkIn}
            checkOut={checkOut}
            isActive={isActive}   // ⭐ FIX 2 — doorgeven aan BookingForm

            // ==============================================
            // = CALLBACKS                                  =
            // ==============================================
            onBookingCreated={(booking) => {
              if (onBookingCreated) onBookingCreated(booking);
              onClose();
            }}
            onCancel={() => {
              if (onBookingCancelled) onBookingCancelled();
              onClose();
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
