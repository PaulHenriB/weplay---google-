
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Match, MatchStatus } from '../types';
import { api } from '../services/api';
import MatchCard from '../components/MatchCard';
import CreateMatchModal from '../components/CreateMatchModal';
import { useAuth } from '../context/AuthContext';
import { PlusCircleIcon } from '../components/icons';

const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (location.state?.openCreateModal) {
      setShowCreateModal(true);
    }
    fetchMatches();
  }, [location.state]);

  const fetchMatches = async () => {
    setLoading(true);
    const allMatches = await api.getMatches();
    setMatches(allMatches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setLoading(false);
  };
  
  const handleMatchCreated = (newMatch: Match) => {
    setMatches(prev => [newMatch, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    fetchMatches();
  };

  const upcomingMatches = matches.filter(m => m.status === MatchStatus.UPCOMING);
  const completedMatches = matches.filter(m => m.status === MatchStatus.COMPLETED);

  if (loading) return <p className="text-center">Loading matches...</p>;

  return (
    <div>
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Matches</h1>
        {user?.role === 'manager' && (
          <button onClick={() => setShowCreateModal(true)} className="flex items-center bg-brand-green hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
            <PlusCircleIcon className="h-6 w-6 mr-2"/>
            Create New Match
          </button>
        )}
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold border-b-2 border-brand-green pb-2 mb-4">Upcoming Matches</h2>
          {upcomingMatches.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingMatches.map(match => <MatchCard key={match.id} match={match} onUpdate={fetchMatches}/>)}
            </div>
          ) : <p className="text-gray-400">No upcoming matches.</p>}
        </div>

        <div>
          <h2 className="text-2xl font-semibold border-b-2 border-brand-green pb-2 mb-4">Completed Matches</h2>
          {completedMatches.length > 0 ? (
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {completedMatches.map(match => <MatchCard key={match.id} match={match} onUpdate={fetchMatches}/>)}
            </div>
          ) : <p className="text-gray-400">No completed matches yet.</p>}
        </div>
      </div>

      {showCreateModal && <CreateMatchModal onClose={() => setShowCreateModal(false)} onMatchCreated={handleMatchCreated}/>}
    </div>
  );
};

export default MatchesPage;
