import axios from 'axios';

// Set up the base connection endpoint pointing directly to your local FastAPI server
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Create an Axios instance to centralize authentication headers
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically inject JWT token into requests if available in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- AUTHENTICATION SERVICES ---

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data?.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Incorrect credentials or login failure.');
  }
};

export const signupUser = async (email, password) => {
  try {
    const response = await api.post('/auth/signup', { email, password });
    if (response.data?.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Email is already registered or registration failed.');
  }
};

export const logoutUser = () => {
  localStorage.removeItem('auth_token');
};

export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    // If getting profile fails, token is likely expired or invalid, so wipe it
    localStorage.removeItem('auth_token');
    throw new Error(error.response?.data?.detail || 'Session expired.');
  }
};

// --- ANALYSIS SERVICES ---

export const analyzeResume = async (file, jobDescription, targetCompany) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jobDescription);
    formData.append('target_company', targetCompany);

    const response = await api.post('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error hitting the analysis endpoint wrapper:', error);
    throw new Error(
      error.response?.data?.detail || 
      'Failed to communicate with the backend AI engine. Make sure your server is online.'
    );
  }
};

// --- HISTORY SERVICES ---

export const getHistory = async () => {
  try {
    const response = await api.get('/history');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to retrieve history.');
  }
};

export const getHistoryDetail = async (id) => {
  try {
    const response = await api.get(`/history/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to retrieve analysis details.');
  }
};

export const deleteHistoryItem = async (id) => {
  try {
    const response = await api.delete(`/history/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to delete history item.');
  }
};