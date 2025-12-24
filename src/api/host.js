const BASE_URL = "http://localhost:3000";

export async function getHostProperties(token) {
  const res = await fetch(`${BASE_URL}/properties/host/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch host properties");
  return res.json();
}

export async function getHostBookings(token) {
  const res = await fetch(`${BASE_URL}/bookings/host/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch host bookings");
  return res.json();
}

export async function getHostReviews(token) {
  const res = await fetch(`${BASE_URL}/reviews/host/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch host reviews");
  return res.json();
}
