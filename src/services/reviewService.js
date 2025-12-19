import axios from "axios";

const API_URL = "http://localhost:3000/reviews";

// ⭐ Reviews per property
export async function getReviewsByPropertyId(propertyId) {
  const response = await axios.get(`${API_URL}/property/${propertyId}`);
  return response.data;
}

// ⭐ Reviews van ingelogde user
export async function getMyReviews(token) {
  return axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ⭐ Review aanmaken
export async function createReview(data, token) {
  return axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ⭐ Review verwijderen
export async function deleteReview(id, token) {
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export async function updateReview(id, data, token) {
  return axios.put(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
