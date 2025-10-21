
import React, { useState } from 'react';
import { api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dob: '',
    favoriteFoot: 'right' as 'left' | 'right' | 'both',
    favoritePosition: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.signup(formData);
      // Automatically log in the user after successful signup
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError('Failed to sign up. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-lg p-8 space-y-8 bg-brand-gray rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-white">
            Create your WePlay account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="firstName" type="text" required className="input-style" placeholder="First Name" onChange={handleChange} />
              <input name="lastName" type="text" required className="input-style" placeholder="Last Name" onChange={handleChange} />
              <input name="email" type="email" required className="input-style md:col-span-2" placeholder="Email Address" onChange={handleChange} />
              <input name="password" type="password" required className="input-style md:col-span-2" placeholder="Password" onChange={handleChange} />
              <input name="dob" type="date" required className="input-style" placeholder="Date of Birth" onChange={handleChange} />
              <input name="favoritePosition" type="text" required className="input-style" placeholder="Favorite Position" onChange={handleChange} />
              <select name="favoriteFoot" value={formData.favoriteFoot} className="input-style md:col-span-2" onChange={handleChange}>
                  <option value="right">Right</option>
                  <option value="left">Left</option>
                  <option value="both">Both</option>
              </select>
          </div>
          <style>{`.input-style { appearance: none; position: relative; display: block; width: 100%; padding: 0.75rem; border: 1px solid #4B5563; background-color: #111827; placeholder-color: #6B7280; color: white; border-radius: 0.375rem; }`}</style>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-green"
            >
              Sign up
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-green hover:text-green-400">
              Log in
            </Link>
          </p>
      </div>
    </div>
  );
};

export default SignupPage;
