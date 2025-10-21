
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-brand-gray rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-white">
            Welcome back to WePlay
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Log in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-brand-dark placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-brand-green focus:border-brand-green focus:z-10 sm:text-sm"
                placeholder="Email address (e.g., manager@weplay.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-brand-dark placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-brand-green focus:border-brand-green focus:z-10 sm:text-sm"
                placeholder="Password (any password works)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-green"
            >
              Sign in
            </button>
          </div>
        </form>
         <p className="mt-2 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-brand-green hover:text-green-400">
              Sign up
            </Link>
          </p>
      </div>
    </div>
  );
};

export default LoginPage;
