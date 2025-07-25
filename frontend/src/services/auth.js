// src/services/auth.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

/**
 * Handles API errors consistently
 */
async function handleApiError(response) {
  if (!response.ok) {
    let errorMessage = 'Request failed';
    
    try {
      // Try to parse JSON error response first
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
    } catch (e) {
      // Fallback to text if JSON parsing fails
      const text = await response.text();
      errorMessage = text || errorMessage;
    }
    
    // Create error with status code
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }
  return response;
}

/**
 * Register a new user
 */
export async function signup({ name, email, password, role = 'LEGACY_OWNER' }) {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    await handleApiError(response);
    return await response.json();
  } catch (error) {
    // Enhance specific error messages
    if (error.message.includes('Email already in use')) {
      throw new Error('This email is already registered');
    }
    if (error.status === 400) {
      throw new Error('Invalid registration data');
    }
    throw new Error('Registration failed. Please try again later.');
  }
}

/**
 * Authenticate a user
 */
export async function login({ email, password }) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Create error with backend's message
      const error = new Error(data.message || 'Login failed');
      error.status = response.status;
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle network errors separately
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    
    // Re-throw the error with proper message
    throw error;
  }
}

/**
 * Helper to get auth headers with token
 */
export function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}