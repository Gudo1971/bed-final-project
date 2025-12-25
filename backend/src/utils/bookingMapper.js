export function mapBooking(booking) {
  if (!booking) return null;

  const formatForInput = (value) => {
    if (!value) return null;
    const d = new Date(value);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`; // altijd "YYYY-MM-DD"
  };

  return {
    ...booking,
    checkinDate: formatForInput(booking.startDate),
    checkoutDate: formatForInput(booking.endDate),
  };
}
