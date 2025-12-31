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
// = GET /reviews/property/:id               =
// ==============================================
export function getReviewsByPropertyId(id, token) {
  return safeRequest(
    api.get(`/reviews/property/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

// ==============================================
// = GET REVIEWS VAN INGELOGDE USER              =
// = GET /reviews/user/:userId               =
// ==============================================
export function getUserReviews(userId, token) {
  return safeRequest(
    api.get(`/reviews/user/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

// ==============================================
// = DELETE REVIEW                               =
// = DELETE /reviews/:id                     =
// ==============================================
export function deleteReview(reviewId, token) {
  return safeRequest(
    api.delete(`/reviews/${reviewId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

// ==============================================
// = UPDATE REVIEW                               =
// = PUT /reviews/:id                        =
// ==============================================
export function updateReview(reviewId, updatedData, token) {
  return safeRequest(
    api.put(`/reviews/${reviewId}`, updatedData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}
