import axios from "axios";

// Get API URL from environment variable or use default
let API_URL = import.meta.env.VITE_API_URL;

// Ensure URL has proper protocol
if (API_URL && !API_URL.startsWith('http')) {
  API_URL = 'https://' + API_URL;
} else if (!API_URL) {
  API_URL = "http://localhost:5000";
}

console.log("API URL configured as:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => response,
  error => {
    console.log("API Error:", error.message);
    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
