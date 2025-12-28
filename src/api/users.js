// ==============================================
// = AUTH API                                    =
// = Password wijzigen                           =
// ==============================================

import api from "./axios";

// ==============================================
// = UPDATE PASSWORD                             =
// ==============================================
export function updatePassword(data) {
  return api.patch("/auth/password", data);
}
