// ============================================================
// = HOOK: BOOKING STATUS                                      =
// ============================================================

export function getBookingStatus(checkinDate, checkoutDate) {
  if (!checkinDate || !checkoutDate) return "onbekend";

  const now = new Date();
  const checkin = new Date(checkinDate);
  const checkout = new Date(checkoutDate);
  checkout.setHours(23, 59, 59, 999); // einde van de dag

  if (now < checkin) return "toekomstig";
  if (now >= checkin && now <= checkout) return "actief";
  if (now > checkout) return "verlopen";

  return "onbekend";
}
