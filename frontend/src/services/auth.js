const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

async function handleApiError(response) {
  if (!response.ok) {
    let errorMessage = 'Request failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
    } catch (e) {
      errorMessage = await response.text() || errorMessage;
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }
  return response;
}

export async function signup({ name, email, password }) {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role: 'LEGACY_OWNER' })
    });

    const data = await response.json();
    await handleApiError(response);

    console.log('Signup API Response:', data); // Debug log

    return {
      token: data.token,
      id: data.id,
      name: data.name || email.split('@')[0], // Fallback to email prefix
      email: data.email,
      role: data.role || 'LEGACY_OWNER' // Default role
    };
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

export async function login({ email, password }) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log('Login API Response:', data); // Debug log

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Fallback to JWT data if direct fields are missing
    const jwtData = parseJwt(data.token);
    return {
      token: data.token,
      id: data.id || jwtData.sub,
      name: data.name || jwtData.name || email.split('@')[0],
      email: data.email || jwtData.email || email,
      role: data.role || jwtData.role || 'LEGACY_OWNER'
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
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