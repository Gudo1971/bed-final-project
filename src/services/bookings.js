import axios from "axios";

export async function getUserBookings() {
  const response = await axios.get("http://localhost:3000/bookings/user");
  return response.data;
}
