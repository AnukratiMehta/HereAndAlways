// src/services/auth.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

export async function signup({ name, email, password, role = 'LEGACY_OWNER' }) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Signup failed');
  }

  return res.json(); // { token }
}

export async function login({ email, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Login failed');
  }

  return res.json(); // { token }
}
