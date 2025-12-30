// ==============================================
// = REVIEWS API                                 =
// = CRUD acties voor reviews                    =
// ==============================================

import api from "./axios";

// Helper: veilige API wrapper
async function safeRequest(promise) {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    console.error("❌ Reviews API error:", err);
    throw err.response?.data || err;
  }
}

// ==============================================
// = GET REVIEWS PER PROPERTY                    =
// = GET /api/reviews/property/:id               =
// ==============================================
export function getReviewsByPropertyId(id, token) {
  return safeRequest(
    api.get(`/api/reviews/property/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

// ==============================================
// = GET REVIEWS VAN INGELOGDE USER              =
// = GET /api/reviews/user/:userId               =
// ==============================================
export function getUserReviews(userId, token) {
  return safeRequest(
    api.get(`/api/reviews/user/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

// ==============================================
// = DELETE REVIEW                               =
// = DELETE /api/reviews/:id                     =
// ==============================================
export function deleteReview(reviewId, token) {
  return safeRequest(
    api.delete(`/api/reviews/${reviewId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

// ==============================================
// = UPDATE REVIEW                               =
// = PUT /api/reviews/:id                        =
// ==============================================
export function updateReview(reviewId, updatedData, token) {
  return safeRequest(
    api.put(`/api/reviews/${reviewId}`, updatedData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}
