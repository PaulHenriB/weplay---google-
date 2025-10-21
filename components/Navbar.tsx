
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { UsersIcon, CalendarIcon, UserCircleIcon, LogoutIcon, ChartBarIcon } from './icons';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-green text-white'
        : 'text-gray-300 hover:bg-brand-gray hover:text-white'
    }`;

  return (
    <nav className="bg-brand-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-white font-bold text-xl">
              WePlay
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/" end className={navLinkClass}>
                  <UsersIcon className="h-5 w-5 mr-2" />
                  Dashboard
                </NavLink>
                <NavLink to="/matches" className={navLinkClass}>
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Matches
                </NavLink>
                <NavLink to="/leaderboard" className={navLinkClass}>
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    Leaderboard
                </NavLink>
                <NavLink to="/profile" className={navLinkClass}>
                  <UserCircleIcon className="h-5 w-5 mr-2" />
                  Profile
                </NavLink>
              </div>
            </div>
          </div>
          <div className="flex items-center">
             <span className="text-gray-400 text-sm mr-4 hidden sm:block">
                Welcome, {user?.firstName} ({user?.role})
             </span>
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              <LogoutIcon className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;