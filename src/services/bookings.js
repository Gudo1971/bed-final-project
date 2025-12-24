import axios from "axios";

const API_URL = "http://localhost:3000";

export const getBookings = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/bookings`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getBookingById = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/bookings/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createBooking = async (payload) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API_URL}/bookings`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateBooking = async (id, payload) => {
  const token = localStorage.getItem("token");
  const res = await axios.patch(`${API_URL}/bookings/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteBooking = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${API_URL}/bookings/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
