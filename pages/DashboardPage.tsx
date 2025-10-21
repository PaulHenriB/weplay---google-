
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Match, Role } from '../types';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { PlusCircleIcon } from '../components/icons';
import MatchCard from '../components/MatchCard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      const allMatches = await api.getMatches();
      const upcoming = allMatches.filter(m => new Date(m.date) > new Date());
      setUpcomingMatches(upcoming);
      setLoading(false);
    };
    fetchMatches();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {user?.role === Role.MANAGER && (
          <Link to="/matches" state={{ openCreateModal: true }} className="flex items-center bg-brand-green hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
            <PlusCircleIcon className="h-6 w-6 mr-2" />
            Create Match
          </Link>
        )}
      </div>
      
      <div className="bg-brand-gray p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-2">Welcome back, {user?.firstName}!</h2>
        <p className="text-gray-400">Here's your next upcoming match. Check the matches page for more.</p>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4">Next Match</h3>
        {upcomingMatches.length > 0 ? (
          <MatchCard match={upcomingMatches[0]} />
        ) : (
          <div className="bg-brand-gray p-6 rounded-lg text-center">
            <p className="text-gray-400">No upcoming matches scheduled.</p>
            {user?.role === Role.MANAGER && <p className="text-gray-400 mt-2">Why not create one?</p>}
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardPage;
