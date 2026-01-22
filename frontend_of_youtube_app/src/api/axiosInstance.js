import axios from 'axios';
import { store } from '../store';

// Create an axios instance with interceptor
const axiosInstance = axios.create();

// Request interceptor to add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the current state from Redux store
    const state = store.getState();
    const token = state.harmeetsYoutube.token;
    const isUserAuthenticated = state.harmeetsYoutube.isUserAuthenticated;

    // Add token to request headers if user is authenticated
    if (isUserAuthenticated && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
