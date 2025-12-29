// ============================================================
// = AXIOS INSTANCE                                            =
// = Base URL + automatische JWT injectie + nette errors       =
// ============================================================

import axios from "axios";

// ============================================================
// = INSTANCE                                                  =
// ============================================================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// = REQUEST INTERCEPTOR                                       =
// = Injecteer automatisch de Authorization header             =
// ============================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("❌ Axios request error:", error);
    return Promise.reject(error);
  }
);

// ============================================================
// = RESPONSE INTERCEPTOR                                      =
// = Backend errors flattenen naar 1 consistente string         =
// ============================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const backendError = error.response?.data;

    console.error("❌ Axios response error:", backendError || error);

    // ============================================================
    // = ERROR FLATTENING                                          =
    // = Altijd een string teruggeven aan AuthContext/LoginPage    =
    // ============================================================
    return Promise.reject({
      error:
        // Backend stuurt direct een string
        typeof backendError === "string"
          ? backendError
          // Backend stuurt { error: "..." }
          : backendError?.error
          // Axios zelf gooit een fout
          || error.message
          // Fallback
          || "Er ging iets mis."
    });
  }
);

// ============================================================
// = EXPORT                                                    =
// ============================================================
export default api;
