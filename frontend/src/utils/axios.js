// axios.js - Axios instance for API requests
// This file creates a pre-configured Axios instance for use throughout the frontend application.
// It sets the base URL for the backend API and ensures credentials (cookies) are sent with requests.

import axios from 'axios';

// Create an Axios instance with default config
const instance = axios.create({
  baseURL: 'http://localhost:5000', // Backend API base URL
  withCredentials: true,            // Send cookies with requests (for authentication)
});

export default instance; // Export the instance for use in API calls
