const BASE_URL = "http://localhost:3000/reviews";

/* -----------------------------------------------------------
   Reviews ophalen per property
----------------------------------------------------------- */
export async function getReviewsByPropertyId(id) {
  const res = await fetch(`${BASE_URL}/property/${id}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
}

/* -----------------------------------------------------------
   Reviews ophalen van ingelogde user
----------------------------------------------------------- */
export async function getUserReviews(userId, token) {
  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user reviews");
  return res.json();
}

/* -----------------------------------------------------------
   Review verwijderen
   DELETE /reviews/:id
----------------------------------------------------------- */
export async function deleteReview(reviewId, token) {
  const res = await fetch(`${BASE_URL}/${reviewId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete review");
  return res.json();
}

/* -----------------------------------------------------------
   Review updaten
   PUT /reviews/:id
----------------------------------------------------------- */
export async function updateReview(reviewId, updatedData, token) {
  const res = await fetch(`${BASE_URL}/${reviewId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) throw new Error("Failed to update review");
  return res.json();
}
