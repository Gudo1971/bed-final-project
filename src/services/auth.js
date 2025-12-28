// ==============================================
// = AUTH API                                    =
// = Login & registratie                         =
// ==============================================

import axios from "axios";

// ==============================================
// = BASE URL                                    =
// ==============================================
const API_URL = "http://localhost:3000";

// ==============================================
// = LOGIN                                       =
// = POST /auth/login                            =
// ==============================================
export async function login(email, password) {
  const res = await axios.post(`${API_URL}/auth/login`, {
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
  const res = await axios.post(`${API_URL}/auth/register`, payload);
  return res.data;
}
