const BASE_URL = "http://localhost:3000/reviews";

export async function getReviewsByPropertyId(id) {
  const res = await fetch(`${BASE_URL}/property/${id}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
}

export async function getUserReviews(userId, token) {
  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Failed to fetch user reviews");
  return res.json();
}
