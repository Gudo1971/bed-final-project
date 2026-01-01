// ============================================================
// = AXIOS INSTANCE                                            =
// = Automatische JWT injectie + nette errors                  =
// ============================================================

import axios from "axios";

// ============================================================
// = INSTANCE MET baseURL                                      =
// ============================================================
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
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

    return Promise.reject({
      error:
        typeof backendError === "string"
          ? backendError
          : backendError?.error
          || error.message
          || "Er ging iets mis."
    });
  }
);

// ============================================================
// = EXPORT                                                    =
// ============================================================
export default api;
