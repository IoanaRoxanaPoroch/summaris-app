import axios from "axios";

// Configure base URL for API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// User API functions
export const userAPI = {
  // Create a new user
  async createUser(userData) {
    try {
      const response = await api.post("/users/api", {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user by ID
  async getUserById(userId) {
    try {
      const response = await api.get(`/users/api/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all users
  async getAllUsers() {
    try {
      const response = await api.get("/users/api");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user by email
  async getUserByEmail(email) {
    try {
      const response = await api.get(`/users/api/email?email=${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      // Dacă utilizatorul nu există, returnează null în loc să arunce eroare
      if (error.response?.status === 404) {
        return null;
      }
      throw error.response?.data || error.message;
    }
  },
};

export default api;

