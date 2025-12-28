export function mapBooking(booking) {
  if (!booking) return null;

  const toInputDate = (value) => {
    if (!value) return null;

    const d = new Date(value);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`; // altijd YYYY-MM-DD
  };

  return {
    ...booking,
    checkinDate: toInputDate(booking.startDate),
    checkoutDate: toInputDate(booking.endDate),
  };
}
