import axios from "axios";

const FALLBACK_API_URL = "http://localhost:5000/api";
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

const api = axios.create({
  baseURL: configuredApiUrl || FALLBACK_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("parentToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const fallbackMessage = "Something went wrong. Please try again.";
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      fallbackMessage;

    const normalizedError = new Error(message);
    normalizedError.status = error?.response?.status || 0;
    normalizedError.raw = error;
    return Promise.reject(normalizedError);
  }
);

if (!configuredApiUrl) {
  // Helps diagnose misconfigured deployments while remaining backward compatible.
  console.warn(
    `[parent-api] VITE_API_URL is not set. Falling back to ${FALLBACK_API_URL}.`
  );
}

// Auth API calls
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);

// Progress API calls
export const saveProgress = (data) => api.post("/progress/save", data);
export const getProgress = (childId) => api.get(`/progress/${childId}`);
export const getStats = (childId) => api.get(`/progress/stats/${childId}`);
export const getAnalytics = (childId) => api.get(`/progress/analytics/${childId}`);

// Parent API calls
export const getChildren = () => api.get("/auth/children");

// Screen time API calls
export const setScreenTimeLimit = (data) => api.post("/screentime/set-limit", data);
export const getScreenTimeStatus = (childId) => api.get(`/screentime/status/${childId}`);
export const updateScreenTimeUsage = (data) => api.post("/screentime/update-usage", data);
export const toggleScreenTimeLock = (data) => api.post("/screentime/toggle-lock", data);

// AI / Learning Engine API calls
export const getAIAnalysis = (childId) => api.get(`/ai/analysis/${childId}`);
export const getAIRecommendation = (childId) => api.get(`/ai/recommendation/${childId}`);

// Custom test API calls
export const createTest = (data) => api.post("/test/create", data);
export const getTestsForChild = (childId) => api.get(`/test/${childId}`);
export const submitTest = (data) => api.post("/test/submit", data);

export default api;
