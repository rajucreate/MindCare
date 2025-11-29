import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ⬇️ ADD THIS HERE — after API instance created
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers["x-auth-token"] = token;
  return req;
});

// Export the API instance
export default API;
