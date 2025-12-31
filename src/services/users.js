// ==============================================
// = USERS API                                   =
// = CRUD acties voor gebruikers                 =
// ==============================================

import api from "../lib/api"; // <-- jouw axios instance

// ==============================================
// = GET ALL USERS                               =
// = GET /user                                   =
// ==============================================
export async function getUsers() {
  const res = await api.get("/user");
  return res.data;
}

// ==============================================
// = GET USER BY ID                              =
// = GET /user/:id                               =
// ==============================================
export async function getUserById(id) {
  const res = await api.get(`/user/${id}`);
  return res.data;
}

// ==============================================
// = CREATE USER                                 =
// = POST /user                                  =
// ==============================================
export async function createUser(payload) {
  const res = await api.post("/user", payload);
  return res.data;
}

// ==============================================
// = UPDATE USER                                 =
// = PATCH /user/:id                             =
// ==============================================
export async function updateUser(id, payload) {
  const res = await api.patch(`/user/${id}`, payload);
  return res.data;
}

// ==============================================
// = DELETE USER                                 =
// = DELETE /user/:id                            =
// ==============================================
export async function deleteUser(id) {
  const res = await api.delete(`/user/${id}`);
  return res.data;
}
