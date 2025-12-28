import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

import api from "../services/api";

//login example
const login = async () => {
  const res = await api.post("/auth/login", {
    email,
    password
  });

  localStorage.setItem("token", res.data.token);
};

//Fetch user Return
const res1 = await api.get("/returns/me");
console.log(res1.data);cd 

const res = await api.get("/dashboard/stats");
