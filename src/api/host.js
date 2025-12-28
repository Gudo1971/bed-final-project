const BASE_URL = "http://localhost:3000";

/* ============================================================
   GET HOST PROPERTIES
============================================================ */
export async function getHostProperties(token) {
  const res = await fetch(`${BASE_URL}/hosts/properties`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch host properties");
  return res.json();
}

/* ============================================================
   GET HOST BOOKINGS
============================================================ */
export async function getHostBookings(token) {
  const res = await fetch(`${BASE_URL}/bookings/host/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch host bookings");
  return res.json();
}

/* ============================================================
   GET HOST REVIEWS
============================================================ */
export async function getHostReviews(token) {
  const res = await fetch(`${BASE_URL}/reviews/host/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch host reviews");
  return res.json();
}

/* ============================================================
   TOGGLE PROPERTY ACTIVE/INACTIVE
============================================================ */
export async function toggleProperty(id, isActive, token) {
  const res = await fetch(`${BASE_URL}/properties/${id}/toggle`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isActive }),
  });

  if (!res.ok) throw new Error("Toggle failed");
  return res.json();
}

/* ============================================================
   UPDATE PROPERTY (JSON — Edit Modal)
============================================================ */
export async function updateProperty(propertyId, data, token) {
  const res = await fetch(`${BASE_URL}/properties/${propertyId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update property");
  }

  return res.json();
}

/* ============================================================
   DELETE PROPERTY IMAGE
============================================================ */
export async function deletePropertyImage(propertyId, imageId, token) {
  const res = await fetch(`${BASE_URL}/properties/${propertyId}/images/${imageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete image");
  }

  return res.json();
}

/* ============================================================
   UPLOAD NEW PROPERTY IMAGES (PATCH — multipart/form-data)
============================================================ */
export async function uploadPropertyImages(propertyId, files, token) {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const res = await fetch(`${BASE_URL}/properties/${propertyId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload images");
  }

  return res.json();
}

/* ============================================================
   HOST: CONFIRM BOOKING
============================================================ */
export async function confirmBooking(id, token) {
  const res = await fetch(`${BASE_URL}/bookings/${id}/confirm`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to confirm booking");
  return res.json();
}

/* ============================================================
   HOST: REJECT BOOKING
============================================================ */
export async function rejectBooking(id, token) {
  const res = await fetch(`${BASE_URL}/bookings/${id}/reject`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to reject booking");
  return res.json();
}
