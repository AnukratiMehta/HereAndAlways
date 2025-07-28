import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

async function handleApiError(error) {
  console.error('API Error:', {
    config: error.config,
    response: error.response,
    request: error.request,
    message: error.message
  });

  let errorMessage = 'Request failed';
  let status = 500;

  if (error.response) {
    status = error.response.status;
    errorMessage = error.response.data?.message || 
                  error.response.data?.error || 
                  error.response.statusText || 
                  'Request failed';
    
    if (error.response.data?.errors) {
      errorMessage = Object.values(error.response.data.errors).join(', ');
    }
  } else if (error.request) {
    errorMessage = 'No response from server';
  } else {
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
      password
    });

    return {
      token: response.data.token,
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role
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

    return {
      token: response.data.token,
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role
    };
  } catch (error) {
    return handleApiError(error);
  }
}

export default api;