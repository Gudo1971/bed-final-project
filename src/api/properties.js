// ==============================================
// = PROPERTIES API                              =
// = CRUD acties voor properties                 =
// ==============================================

import api from "./axios";

// ==============================================
// = GET ALL PROPERTIES                          =
// ==============================================
export async function getAllProperties() {
  const res = await api.get("/properties");
  return res.data;
}

// ==============================================
// = GET PROPERTY BY ID                          =
// ==============================================
export async function getPropertyById(id) {
  const res = await api.get(`/properties/${id}`);
  return res.data;
}

// ==============================================
// = CREATE PROPERTY                             =
// ==============================================
export async function createProperty(data) {
  const res = await api.post("/properties", data);
  return res.data;
}
