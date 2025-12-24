export async function getUserBookings(userId, token) {
  const res = await fetch(`http://localhost:3000/bookings/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
}
