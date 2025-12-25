import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { updateBooking } from "../../services/bookings";
import { useEffect, useMemo } from "react";

export default function BookingEditModal({
  isOpen,
  onClose,
  booking,
  disabledDates = [],
  refresh,
}) {
  const toast = useToast();

  // Vandaag in YYYY-MM-DD formaat (blokkeert verleden)
  const today = useMemo(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }, []);

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      checkinDate: booking?.checkinDate,
      checkoutDate: booking?.checkoutDate,
    },
  });

  // Reset wanneer booking verandert
  useEffect(() => {
    if (booking) {
      reset({
        checkinDate: booking.checkinDate,
        checkoutDate: booking.checkoutDate,
      });
    }
  }, [booking, reset]);

  // Check of datum geblokkeerd is
  function isDateDisabled(dateStr) {
    return disabledDates.includes(dateStr);
  }

  // Submit handler
  async function onSubmit(values) {
    const { checkinDate, checkoutDate } = values;

    // Blokkeer disabled dates
    if (isDateDisabled(checkinDate) || isDateDisabled(checkoutDate)) {
      toast({
        title: "Datum niet beschikbaar",
        description: "Deze datum is al geboekt.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await updateBooking(booking.id, values);

      toast({
        title: "Boeking bijgewerkt",
        description: "De wijzigingen zijn opgeslagen.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      refresh();
      onClose();
    } catch (err) {
      toast({
        title: "Fout bij opslaan",
        description: "Probeer het opnieuw.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  if (!booking) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Boeking bewerken</ModalHeader>

        <ModalBody>
          <Text mb={4} fontWeight="bold">
            {booking.property?.title}
          </Text>

          <form id="edit-booking-form" onSubmit={handleSubmit(onSubmit)}>
            {/* CHECK-IN */}
            <FormControl mb={4}>
              <FormLabel>Check‑in</FormLabel>
              <Input
                type="date"
                min={today} // blokkeer verleden
                {...register("checkinDate")}
                onChange={(e) => {
                  const value = e.target.value;

                  if (isDateDisabled(value)) {
                    toast({
                      title: "Datum niet beschikbaar",
                      description: "Deze datum is al geboekt.",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });

                    reset({
                      checkinDate: booking.checkinDate,
                      checkoutDate: booking.checkoutDate,
                    });
                    return;
                  }

                  setValue("checkinDate", value);
                }}
              />
            </FormControl>

            {/* CHECK-OUT */}
            <FormControl mb={4}>
              <FormLabel>Check‑out</FormLabel>
              <Input
                type="date"
                min={today} // blokkeer verleden
                {...register("checkoutDate")}
                onChange={(e) => {
                  const value = e.target.value;

                  if (isDateDisabled(value)) {
                    toast({
                      title: "Datum niet beschikbaar",
                      description: "Deze datum is al geboekt.",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });

                    reset({
                      checkinDate: booking.checkinDate,
                      checkoutDate: booking.checkoutDate,
                    });
                    return;
                  }

                  setValue("checkoutDate", value);
                }}
              />
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Annuleren
          </Button>
          <Button colorScheme="teal" type="submit" form="edit-booking-form">
            Opslaan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
