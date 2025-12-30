// ==============================================
// = PROPERTIES API                              =
// = CRUD acties voor properties                 =
// ==============================================

import api from "./axios";

// Helper: veilige API wrapper
async function safeRequest(promise) {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    console.error("❌ Properties API error:", err);
    throw err.response?.data || err;
  }
}

// ==============================================
// = GET ALL PROPERTIES                          =
// = GET /api/properties                         =
// ==============================================
export function getAllProperties(token) {
  return safeRequest(
    api.get("/api/properties", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

// ==============================================
// = GET PROPERTY BY ID                          =
// = GET /api/properties/:id                     =
// ==============================================
export function getPropertyById(id, token) {
  return safeRequest(
    api.get(`/api/properties/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

// ==============================================
// = CREATE PROPERTY                             =
// = POST /api/properties                        =
// ==============================================
export function createProperty(data, token) {
  return safeRequest(
    api.post("/api/properties", data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}
