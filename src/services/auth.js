import axios from "axios";

const API_URL = "http://localhost:3000";

export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const registerUser = async (payload) => {
  const res = await axios.post(`${API_URL}/auth/register`, payload);
  return res.data;
};
