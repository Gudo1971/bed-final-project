// ==============================================
// = GET REVIEWS PER PROPERTY                    =
// = GET /reviews/property/:propertyId           =
// ==============================================

import axios from "axios";

export async function getReviewsByPropertyId(propertyId) {
  const res = await axios.get(
    `http://localhost:3000/reviews/property/${propertyId}`
  );
  return res.data;
}
