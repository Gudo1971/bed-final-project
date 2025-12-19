import axios from "axios";

const API_URL = "http://localhost:3000/reviews";

/* -------------------------------------------
   GET reviews per property
------------------------------------------- */
export async function getReviewsByPropertyId(propertyId) {
  return axios.get(`${API_URL}/property/${propertyId}`);
}

/* -------------------------------------------
   GET reviews van ingelogde user
------------------------------------------- */
export async function getMyReviews(token) {
  return axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/* -------------------------------------------
   POST nieuwe review
------------------------------------------- */
export async function createReview(data, token) {
  try {
    const res = await axios.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    // Zorg dat de frontend altijd een duidelijke fout krijgt
    throw err.response?.data || { error: "Onbekende fout" };
  }
}


/* -------------------------------------------
   PUT review updaten
------------------------------------------- */
export async function updateReview(id, data, token) {
  return axios.put(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/* -------------------------------------------
   DELETE review
------------------------------------------- */
export async function deleteReview(id, token) {
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
