// ==============================================
// = CALENDAR GRID                               =
// = Check-in, check-out, disabled & range       =
// ==============================================

import { Grid, Box, Text } from "@chakra-ui/react";

// ==============================================
// = COMPONENT                                   =
// ==============================================
export default function CalendarGrid({
  days,
  disabledDates = [],
  checkIn,
  checkOut,
  onDateClick,
  isInteractive = true,
}) {
  // ==============================================
  // = HELPERS                                    =
  // ==============================================
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const isDisabled = (date) => {
    if (!Array.isArray(disabledDates)) return false;
    return disabledDates.includes(formatDate(date));
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getSelectionType = (date) => {
    const dateStr = formatDate(date);
    if (dateStr === checkIn) return "checkin";
    if (dateStr === checkOut) return "checkout";
    return "";
  };

  const isInRange = (date) => {
    if (!checkIn || !checkOut) return false;
    const t = date.getTime();
    return t > new Date(checkIn).getTime() && t < new Date(checkOut).getTime();
  };

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <>
      {/* ============================================== */}
      {/* = WEEKDAY LABELS                              = */}
      {/* ============================================== */}
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

      {/* ============================================== */}
      {/* = DAYS GRID                                   = */}
      {/* ============================================== */}
      <Grid templateColumns="repeat(7, 1fr)" gap={0.5}>
        {days.map((date) => {
          const dateStr = formatDate(date);

          const past = isPastDate(date);
          const disabled = isDisabled(date) || past;
          const selectionType = getSelectionType(date);
          const inRange = isInRange(date);

          // ----------------------------------------------
          // BORDER RADIUS
          // ----------------------------------------------
          const borderRadius =
            selectionType === "checkin"
              ? "md 0 0 md"
              : selectionType === "checkout"
              ? "0 md md 0"
              : "md";

          // ----------------------------------------------
          // BACKGROUND COLOR
          // ----------------------------------------------
          const bgColor =
            disabled
              ? "red.300"
              : selectionType === "checkin"
              ? "green.400"
              : selectionType === "checkout"
              ? "blue.700"
              : inRange
              ? "blue.100"
              : "white";

          // ----------------------------------------------
          // TEXT COLOR
          // ----------------------------------------------
          const textColor =
            disabled
              ? "red.700"
              : selectionType
              ? "white"
              : "black";

          // ----------------------------------------------
          // HOVER LOGICA
          // ----------------------------------------------
          const hoverStyle =
            !isInteractive
              ? {}
              : disabled
              ? { bg: "red.300" }
              : selectionType || inRange || checkIn
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
                };

          // ==============================================
          // = DAY CELL                                   =
          // ==============================================
          return (
            <Box
              key={dateStr}
              p={0.5}
              minW="28px"
              textAlign="center"
              position="relative"
              zIndex={1}
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
              _hover={hoverStyle}
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

              {/* Disabled lock */}
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
