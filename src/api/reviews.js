const BASE_URL = "http://localhost:3000/reviews";

export async function getReviewsByPropertyId(id) {
  const res = await fetch(`${BASE_URL}/property/${id}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
}
