import { apiClient } from "./apiClient";

const BASE_URL = "http://localhost:3000/api";

/* ============================================================
   CREATE BOOKING
============================================================ */
export async function createBooking(data, token) {
  return apiClient(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
}

/* ============================================================
   GET USER BOOKINGS
============================================================ */
export async function getUserBookings(userId, token) {
  return apiClient(`${BASE_URL}/bookings/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/* ============================================================
   GET BOOKING BY ID
============================================================ */
export async function getBookingById(id, token) {
  return apiClient(`${BASE_URL}/bookings/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/* ============================================================
   GET BOOKINGS FOR PROPERTY
============================================================ */
export async function getBookingsByPropertyId(propertyId, token) {
  return apiClient(`${BASE_URL}/bookings/property/${propertyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/* ============================================================
   DELETE BOOKING
============================================================ */
export async function deleteBooking(id, token) {
  return apiClient(`${BASE_URL}/bookings/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/* ============================================================
   UPDATE BOOKING
============================================================ */
export async function updateBooking(id, data, token) {
  return apiClient(`${BASE_URL}/bookings/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
}

/*============================================================
  GET DISABLED DATES
============================================================== */
export async function getDisabledDates(propertyId) {
  return apiClient(`${BASE_URL}/bookings/disabled-dates/${propertyId}`);
}
