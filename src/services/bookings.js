// ==============================================
// = BOOKINGS API                                =
// = CRUD acties voor boekingen                  =
// ==============================================

import api from "../lib/api"; // <-- jouw axios instance

// ==============================================
// = GET ALL BOOKINGS                            =
// = GET /bookings                               =
// ==============================================
export async function getBookings() {
  const res = await api.get("/bookings");
  return res.data;
}

// ==============================================
// = GET BOOKING BY ID                           =
// = GET /bookings/:id                           =
// ==============================================
export async function getBookingById(id) {
  const res = await api.get(`/bookings/${id}`);
  return res.data;
}

// ==============================================
// = CREATE BOOKING                              =
// = POST /bookings                              =
// ==============================================
export async function createBooking(payload) {
  const res = await api.post("/bookings", payload);
  return res.data;
}

// ==============================================
// = UPDATE BOOKING                              =
// = PATCH /bookings/:id                         =
// ==============================================
export async function updateBooking(id, payload) {
  const res = await api.patch(`/bookings/${id}`, payload);
  return res.data;
}

// ==============================================
// = DELETE BOOKING                              =
// = DELETE /bookings/:id                        =
// ==============================================
export async function deleteBooking(id) {
  const res = await api.delete(`/bookings/${id}`);
  return res.data;
}
