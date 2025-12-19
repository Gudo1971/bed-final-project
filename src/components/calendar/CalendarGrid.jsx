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
  isInteractive = true, // ⭐ nieuwe prop
}) {
  // ⭐ Socket realtime updates
  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("booking:created", (booking) => {
      const start = new Date(booking.checkinDate);
      const end = new Date(booking.checkoutDate);

      const newDisabled = [];
      for (let d = start; d <= end; d = new Date(d.getTime() + 86400000)) {
        newDisabled.push(d.toISOString().split("T")[0]);
      }

      // ⭐ Deduplicatie
      setDisabledDates((prev) =>
        Array.from(new Set([...prev, ...newDisabled]))
      );
    });

    return () => socket.disconnect();
  }, [setDisabledDates]);

  // ⭐ Formatter
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const isDisabled = (date) => {
    const dateStr = formatDate(date);
    return disabledDates.includes(dateStr);
  };

  // ⭐ Correcte selectie-check
  const isSelected = (date) => {
    const dateStr = formatDate(date);

    if (dateStr === checkIn) return "checkin";
    if (dateStr === checkOut) return "checkout";

    return "";
  };

  const isInRange = (date) => {
    if (!checkIn || !checkOut) return false;
    const d = date.getTime();
    return d > new Date(checkIn).getTime() && d < new Date(checkOut).getTime();
  };

  return (
    <>
      {/* Weekdagen */}
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

      {/* Dagen */}
      <Grid templateColumns="repeat(7, 1fr)" gap={2}>
        {days.map((date) => {
          const dateStr = formatDate(date);
          const disabled = isDisabled(date);
          const selected = isSelected(date);
          const inRange = isInRange(date);

          return (
            <Box
              key={dateStr}
              p={3}
              textAlign="center"
              borderRadius={
                selected === "checkin"
                  ? "md 0 0 md"
                  : selected === "checkout"
                  ? "0 md md 0"
                  : "md"
              }
              cursor={
                !isInteractive
                  ? "default"
                  : disabled
                  ? "not-allowed"
                  : "pointer"
              }
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
              color={
                disabled
                  ? "red.700"
                  : selected
                  ? "white"
                  : "black"
              }
              _hover={
                !isInteractive
                  ? {}
                  : disabled
                  ? { bg: "red.300" }
                  : { bg: "blue.50" }
              }
              onClick={() => {
                if (!isInteractive) return;
                if (!disabled) onDateClick(date);
              }}
              boxShadow={
                !isInteractive || disabled
                  ? "none"
                  : "sm"
              }
            >
              <Text fontWeight="medium">{date.getDate()}</Text>

              {selected === "checkin" && (
                <Text fontSize="xs" color="white" mt={1}>
                  Check‑in
                </Text>
              )}

              {selected === "checkout" && (
                <Text fontSize="xs" color="white" mt={1}>
                  Check‑out
                </Text>
              )}

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
