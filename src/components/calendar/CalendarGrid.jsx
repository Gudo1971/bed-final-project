import { Grid, Box, Text } from "@chakra-ui/react";
import { io } from "socket.io-client";
import { useEffect } from "react";

export default function CalendarGrid({
  days,
  disabledDates,
  checkIn,
  checkOut,
  onDateClick,
  setDisabledDates,
  isInteractive = true,
}) {

  // ---------------------------------------------------------
  // SOCKET.IO REALTIME UPDATES
  // ---------------------------------------------------------
  // - Verbindt met backend via WebSocket
  // - Luistert naar "booking:created" events
  // - Voegt nieuwe disabled dates toe zonder duplicaten
  useEffect(() => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
      autoConnect: true
    });

    socket.on("booking:created", (booking) => {
      const start = new Date(booking.checkinDate);
      const end = new Date(booking.checkoutDate);

      const newDisabled = [];
      for (let d = start; d <= end; d = new Date(d.getTime() + 86400000)) {
        newDisabled.push(d.toISOString().split("T")[0]);
      }

      setDisabledDates((prev) =>
        Array.from(new Set([...prev, ...newDisabled]))
      );
    });

    return () => socket.disconnect();
  }, [setDisabledDates]);

  // ---------------------------------------------------------
  // HULPFUNCTIES
  // ---------------------------------------------------------

  // Format date naar YYYY-MM-DD
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Check of datum in disabledDates zit
  const isDisabled = (date) => disabledDates.includes(formatDate(date));

  // Check of datum in het verleden ligt
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Check of datum check-in of check-out is
  const isSelected = (date) => {
    const dateStr = formatDate(date);
    if (dateStr === checkIn) return "checkin";
    if (dateStr === checkOut) return "checkout";
    return "";
  };

  // Check of datum tussen check-in en check-out ligt
  const isInRange = (date) => {
    if (!checkIn || !checkOut) return false;
    const t = date.getTime();
    return t > new Date(checkIn).getTime() && t < new Date(checkOut).getTime();
  };

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------
  return (
    <>
      {/* Weekdagen header */}
      <Grid templateColumns="repeat(7, 1fr)" mb={2}>
        {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day) => (
          <Box
            key={day}
            textAlign="center"
            fontWeight="bold"
            color="gray.600"
            py={1}
          >
            {day}
          </Box>
        ))}
      </Grid>

      {/* Dagen van de maand */}
      <Grid templateColumns="repeat(7, 1fr)" gap={0.5}>
        {days.map((date) => {
          const dateStr = formatDate(date);
          const past = isPastDate(date);
          const disabled = isDisabled(date) || past;
          const selected = isSelected(date);
          const inRange = isInRange(date);

          return (
            <Box
              key={dateStr}
              p={0.5}
              minW="28px"
              textAlign="center"
              position="relative"

              // Border radius voor check-in en check-out styling
              borderRadius={
                selected === "checkin"
                  ? "md 0 0 md"
                  : selected === "checkout"
                  ? "0 md md 0"
                  : "md"
              }

              // Cursor gedrag
              cursor={
                !isInteractive
                  ? "default"
                  : disabled
                  ? "not-allowed"
                  : "pointer"
              }

              // Achtergrondkleur op basis van status
              bg={
                disabled
                  ? "red.300"
                  : selected === "checkin"
                  ? "green.400"
                  : selected === "checkout"
                  ? "blue.700"
                  : inRange
                  ? "blue.100"
                  : "white"
              }

              // Tekstkleur
              color={
                disabled
                  ? "red.700"
                  : selected
                  ? "white"
                  : "black"
              }

              // Hover gedrag
              _hover={
                !isInteractive
                  ? {}
                  : disabled
                  ? { bg: "red.300" }
                  : {
                      bg: "green.50",
                      _after: {
                        content: '"✔"',
                        position: "absolute",
                        top: "2px",
                        right: "4px",
                        color: "green.500",
                        fontSize: "12px",
                        fontWeight: "bold"
                      }
                    }
              }

              // Klikgedrag
              onClick={() => {
                if (!isInteractive) return;
                if (!disabled) onDateClick(date);
              }}

              // Schaduw voor actieve datums
              boxShadow={
                !isInteractive || disabled
                  ? "none"
                  : "sm"
              }
            >
              <Text fontWeight="medium">{date.getDate()}</Text>

              {/* Labels voor check-in en check-out */}
              {selected === "checkin" && (
                <Text fontSize="xs" color="white" mt={1}>
                  Check-in
                </Text>
              )}

              {selected === "checkout" && (
                <Text fontSize="xs" color="white" mt={1}>
                  Check-out
                </Text>
              )}

              {/* Slotje voor disabled of verleden */}
              {disabled && (
                <Text fontSize="xs" color="red.700">
                  🔒
                </Text>
              )}
            </Box>
          );
        })}
      </Grid>
    </>
  );
}
