import axios from "axios";
import axiosRetry from "axios-retry";

// Create the global Axios instance 
const axiosClient = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Replicating dio_smart_retry (3 retries with custom delays)
axiosRetry(axiosClient, {
  retries: 3,
  retryDelay: (retryCount) => {
    // 3 seconds for first, 2 seconds for subsequent 
    return retryCount === 1 ? 3000 : 2000;
  }
});

// Request Interceptor: Attach dynamic BaseURL and Bearer Token
axiosClient.interceptors.request.use(
  (config) => {
    // Import useAuthStore inside the interceptor to avoid circular dependency
    const { useAuthStore } = require("../store/useAuthStore");
    const state = useAuthStore.getState();

    const baseURL = state.baseURL;
    if (baseURL) {
      config.baseURL = baseURL;
    }

    const token = state.authToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Basic error handling
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { useAuthStore } = require("../store/useAuthStore");

    // Handle Unauthorized (401)
    if (error?.response?.status === 401) {
      // Automatic local cleanup if token is rejected
      // We don't call the API signOut because the token is already invalid
      useAuthStore.getState().clearAuthData();
    } else {
      // Only log actual field errors or unexpected crashes
      console.error("API Error: ", error?.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
