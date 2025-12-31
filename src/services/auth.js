// ==============================================
// = AUTH API                                    =
// = Login & registratie                         =
// ==============================================

import api from "../lib/api"; // <-- jouw axios instance

// ==============================================
// = LOGIN                                       =
// = POST /auth/login                            =
// ==============================================
export async function login(email, password) {
  const res = await api.post("/auth/login", {
    email,
    password,
  });

  // Token opslaan
  localStorage.setItem("token", res.data.token);

  return res.data;
}

// ==============================================
// = REGISTER USER                               =
// = POST /auth/register                         =
// ==============================================
export async function registerUser(payload) {
  const res = await api.post("/auth/register", payload);
  return res.data;
}
