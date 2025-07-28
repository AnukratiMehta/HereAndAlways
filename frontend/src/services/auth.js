import axios from 'axios';  // Add this import at the top

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

// Configure default axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Essential for CORS with credentials
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Rest of your file remains the same...
async function handleApiError(error) {
  let errorMessage = 'Request failed';
  let status = 500;
  
  if (error.response) {
    // Server responded with non-2xx status
    status = error.response.status;
    try {
      errorMessage = error.response.data?.message || 
                    error.response.data?.error || 
                    JSON.stringify(error.response.data);
    } catch (e) {
      errorMessage = error.response.statusText || errorMessage;
    }
  } else if (error.request) {
    // Request was made but no response received
    errorMessage = 'No response from server';
  } else {
    // Something happened in setting up the request
    errorMessage = error.message || errorMessage;
  }

  const apiError = new Error(errorMessage);
  apiError.status = status;
  throw apiError;
}

export async function signup({ name, email, password }) {
  try {
    const response = await api.post('/auth/signup', {
      name,
      email,
      password,
      role: 'LEGACY_OWNER'
    });

    console.log('Signup API Response:', response.data);

    return {
      token: response.data.token,
      id: response.data.id,
      name: response.data.name || email.split('@')[0],
      email: response.data.email,
      role: response.data.role || 'LEGACY_OWNER'
    };
  } catch (error) {
    return handleApiError(error);
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post('/auth/login', {
      email,
      password
    });

    console.log('Login API Response:', response.data);

    // Fallback to JWT data if direct fields are missing
    const jwtData = parseJwt(response.data.token);
    return {
      token: response.data.token,
      id: response.data.id || jwtData.sub,
      name: response.data.name || jwtData.name || email.split('@')[0],
      email: response.data.email || jwtData.email || email,
      role: response.data.role || jwtData.role || 'LEGACY_OWNER'
    };
  } catch (error) {
    return handleApiError(error);
  }
}

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('JWT parsing error:', e);
    return {};
  }
}

export function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

// Export the configured axios instance
export default api;