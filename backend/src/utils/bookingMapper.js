/* ============================================================
   BOOKING MAPPER
   - Normaliseert datums naar YYYY-MM-DD
   - Houdt ook raw Prisma datums (startDate/endDate)
   - Zorgt voor veilige fallbacks
   - Compatibel met zowel user- als host-dashboard
============================================================ */
export function mapBooking(booking) {
  if (!booking) return null;

  /* ============================================================
     DATUM NORMALISATIE (YYYY-MM-DD)
  ============================================================ */
  const toInputDate = (value) => {
    if (!value) return null;
    const d = new Date(value);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  /* ============================================================
     PROPERTY MAPPER
  ============================================================ */
  const mappedProperty = booking.property
    ? {
        id: booking.property.id,
        title: booking.property.title,
        location: booking.property.location,
        pricePerNight: booking.property.pricePerNight,
        rating: booking.property.rating,
        images: Array.isArray(booking.property.images)
          ? booking.property.images
          : [],
      }
    : null;

  /* ============================================================
     USER MAPPER
  ============================================================ */
  const mappedUser = booking.user
    ? {
        id: booking.user.id,
        name: booking.user.name,
        email: booking.user.email,
      }
    : null;

  /* ============================================================
     RETURN STRUCTUUR
     - checkinDate/checkoutDate → voor user-dashboard & edit modal
     - startDate/endDate → voor host-dashboard
  ============================================================ */
  return {
    id: booking.id,
    numberOfGuests: booking.numberOfGuests ?? 1,
    totalPrice: booking.totalPrice ?? 0,
    bookingStatus: booking.bookingStatus ?? "PENDING",

    // Frontend-friendly
    checkinDate: toInputDate(booking.startDate),
    checkoutDate: toInputDate(booking.endDate),

    // Raw Prisma dates (nodig voor host-dashboard)
    startDate: booking.startDate,
    endDate: booking.endDate,

    property: mappedProperty,
    user: mappedUser,
  };
}
