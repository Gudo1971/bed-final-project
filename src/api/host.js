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
   GET /api/hosts/properties
============================================================ */
export function getHostProperties(token) {
  return safeRequest(
    api.get("/api/hosts/properties", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

/* ============================================================
   GET HOST BOOKINGS
   GET /api/bookings/host/me
============================================================ */
export function getHostBookings(token) {
  return safeRequest(
    api.get("/api/bookings/host/me", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

/* ============================================================
   GET HOST REVIEWS
   GET /api/reviews/host/me
============================================================ */
export function getHostReviews(token) {
  return safeRequest(
    api.get("/api/reviews/host/me", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

/* ============================================================
   TOGGLE PROPERTY ACTIVE/INACTIVE
   PUT /api/properties/:id/toggle
============================================================ */
export function toggleProperty(id, isActive, token) {
  return safeRequest(
    api.put(
      `/api/properties/${id}/toggle`,
      { isActive },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    )
  );
}

/* ============================================================
   UPDATE PROPERTY (JSON — Edit Modal)
   PUT /api/properties/:propertyId
============================================================ */
export function updateProperty(propertyId, data, token) {
  return safeRequest(
    api.put(`/api/properties/${propertyId}`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

/* ============================================================
   DELETE PROPERTY IMAGE
   DELETE /api/properties/:propertyId/images/:imageId
============================================================ */
export function deletePropertyImage(propertyId, imageId, token) {
  return safeRequest(
    api.delete(`/api/properties/${propertyId}/images/${imageId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

/* ============================================================
   UPLOAD NEW PROPERTY IMAGES (PATCH — multipart/form-data)
   PATCH /api/properties/:propertyId
============================================================ */
export function uploadPropertyImages(propertyId, files, token) {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  return safeRequest(
    api.patch(`/api/properties/${propertyId}`, formData, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "multipart/form-data",
      },
    })
  );
}

/* ============================================================
   HOST: CONFIRM BOOKING
   PATCH /api/bookings/:id/confirm
============================================================ */
export function confirmBooking(id, token) {
  return safeRequest(
    api.patch(
      `/api/bookings/${id}/confirm`,
      {},
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    )
  );
}

/* ============================================================
   HOST: REJECT BOOKING
   PATCH /api/bookings/:id/reject
============================================================ */
export function rejectBooking(id, token) {
  return safeRequest(
    api.patch(
      `/api/bookings/${id}/reject`,
      {},
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    )
  );
}
