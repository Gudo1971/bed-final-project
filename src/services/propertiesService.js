// ==============================================
// = PROPERTIES API                              =
// = Ophalen van één property via ID             =
// ==============================================

import axios from "axios";

// ==============================================
// = BASE URL                                    =
// ==============================================
const API_URL = "http://localhost:3000/api";

// ==============================================
// = GET PROPERTY BY ID                          =
// = GET /properties/:id                         =
// ==============================================
export async function getPropertyById(id) {
  const res = await axios.get(`${API_URL}/properties/${id}`);
  return res.data;
}
