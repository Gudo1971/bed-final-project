// ==============================================
// = BOOKINGS API                                =
// = CRUD + disabled dates                       =
// ==============================================

import { apiClient } from "./apiClient";

// ==============================================
// = SAFE REQUEST WRAPPER                        =
// ==============================================
async function safeRequest(promise) {
  try {
    return await promise;
  } catch (err) {
    console.error("❌ Bookings API error:", err);
    throw err?.error || err;
  }
}

// Helper: build headers
function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ============================================================
   CREATE BOOKING
   POST /bookings
============================================================ */
export function createBooking(data, token) {
  return safeRequest(
    apiClient(`/bookings`, {
      method: "POST",
      headers: authHeaders(token),
      body: data,
    })
  );
}

/* ============================================================
   GET USER BOOKINGS
   GET /bookings/user/:userId
============================================================ */
export function getUserBookings(userId, token) {
  return safeRequest(
    apiClient(`/bookings/user/${userId}`, {
      headers: authHeaders(token),
    })
  );
}

/* ============================================================
   GET BOOKING BY ID
   GET /bookings/:id
============================================================ */
export function getBookingById(id, token) {
  return safeRequest(
    apiClient(`/bookings/${id}`, {
      headers: authHeaders(token),
    })
  );
}

/* ============================================================
   GET BOOKINGS FOR PROPERTY
   GET /bookings/property/:propertyId
============================================================ */
export function getBookingsByPropertyId(propertyId, token) {
  return safeRequest(
    apiClient(`/bookings/property/${propertyId}`, {
      headers: authHeaders(token),
    })
  );
}

/* ============================================================
   DELETE BOOKING
   DELETE /bookings/:id
============================================================ */
export function deleteBooking(id, token) {
  return safeRequest(
    apiClient(`/bookings/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    })
  );
}

/* ============================================================
   UPDATE BOOKING
   PUT /bookings/:id
============================================================ */
export function updateBooking(id, data, token) {
  return safeRequest(
    apiClient(`/bookings/${id}`, {
      method: "PUT",
      headers: authHeaders(token),
      body: data,
    })
  );
}

/* ============================================================
   GET DISABLED DATES
   GET /bookings/disabled-dates/:propertyId
============================================================ */
export function getDisabledDates(propertyId) {
  return safeRequest(
    apiClient(`/bookings/disabled-dates/${propertyId}`)
  );
}
