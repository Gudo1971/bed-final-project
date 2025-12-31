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
// = GET /properties                         =
// ==============================================
export function getAllProperties(token) {
  return safeRequest(
    api.get("/properties", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

// ==============================================
// = GET PROPERTY BY ID                          =
// = GET /properties/:id                     =
// ==============================================
export function getPropertyById(id, token) {
  return safeRequest(
    api.get(`/properties/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}

// ==============================================
// = CREATE PROPERTY                             =
// = POST /properties                        =
// ==============================================
export function createProperty(data, token) {
  return safeRequest(
    api.post("/properties", data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  );
}
