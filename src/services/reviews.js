// ==============================================
// = GET REVIEWS PER PROPERTY                    =
// = GET /reviews/property/:propertyId           =
// ==============================================

import api from "../api/axios"; // <-- jouw axios instance

export async function getReviewsByPropertyId(propertyId) {
  const res = await api.get(`/reviews/property/${propertyId}`);
  return res.data;
}
