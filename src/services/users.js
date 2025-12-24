import axios from "axios";

const API_URL = "http://localhost:3000";

export const getUsers = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getUserById = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/user/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createUser = async (payload) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API_URL}/user`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateUser = async (id, payload) => {
  const token = localStorage.getItem("token");
  const res = await axios.patch(`${API_URL}/user/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteUser = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${API_URL}/user/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
