import api from "./axios";

/* ============================================================
   GET HOST PROPERTIES
   GET /hosts/properties
============================================================ */
export async function getHostProperties() {
  const res = await api.get("/hosts/properties");
  return res.data;
}

/* ============================================================
   GET HOST BOOKINGS
   GET /bookings/host/me
============================================================ */
export async function getHostBookings() {
  const res = await api.get("/bookings/host/me");
  return res.data;
}

/* ============================================================
   GET HOST REVIEWS
   GET /reviews/host/me
============================================================ */
export async function getHostReviews() {
  const res = await api.get("/reviews/host/me");
  return res.data;
}

/* ============================================================
   TOGGLE PROPERTY ACTIVE/INACTIVE
   PUT /properties/:id/toggle
============================================================ */
export async function toggleProperty(id, isActive) {
  const res = await api.put(`/properties/${id}/toggle`, { isActive });
  return res.data;
}

/* ============================================================
   UPDATE PROPERTY (JSON — Edit Modal)
   PUT /properties/:propertyId
============================================================ */
export async function updateProperty(propertyId, data) {
  const res = await api.put(`/properties/${propertyId}`, data);
  return res.data;
}

/* ============================================================
   DELETE PROPERTY IMAGE
   DELETE /properties/:propertyId/images/:imageId
============================================================ */
export async function deletePropertyImage(propertyId, imageId) {
  const res = await api.delete(
    `/properties/${propertyId}/images/${imageId}`
  );
  return res.data;
}

/* ============================================================
   UPLOAD NEW PROPERTY IMAGES (PATCH — multipart/form-data)
   PATCH /properties/:propertyId
============================================================ */
export async function uploadPropertyImages(propertyId, files) {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const res = await api.patch(`/properties/${propertyId}`, formData);
  return res.data;
}

/* ============================================================
   HOST: CONFIRM BOOKING
   PATCH /bookings/:id/confirm
============================================================ */
export async function confirmBooking(id) {
  const res = await api.patch(`/bookings/${id}/confirm`);
  return res.data;
}

/* ============================================================
   HOST: REJECT BOOKING
   PATCH /bookings/:id/reject
============================================================ */
export async function rejectBooking(id) {
  const res = await api.patch(`/bookings/${id}/reject`);
  return res.data;
}
