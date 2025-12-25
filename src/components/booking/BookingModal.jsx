// BookingModal.jsx
// Modal die het BookingForm toont en de geselecteerde datums doorgeeft.

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
  onBookingCreated,   // callback vanuit BookingPage
  onBookingCancelled, // nieuwe callback voor annuleren
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Boeking afronden</ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <BookingForm
            propertyId={propertyId}
            pricePerNight={pricePerNight}
            checkIn={checkIn}
            checkOut={checkOut}
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
