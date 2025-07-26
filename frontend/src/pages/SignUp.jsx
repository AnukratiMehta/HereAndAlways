import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

const handleSignup = async (e) => {
  e.preventDefault();
  setError(null);

  if (password !== confirmPassword) {
    setError('Passwords do not match');
    return;
  }
  if (password.length < 8) {
    setError('Password must be at least 8 characters');
    return;
  }

  setIsLoading(true);
  try {
    const { token, name, email, role, id } = await signup({ name, email, password }); 
    console.log('API Response:', { token, name, email, role, id });
    auth.login({ token, name, email, role, id }); 
    navigate('/dashboard');
  } catch (err) {
    if (err.message.includes('Email already in use')) {
      setError('This email is already registered');
    } else if (err.message.includes('Invalid email')) {
      setError('Please enter a valid email address');
    } else {
      setError('Registration failed. Please try again.');
    }
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[var(--color-charcoal)]">Create Your Account</h2>
          <p className="text-[var(--color-gray)] mt-2">Join our community today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">Full Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 border border-[var(--color-lightGray)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-mint)] focus:border-transparent" placeholder="John Doe" />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">Email Address</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-[var(--color-lightGray)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-mint)] focus:border-transparent" placeholder="you@example.com" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">Password (min 8 characters)</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="8" className="w-full px-4 py-3 border border-[var(--color-lightGray)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-mint)] focus:border-transparent" placeholder="••••••••" />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-charcoal)] mb-2">Confirm Password</label>
            <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirm(e.target.value)} required minLength="8" className="w-full px-4 py-3 border border-[var(--color-lightGray)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-mint)] focus:border-transparent" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={isLoading} className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${isLoading ? 'bg-[var(--color-brandRose-light)] cursor-not-allowed' : 'bg-[var(--color-brandRose)] hover:bg-[var(--color-brandRose-dark)]'}`}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[var(--color-gray)]">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[var(--color-brandRose)] hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
