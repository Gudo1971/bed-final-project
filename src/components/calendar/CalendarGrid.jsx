// ==============================================
// = CALENDAR GRID                               =
// = Check-in, check-out, disabled & range       =
// ==============================================

import { Grid, Box, Text, useColorModeValue } from "@chakra-ui/react";

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
  // = DARK MODE COLORS                           =
  // ==============================================
  const weekdayColor = useColorModeValue("gray.600", "gray.300");
  const disabledBg = useColorModeValue("red.200", "red.600");
  const disabledText = useColorModeValue("red.700", "red.100");

  const checkInBg = useColorModeValue("green.400", "green.500");
  const checkOutBg = useColorModeValue("blue.600", "blue.500");

  const rangeBg = useColorModeValue("blue.100", "blue.900");
  const defaultBg = useColorModeValue("white", "gray.700");
  const defaultText = useColorModeValue("black", "white");

  const hoverBg = useColorModeValue("green.50", "green.900");

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
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();

    return t > start && t < end;
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
            color={weekdayColor}
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
          // BACKGROUND COLOR
          // ----------------------------------------------
          let bgColor = defaultBg;

          if (disabled) bgColor = disabledBg;
          else if (selectionType === "checkin") bgColor = checkInBg;
          else if (selectionType === "checkout") bgColor = checkOutBg;
          else if (inRange) bgColor = rangeBg;

          // ----------------------------------------------
          // TEXT COLOR
          // ----------------------------------------------
          let textColor = defaultText;

          if (disabled) textColor = disabledText;
          if (selectionType) textColor = "white";

          // ----------------------------------------------
          // BORDER RADIUS (Airbnb style)
          // ----------------------------------------------
          const borderRadius =
            selectionType === "checkin"
              ? "md 0 0 md"
              : selectionType === "checkout"
              ? "0 md md 0"
              : "md";

          // ----------------------------------------------
          // HOVER STYLE
          // ----------------------------------------------
          const hoverStyle =
            !isInteractive
              ? {}
              : disabled
              ? { bg: disabledBg }
              : {
                  bg: hoverBg,
                  transition: "0.15s ease",
                };

          // ==============================================
          // = DAY CELL                                   =
          // ==============================================
          return (
            <Box
              key={dateStr}
              p={1}
              minW="32px"
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
              _hover={hoverStyle}
              onClick={() => {
                if (!isInteractive) return;
                if (!disabled) onDateClick(date);
              }}
              boxShadow={!isInteractive || disabled ? "none" : "sm"}
            >
              <Text fontWeight="medium">{date.getDate()}</Text>

              {selectionType === "checkin" && (
                <Text fontSize="xs" color="white" mt={1}>
                  Check‑in
                </Text>
              )}

              {selectionType === "checkout" && (
                <Text fontSize="xs" color="white" mt={1}>
                  Check‑out
                </Text>
              )}

              {disabled && (
                <Text fontSize="xs" color={disabledText}>
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
