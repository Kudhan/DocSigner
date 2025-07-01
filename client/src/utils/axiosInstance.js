import axios from "axios";

// ✅ Check that env variable exists or fallback to localhost
const baseURL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000/api";

// Optional: console log to debug during development
// console.log("Axios Base URL:", baseURL);

const axiosInstance = axios.create({
  baseURL,
});

// ✅ Attach token to every request if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
