// ==============================================
// = CALENDAR HEADER                             =
// = Maand + jaar + navigatieknoppen             =
// ==============================================

import { Flex, IconButton, Text } from "@chakra-ui/react";
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
  // = RENDER                                      =
  // ==============================================
  return (
    <Flex justify="space-between" align="center" mb={4}>
      {/* ============================================== */}
      {/* = VORIGE MAAND                                = */}
      {/* ============================================== */}
      <IconButton
        icon={<ChevronLeftIcon />}
        onClick={onPrevMonth}
        aria-label="Vorige maand"
        variant="ghost"
      />

      {/* ============================================== */}
      {/* = MAAND + JAAR                                = */}
      {/* ============================================== */}
      <Text fontSize="xl" fontWeight="bold">
        {monthNames[month]} {year}
      </Text>

      {/* ============================================== */}
      {/* = VOLGENDE MAAND                              = */}
      {/* ============================================== */}
      <IconButton
        icon={<ChevronRightIcon />}
        onClick={onNextMonth}
        aria-label="Volgende maand"
        variant="ghost"
      />
    </Flex>
  );
}
