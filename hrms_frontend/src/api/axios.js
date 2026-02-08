import axios from "axios";

const api = axios.create({
  baseURL: "https://hrms-lite-backend-o8u0.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
