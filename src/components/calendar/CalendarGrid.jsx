// CalendarGrid.jsx
// Clean calendar grid without hover icons or hover overlays

import { Grid, Box, Text } from "@chakra-ui/react";

export default function CalendarGrid({
  days,
  disabledDates = [],
  checkIn,
  checkOut,
  onDateClick,
  isInteractive = true,
}) {
  // Format a Date object into YYYY-MM-DD
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Check if date is disabled based on backend list
  const isDisabled = (date) => {
    if (!Array.isArray(disabledDates)) return false;
    return disabledDates.includes(formatDate(date));
  };

  // Check if date is before today
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Determine if date is check-in or check-out
  const getSelectionType = (date) => {
    const dateStr = formatDate(date);
    if (dateStr === checkIn) return "checkin";
    if (dateStr === checkOut) return "checkout";
    return "";
  };

  // Determine if date is between check-in and check-out
  const isInRange = (date) => {
    if (!checkIn || !checkOut) return false;
    const t = date.getTime();
    return t > new Date(checkIn).getTime() && t < new Date(checkOut).getTime();
  };

  return (
    <>
      {/* Weekday labels */}
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

      {/* Days grid */}
      <Grid templateColumns="repeat(7, 1fr)" gap={0.5}>
        {days.map((date) => {
          const dateStr = formatDate(date);
          const past = isPastDate(date);
          const disabled = isDisabled(date) || past;
          const selectionType = getSelectionType(date);
          const inRange = isInRange(date);

          // Border radius for start/end of range
          const borderRadius =
            selectionType === "checkin"
              ? "md 0 0 md"
              : selectionType === "checkout"
              ? "0 md md 0"
              : inRange
              ? "blue.500"
              : "white"
              ? "0"
              : "md";

          // Background color based on state
          const bgColor = disabled
            ? "red.300"
            : selectionType === "checkin"
            ? "green.400"
            : selectionType === "checkout"
            ? "blue.700"
            : inRange
            ? "blue.100"
            : "white";

          // Text color
          const textColor = disabled
            ? "red.700"
            : selectionType
            ? "white"
            : "black";

          return (
            <Box
              key={dateStr}
              p={0.5}
              minW="28px"
              textAlign="center"
              position="relative"
              borderRadius={borderRadius}
              cursor={
                !isInteractive
                  ? "default"
                  : disabled
                  ? "not-allowed"
                  : "pointer"
              }
              bg={bgColor}
              color={textColor}
              // Subtle hover only, no icons or overlays
              _hover={
                !isInteractive || disabled
                  ? {}
                  : {
                      bg:
                        selectionType === "checkin"
                          ? "green.500"
                          : selectionType === "checkout"
                          ? "blue.800"
                          : inRange
                          ? "blue.200"
                          : "gray.100",
                    }
              }
              onClick={() => {
                if (!isInteractive) return;
                if (!disabled) onDateClick(date);
              }}
              boxShadow={!isInteractive || disabled ? "none" : "sm"}
            >
              {/* Day number */}
              <Text fontWeight="medium">{date.getDate()}</Text>

              {/* Check-in label */}
              {selectionType === "checkin" && (
                <Text fontSize="xs" color="white" mt={1}>
                  Check-in
                </Text>
              )}

              {/* Check-out label */}
              {selectionType === "checkout" && (
                <Text fontSize="xs" color="white" mt={1}>
                  Check-out
                </Text>
              )}

              {/* Disabled indicator */}
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
