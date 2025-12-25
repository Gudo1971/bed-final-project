// CalendarGrid.jsx
// Renders a calendar grid with check-in, check-out and range highlighting

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

  // Check if a date is disabled based on the disabledDates list
  const isDisabled = (date) => {
    if (!Array.isArray(disabledDates)) return false;
    return disabledDates.includes(formatDate(date));
  };

  // Check if a date is in the past (before today)
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Determine if the date matches check-in or check-out
  const isSelected = (date) => {
    const dateStr = formatDate(date);
    if (dateStr === checkIn) return "checkin";
    if (dateStr === checkOut) return "checkout";
    return "";
  };

  // Determine if the date is between check-in and check-out
  const isInRange = (date) => {
    if (!checkIn || !checkOut) return false;
    const t = date.getTime();
    return t > new Date(checkIn).getTime() && t < new Date(checkOut).getTime();
  };

  // Render header row with weekday labels and days grid
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
          const selected = isSelected(date);
          const inRange = isInRange(date);

          return (
            <Box
              key={dateStr}
              p={0.5}
              minW="28px"
              textAlign="center"
              position="relative"
              zIndex={1}
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
              // Hover behavior:
              // - show red for disabled
              // - show only subtle bg if already in a selection
              // - show checkmark only when there is no selection yet
              _hover={
                !isInteractive
                  ? {}
                  : disabled
                  ? { bg: "red.300" }
                  : selected || inRange || checkIn
                  ? { bg: "green.50" }
                  : {
                      bg: "green.50",
                      _after: {
                        content: '"✔"',
                        position: "absolute",
                        top: "2px",
                        right: "4px",
                        color: "green.500",
                        fontSize: "12px",
                        fontWeight: "bold",
                        zIndex: 5,
                        pointerEvents: "none",
                      },
                    }
              }
              // Click handler delegates date selection back to parent
              onClick={() => {
                if (!isInteractive) return;
                if (!disabled) onDateClick(date);
              }}
              boxShadow={!isInteractive || disabled ? "none" : "sm"}
            >
              {/* Day number */}
              <Text fontWeight="medium">{date.getDate()}</Text>

              {/* Check-in label under selected start date */}
              {selected === "checkin" && (
                <Text fontSize="xs" color="white" mt={1}>
                  Check-in
                </Text>
              )}

              {/* Check-out label under selected end date */}
              {selected === "checkout" && (
                <Text fontSize="xs" color="white" mt={1}>
                  Check-out
                </Text>
              )}

              {/* Lock icon for disabled days */}
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
