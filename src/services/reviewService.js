// ==============================================
// = REVIEWS API                                 =
// = CRUD acties voor reviews                    =
// ==============================================

import api from "../api/axios"; // <-- jouw axios instance

// ==============================================
// = GET REVIEWS PER PROPERTY                    =
// = GET /reviews/property/:id                   =
// ==============================================
export async function getReviewsByPropertyId(propertyId) {
  const res = await api.get(`/reviews/property/${propertyId}`);
  return res.data;
}

// ==============================================
// = GET REVIEWS VAN INGELOGDE USER              =
// = GET /reviews/me                             =
// ==============================================
export async function getMyReviews() {
  const res = await api.get(`/reviews/me`);
  return res.data;
}

// ==============================================
// = CREATE REVIEW                               =
// = POST /reviews                               =
// ==============================================
export async function createReview(data) {
  const res = await api.post(`/reviews`, data);
  return res.data;
}

// ==============================================
// = DELETE REVIEW                               =
// = DELETE /reviews/:id                         =
// ==============================================
export async function deleteReview(id) {
  const res = await api.delete(`/reviews/${id}`);
  return res.data;
}

// ==============================================
// = UPDATE REVIEW                               =
// = PUT /reviews/:id                            =
// ==============================================
export async function updateReview(id, data) {
  const res = await api.put(`/reviews/${id}`, data);
  return res.data;
}
