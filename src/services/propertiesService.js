import axios from "axios";

const API_URL = "http://localhost:3000/api";

export async function getPropertyById(id) {
  const response = await axios.get(`${API_URL}/properties/${id}`);
  return response.data;
}