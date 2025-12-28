// ==============================================
// = BOOKINGS API                                =
// = CRUD acties voor boekingen                  =
// ==============================================

import axios from "axios";

// ==============================================
// = BASE URL                                    =
// ==============================================
const API_URL = "http://localhost:3000/api";

// ==============================================
// = TOKEN HELPER                                =
// ==============================================
function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ==============================================
// = GET ALL BOOKINGS                            =
// = GET /bookings                               =
// ==============================================
export async function getBookings() {
  const res = await axios.get(`${API_URL}/bookings`, {
    headers: authHeader(),
  });
  return res.data;
}

// ==============================================
// = GET BOOKING BY ID                           =
// = GET /bookings/:id                           =
// ==============================================
export async function getBookingById(id) {
  const res = await axios.get(`${API_URL}/bookings/${id}`, {
    headers: authHeader(),
  });
  return res.data;
}

// ==============================================
// = CREATE BOOKING                              =
// = POST /bookings                              =
// ==============================================
export async function createBooking(payload) {
  const res = await axios.post(`${API_URL}/bookings`, payload, {
    headers: authHeader(),
  });
  return res.data;
}

// ==============================================
// = UPDATE BOOKING                              =
// = PATCH /bookings/:id                         =
// ==============================================
export async function updateBooking(id, payload) {
  const res = await axios.patch(`${API_URL}/bookings/${id}`, payload, {
    headers: authHeader(),
  });
  return res.data;
}

// ==============================================
// = DELETE BOOKING                              =
// = DELETE /bookings/:id                        =
// ==============================================
export async function deleteBooking(id) {
  const res = await axios.delete(`${API_URL}/bookings/${id}`, {
    headers: authHeader(),
  });
  return res.data;
}
