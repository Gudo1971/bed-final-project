import { Flex, IconButton, Text } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export default function CalendarHeader({ month, year, onPrevMonth, onNextMonth }) {
  const monthNames = [
    "Januari", "Februari", "Maart", "April", "Mei", "Juni",
    "Juli", "Augustus", "September", "Oktober", "November", "December"
  ];

  return (
    <Flex justify="space-between" align="center" mb={4}>
      <IconButton
        icon={<ChevronLeftIcon />}
        onClick={onPrevMonth}
        aria-label="Vorige maand"
        variant="ghost"
      />

      <Text fontSize="xl" fontWeight="bold">
        {monthNames[month]} {year}
      </Text>

      <IconButton
        icon={<ChevronRightIcon />}
        onClick={onNextMonth}
        aria-label="Volgende maand"
        variant="ghost"
      />
    </Flex>
  );
}
