// src/services/api.js
import axios from "axios";

const api = axios.create({
  // 🟢 Usamos exatamente o endereço que funcionou no seu teste direto
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
