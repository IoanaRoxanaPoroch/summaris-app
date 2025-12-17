import axios from "axios";

// Configure base URL for API from environment variable
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Generic function for GET requests
 * @param {string} endpoint - API endpoint (e.g., '/users/api')
 * @param {object} params - Query parameters (optional)
 * @param {object} config - Additional axios config (optional)
 * @returns {Promise} Axios response
 */
export const get = async (endpoint, params = null, config = {}) => {
  try {
    const response = await apiClient.get(endpoint, {
      params,
      ...config,
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Generic function for POST requests
 * @param {string} endpoint - API endpoint (e.g., '/users/api')
 * @param {object} data - Request body data
 * @param {object} config - Additional axios config (optional)
 * @returns {Promise} Axios response
 */
export const post = async (endpoint, data = {}, config = {}) => {
  try {
    const response = await apiClient.post(endpoint, data, config);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Generic function for PUT requests
 * @param {string} endpoint - API endpoint (e.g., '/users/api/123')
 * @param {object} data - Request body data
 * @param {object} config - Additional axios config (optional)
 * @returns {Promise} Axios response
 */
export const put = async (endpoint, data = {}, config = {}) => {
  try {
    const response = await apiClient.put(endpoint, data, config);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Generic function for PATCH requests
 * @param {string} endpoint - API endpoint (e.g., '/users/api/123')
 * @param {object} data - Request body data
 * @param {object} config - Additional axios config (optional)
 * @returns {Promise} Axios response
 */
export const patch = async (endpoint, data = {}, config = {}) => {
  try {
    const response = await apiClient.patch(endpoint, data, config);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Generic function for DELETE requests
 * @param {string} endpoint - API endpoint (e.g., '/users/api/123')
 * @param {object} config - Additional axios config (optional)
 * @returns {Promise} Axios response
 */
export const del = async (endpoint, config = {}) => {
  try {
    const response = await apiClient.delete(endpoint, config);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Error handler for API requests
 * @param {Error} error - Axios error object
 * @returns {Error} Formatted error object
 */
const handleError = (error) => {
  if (error.response) {
    return {
      message: error.response.data?.message || error.message,
      status: error.response.status,
      data: error.response.data,
      error: error.response.data?.error || error.message,
    };
  } else if (error.request) {
    return {
      message: "Nu există răspuns de la server",
      status: null,
      data: null,
      error: "Eroare de rețea",
    };
  } else {
    // Error setting up the request
    return {
      message: error.message,
      status: null,
      data: null,
      error: error.message,
    };
  }
};

export { apiClient };

export default {
  get,
  post,
  put,
  patch,
  delete: del,
  apiClient,
};
