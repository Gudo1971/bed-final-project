// ==============================================
// = AUTH API                                    =
// = Password wijzigen                           =
// ==============================================

import api from "./axios";

// ==============================================
// = UPDATE PASSWORD                             =
// = PATCH /api/auth/password                    =
// ==============================================
export function updatePassword(data) {
  return api.patch("/api/auth/password", data);
}

// ==============================================
// = GET USER BY ID                              
// = GET /api/users/:id                          
// ==============================================
export function getUserById(id) {
  return api.get(`/api/users/${id}`).then((res) => res.data);
}
