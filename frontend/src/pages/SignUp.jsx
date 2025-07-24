import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPassword, setConfirm] = useState('');
  const [error, setError]             = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      // TODO: call your signup API here
      console.log('Signing up:', { email, password });
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[var(--color-charcoal)]">
          Create an Account
        </h2>
        {error && (
          <div className="mb-4 text-[var(--color-brandRose-dark)] text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSignup} className="space-y-4">
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
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirm(e.target.value)}
              required
              className="w-full border border-[var(--color-lightGray)] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-mint)]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--color-brandRose)] text-white font-medium py-2 rounded-lg hover:bg-[var(--color-brandRose-dark)] transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--color-charcoal)]">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--color-brandRose)] hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
