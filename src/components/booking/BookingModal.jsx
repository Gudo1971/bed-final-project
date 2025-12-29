// ==============================================
// = BOOKING MODAL                               =
// = Boeking afronden + BookingForm wrapper      =
// ==============================================

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
} from "@chakra-ui/react";

import BookingForm from "./BookingForm";

export default function BookingModal({
  isOpen,
  onClose,
  propertyId,
  pricePerNight,
  checkIn,
  checkOut,
  isActive,              // Property status doorgeven
  onBookingCreated,
  onBookingCancelled,
}) {
  // ==============================================
  // = DARK MODE COLORS                           =
  // ==============================================
  const headerColor = useColorModeValue("gray.800", "gray.100");

  // ==============================================
  // = RENDER MODAL                               =
  // ==============================================
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />

      <ModalContent borderRadius="lg">
        {/* ============================================== */}
        {/* = HEADER                                      = */}
        {/* ============================================== */}
        <ModalHeader color={headerColor}>Boeking afronden</ModalHeader>
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
            isActive={isActive}

            // ==============================================
            // = CALLBACKS                                  =
            // ==============================================
            onBookingCreated={(booking) => {
              onBookingCreated?.(booking);
              onClose();
            }}
            onCancel={() => {
              onBookingCancelled?.();
              onClose();
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
