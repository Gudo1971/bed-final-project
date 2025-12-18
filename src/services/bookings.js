

export async function getUserBookings(getAccessTokenSilently) {
  const token = await getAccessTokenSilently();

  const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user bookings");
  }

  return response.json();
}

export async function updateBooking(id, payload, getAccessTokenSilently) {
  const token = await getAccessTokenSilently();

  const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update booking");
  }

  return response.json();
}
