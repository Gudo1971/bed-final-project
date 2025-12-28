// ==============================================
// = REVIEWS API                                 =
// = CRUD acties voor reviews                    =
// ==============================================

import api from "./axios";

// ==============================================
// = GET REVIEWS PER PROPERTY                    =
// = GET /reviews/property/:id                   =
// ==============================================
export async function getReviewsByPropertyId(id) {
  const res = await api.get(`/reviews/property/${id}`);
  return res.data;
}

// ==============================================
// = GET REVIEWS VAN INGELOGDE USER              =
// = GET /reviews/user/:userId                   =
// ==============================================
export async function getUserReviews(userId) {
  const res = await api.get(`/reviews/user/${userId}`);
  return res.data;
}

// ==============================================
// = DELETE REVIEW                               =
// = DELETE /reviews/:id                         =
// ==============================================
export async function deleteReview(reviewId) {
  const res = await api.delete(`/reviews/${reviewId}`);
  return res.data;
}

// ==============================================
// = UPDATE REVIEW                               =
// = PUT /reviews/:id                            =
// ==============================================
export async function updateReview(reviewId, updatedData) {
  const res = await api.put(`/reviews/${reviewId}`, updatedData);
  return res.data;
}
