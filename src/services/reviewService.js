// ==============================================
// = REVIEWS API                                 =
// = CRUD acties voor reviews                    =
// ==============================================

import axios from "axios";

// ==============================================
// = BASE URL                                    =
// ==============================================
const API_URL = "http://localhost:3000/api/reviews";

// ==============================================
// = TOKEN HELPER                                =
// ==============================================
function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ==============================================
// = GET REVIEWS PER PROPERTY                    =
// = GET /reviews/api/property/:id               =
// ==============================================
export async function getReviewsByPropertyId(propertyId) {
  const res = await axios.get(`${API_URL}/property/${propertyId}`);
  return res.data;
}

// ==============================================
// = GET REVIEWS VAN INGELOGDE USER              =
// = GET /reviews/api/me                         =
// ==============================================
export async function getMyReviews(token) {
  const res = await axios.get(`${API_URL}/me`, {
    headers: authHeader(token),
  });
  return res.data;
}

// ==============================================
// = CREATE REVIEW                               =
// = POST /reviews/api                           =
// ==============================================
export async function createReview(data, token) {
  const res = await axios.post(API_URL, data, {
    headers: authHeader(token),
  });
  return res.data;
}

// ==============================================
// = DELETE REVIEW                               =
// = DELETE /reviews/api/:id                     =
// ==============================================
export async function deleteReview(id, token) {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: authHeader(token),
  });
  return res.data;
}

// ==============================================
// = UPDATE REVIEW                               =
// = PUT /reviews/api/:id                        =
// ==============================================
export async function updateReview(id, data, token) {
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: authHeader(token),
  });
  return res.data;
}
