const BASE_URL = "http://localhost:3000";

/* ============================================================
   GET HOST PROPERTIES
   Backend route: GET /hosts/properties
   ============================================================ */
export async function getHostProperties(token) {
  const res = await fetch(`${BASE_URL}/hosts/properties`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch host properties");
  return res.json();
}

/* ============================================================
   GET HOST BOOKINGS
   Backend route: GET /bookings/host/me
   (Deze route moet jij nog controleren of hij bestaat)
   ============================================================ */
export async function getHostBookings(token) {
  const res = await fetch(`${BASE_URL}/bookings/host/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch host bookings");
  return res.json();
}

/* ============================================================
   GET HOST REVIEWS
   Backend route: GET /reviews/host/me
   (Ook deze moet jij nog checken)
   ============================================================ */
export async function getHostReviews(token) {
  const res = await fetch(`${BASE_URL}/reviews/host/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch host reviews");
  return res.json();
}
