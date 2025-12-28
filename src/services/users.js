// ==============================================
// = USERS API                                   =
// = CRUD acties voor gebruikers                 =
// ==============================================

import axios from "axios";

// ==============================================
// = BASE URL                                    =
// ==============================================
const API_URL = "http://localhost:3000";

// ==============================================
// = TOKEN HELPER                                =
// ==============================================
function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ==============================================
// = GET ALL USERS                               =
// = GET /user                                   =
// ==============================================
export async function getUsers() {
  const res = await axios.get(`${API_URL}/user`, {
    headers: authHeader(),
  });
  return res.data;
}

// ==============================================
// = GET USER BY ID                              =
// = GET /user/:id                               =
// ==============================================
export async function getUserById(id) {
  const res = await axios.get(`${API_URL}/user/${id}`, {
    headers: authHeader(),
  });
  return res.data;
}

// ==============================================
// = CREATE USER                                 =
// = POST /user                                  =
// ==============================================
export async function createUser(payload) {
  const res = await axios.post(`${API_URL}/user`, payload, {
    headers: authHeader(),
  });
  return res.data;
}

// ==============================================
// = UPDATE USER                                 =
// = PATCH /user/:id                             =
// ==============================================
export async function updateUser(id, payload) {
  const res = await axios.patch(`${API_URL}/user/${id}`, payload, {
    headers: authHeader(),
  });
  return res.data;
}

// ==============================================
// = DELETE USER                                 =
// = DELETE /user/:id                            =
// ==============================================
export async function deleteUser(id) {
  const res = await axios.delete(`${API_URL}/user/${id}`, {
    headers: authHeader(),
  });
  return res.data;
}
