// ==============================================
// = AUTH API                                    =
// = Password wijzigen                           =
// ==============================================

import api from "./axios";

// ==============================================
// = UPDATE PASSWORD                             =
// = PATCH /auth/password                    =
// ==============================================
export function updatePassword(data) {
  return api.patch("/auth/password", data);
}

// ==============================================
// = GET USER BY ID                              
// = GET /users/:id                          
// ==============================================
export function getUserById(id) {
  return api.get(`/users/${id}`).then((res) => res.data);
}
