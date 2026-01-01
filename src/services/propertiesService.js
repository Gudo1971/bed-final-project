// ==============================================
// = PROPERTIES API                              =
// = Ophalen van één property via ID             =
// ==============================================

import api from "../api/axios"; // <-- jouw axios instance

// ==============================================
// = GET PROPERTY BY ID                          =
// = GET /properties/:id                         =
// ==============================================
export async function getPropertyById(id) {
  const res = await api.get(`/properties/${id}`);
  return res.data;
}
