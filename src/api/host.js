// ==============================================
// = HOST API                                    =
// = Properties, bookings, reviews, actions      =
// ==============================================

import api from "./axios";

// ==============================================
// = SAFE REQUEST WRAPPER                        =
// ==============================================
async function safeRequest(promise) {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    console.error("❌ Host API error:", err);
    throw err.response?.data || err;
  }
}

/* ============================================================
   GET HOST PROPERTIES
   GET /hosts/properties
============================================================ */
export function getHostProperties(token) {
  return safeRequest(
    api.get("/hosts/properties", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

/* ============================================================
   GET HOST BOOKINGS
   GET /bookings/host/me
============================================================ */
export function getHostBookings(token) {
  return safeRequest(
    api.get("/bookings/host/me", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

/* ============================================================
   GET HOST REVIEWS
   GET /reviews/host/me
============================================================ */
export function getHostReviews(token) {
  return safeRequest(
    api.get("/reviews/host/me", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

/* ============================================================
   TOGGLE PROPERTY ACTIVE/INACTIVE
   PUT /properties/:id/toggle
============================================================ */
export function toggleProperty(id, isActive, token) {
  return safeRequest(
    api.put(
      `/properties/${id}/toggle`,
      { isActive },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    )
  );
}

/* ============================================================
   UPDATE PROPERTY (JSON — Edit Modal)
   PUT /properties/:propertyId
============================================================ */
export function updateProperty(propertyId, data, token) {
  return safeRequest(
    api.put(`/properties/${propertyId}`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

/* ============================================================
   DELETE PROPERTY IMAGE
   DELETE /properties/:propertyId/images/:imageId
============================================================ */
export function deletePropertyImage(propertyId, imageId, token) {
  return safeRequest(
    api.delete(`/properties/${propertyId}/images/${imageId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

/* ============================================================
   UPLOAD NEW PROPERTY IMAGES (PATCH — multipart/form-data)
   PATCH /properties/:propertyId
============================================================ */
export function uploadPropertyImages(propertyId, files, token) {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  return safeRequest(
    api.patch(`/properties/${propertyId}`, formData, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "multipart/form-data",
      },
    })
  );
}

/* ============================================================
   HOST: CONFIRM BOOKING
   PATCH /bookings/:id/confirm
============================================================ */
export function confirmBooking(id, token) {
  return safeRequest(
    api.patch(
      `/bookings/${id}/confirm`,
      {}, 
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    )
  );
}

/* ============================================================
   HOST: REJECT BOOKING
   PATCH /bookings/:id/reject
============================================================ */
export function rejectBooking(id, token) {
  return safeRequest(
    api.patch(
      `/bookings/${id}/reject`,
      {}, // <-- FIX: stuur een lege JSON body
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    )
  );
}

