import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_URL}/api/`,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;
