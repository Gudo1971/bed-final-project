// ==============================================
// = AXIOS INSTANCE                              =
// = Base URL + automatische JWT injectie        =
// ==============================================

import axios from "axios";

// ==============================================
// = INSTANCE                                    =
// ==============================================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// ==============================================
// = REQUEST INTERCEPTOR                         =
// = Voeg automatisch Authorization header toe    =
// ==============================================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ==============================================
// = EXPORT                                      =
// ==============================================
export default api;
