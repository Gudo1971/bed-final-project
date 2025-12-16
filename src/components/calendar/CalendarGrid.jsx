import { Grid, Box, Text } from "@chakra-ui/react";
import { io } from "socket.io-client";
import  {useEffect} from "react";





export default function CalendarGrid({
  days,
  disabledDates,
  checkIn,
  checkOut,
  onDateClick,
  setDisabledDates,
}) {


useEffect(() => {
  const socket = io("http://localhost:3000"); // of je live URL

  socket.on("booking:created", (booking) => {
    const start = new Date(booking.checkinDate);
    const end = new Date(booking.checkoutDate);

    const newDisabled = [];
    for (let d = start; d <= end; d = new Date(d.getTime() + 86400000)) {
      newDisabled.push(d.toISOString().split("T")[0]);
    }

    setDisabledDates((prev) => [...prev, ...newDisabled]);
  });

  return () => socket.disconnect();
}, []);


  // ⭐ Lokale datum formatter (geen UTC!)
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

  const isSelected = (date) => {
    const dateStr = formatDate(date);
    return checkIn === dateStr || checkOut === dateStr;
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
    selected && checkIn === dateStr
      ? "md 0 0 md"
      : selected && checkOut === dateStr
      ? "0 md md 0"
      : "md"
  }
  cursor={disabled ? "not-allowed" : "pointer"}
  bg={
    disabled
      ? "red.300"      // internationale standaard
      : selected
      ? "blue.400"
      : inRange
      ? "blue.100"
      : "white"
  }
  color={
    disabled
      ? "red.700"      // duidelijk zichtbaar
      : selected
      ? "white"
      : "black"
  }
  _hover={{
    bg: disabled ? "red.300" : "blue.50", // geen hover op disabled
  }}
  onClick={() => !disabled && onDateClick(date)} // klik blokkeren
  boxShadow={disabled ? "none" : "sm"} // geen schaduw op disabled
>
  <Text fontWeight="medium">
    {date.getDate()}
  </Text>

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
