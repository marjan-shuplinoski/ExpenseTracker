// API config for ExpenseTracker
// Loads base URL and other settings from environment variables

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiConfig = {
  baseURL: API_BASE_URL,
  // Add more config options as needed
};

export default apiConfig;
