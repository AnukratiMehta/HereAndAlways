// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const navigate                = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { token } = await login({ email, password });
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[var(--color-charcoal)]">
          Log In
        </h2>
        {error && (
          <div className="mb-4 text-[var(--color-brandRose-dark)] text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-[var(--color-lightGray)] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-mint)]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border border-[var(--color-lightGray)] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-mint)]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--color-brandRose)] text-white font-medium py-2 rounded-lg hover:bg-[var(--color-brandRose-dark)] transition"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--color-charcoal)]">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[var(--color-brandRose)] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
