// ==============================================
// = CALENDAR GRID                               =
// = Dagen, disabled dates, selectie & range     =
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
      {/* = WEEKDAYS                                    = */}
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

          // Property inactive → full disabled mode
          const fullyDisabled = !isInteractive;

          const selectionType = getSelectionType(date);
          const inRange = isInRange(date);

          // ==============================================
          // = BORDER RADIUS                              =
          // ==============================================
          const borderRadius =
            selectionType === "checkin"
              ? "md 0 0 md"
              : selectionType === "checkout"
              ? "0 md md 0"
              : "0";

          // ==============================================
          // = BACKGROUND COLOR                           =
          // ==============================================
          const bgColor =
            fullyDisabled
              ? "red.300"
              : disabled
              ? "red.300"
              : selectionType === "checkin"
              ? "green.400"
              : selectionType === "checkout"
              ? "blue.700"
              : inRange
              ? "blue.100"
              : "white";

          // ==============================================
          // = TEXT COLOR                                 =
          // ==============================================
          const textColor =
            fullyDisabled || disabled
              ? "red.700"
              : selectionType
              ? "white"
              : "black";

          // ==============================================
          // = RENDER DAY                                 =
          // ==============================================
          return (
            <Box
              key={dateStr}
              p={0.5}
              minW="28px"
              textAlign="center"
              position="relative"
              borderRadius={borderRadius}
              cursor={
                fullyDisabled
                  ? "default"
                  : disabled
                  ? "not-allowed"
                  : "pointer"
              }
              bg={bgColor}
              color={textColor}
              _hover={
                fullyDisabled || disabled
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
                if (fullyDisabled) return;
                if (!disabled) onDateClick(date);
              }}
              boxShadow={fullyDisabled || disabled ? "none" : "sm"}
            >
              <Text fontWeight="medium">{date.getDate()}</Text>

              {selectionType === "checkin" && (
                <Text fontSize="xs" color="white" mt={1}>
                  Check-in
                </Text>
              )}

              {selectionType === "checkout" && (
                <Text fontSize="xs" color="white" mt={1}>
                  Check-out
                </Text>
              )}

              {(fullyDisabled || disabled) && (
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
