import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from ".";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("access_token");
    const decoded = jwtDecode(token || "");
    const isExpired = decoded.exp || 0;
    const now = Date.now() / 1000;
    if (isExpired > now) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }

    const refresh = localStorage.getItem("refresh_token");

    const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
      method: "POST",
      body: JSON.stringify({ refresh: refresh }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
    if (response.status < 200 || response.status > 299) throw response;
    const data = await response.json();
    localStorage.setItem("access_token", data.access);

    config.headers.Authorization = `Bearer ${data!.access}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
