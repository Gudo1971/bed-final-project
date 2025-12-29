// ==============================================
// = CALENDAR HEADER                             =
// = Maand + jaar + navigatieknoppen             =
// ==============================================

import { Flex, IconButton, Text, useColorModeValue } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

// ==============================================
// = COMPONENT                                   =
// ==============================================
export default function CalendarHeader({
  month,
  year,
  onPrevMonth,
  onNextMonth,
}) {
  // ==============================================
  // = MAANDNAMEN                                 =
  // ==============================================
  const monthNames = [
    "Januari",
    "Februari",
    "Maart",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Augustus",
    "September",
    "Oktober",
    "November",
    "December",
  ];

  // ==============================================
  // = DARK MODE COLORS                           =
  // ==============================================
  const textColor = useColorModeValue("gray.800", "gray.100");
  const buttonColor = useColorModeValue("gray.600", "gray.300");
  const buttonHover = useColorModeValue("gray.700", "gray.200");

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Flex justify="space-between" align="center" mb={4}>
      {/* ============================================== */}
      {/* = VORIGE MAAND                                = */}
      {/* ============================================== */}
      <IconButton
        aria-label="Vorige maand"
        icon={<ChevronLeftIcon />}
        variant="ghost"
        color={buttonColor}
        _hover={{ color: buttonHover }}
        onClick={onPrevMonth}
      />

      {/* ============================================== */}
      {/* = MAAND + JAAR                                = */}
      {/* ============================================== */}
      <Text
        fontSize="xl"
        fontWeight="bold"
        color={textColor}
        userSelect="none"
      >
        {monthNames[month]} {year}
      </Text>

      {/* ============================================== */}
      {/* = VOLGENDE MAAND                              = */}
      {/* ============================================== */}
      <IconButton
        aria-label="Volgende maand"
        icon={<ChevronRightIcon />}
        variant="ghost"
        color={buttonColor}
        _hover={{ color: buttonHover }}
        onClick={onNextMonth}
      />
    </Flex>
  );
}
