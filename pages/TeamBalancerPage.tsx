
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Match, Player } from '../types';
import { api } from '../services/api';

const PlayerCard: React.FC<{ player: Player }> = ({ player }) => (
    <div className="bg-brand-light-gray p-3 rounded-md flex justify-between items-center">
        <span>{player.firstName} {player.lastName}</span>
        <span className="font-bold text-brand-green">{player.averageRating.toFixed(1)}</span>
    </div>
);

const TeamBalancerPage: React.FC = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [teamA, setTeamA] = useState<Player[]>([]);
  const [teamB, setTeamB] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [balancing, setBalancing] = useState(false);

  const fetchMatch = useCallback(async () => {
    if (matchId) {
      setLoading(true);
      const matchData = await api.getMatchById(Number(matchId));
      if (matchData) {
        setMatch(matchData);
        setTeamA(matchData.teamA || []);
        setTeamB(matchData.teamB || []);
      }
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);
  
  const handleBalanceTeams = async () => {
    if(matchId) {
        setBalancing(true);
        const { teamA, teamB } = await api.balanceTeams(Number(matchId));
        setTeamA(teamA);
        setTeamB(teamB);
        setBalancing(false);
    }
  };

  if (loading) return <p>Loading team balancer...</p>;
  if (!match) return <p>Match not found.</p>;

  const teamARating = teamA.reduce((sum, p) => sum + p.averageRating, 0);
  const teamBRating = teamB.reduce((sum, p) => sum + p.averageRating, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Team Balancer</h1>
      <p className="text-gray-400 mb-6">For match on {new Date(match.date).toLocaleDateString()} at {match.location}</p>

      <div className="bg-brand-gray p-6 rounded-lg shadow-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
                <h2 className="text-xl font-semibold">Available Players ({match.availablePlayers.length})</h2>
                <p className="text-sm text-gray-400">Players who have marked themselves as available.</p>
            </div>
            <button
                onClick={handleBalanceTeams}
                disabled={balancing}
                className="mt-4 md:mt-0 bg-brand-green hover:bg-green-600 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                {balancing ? 'Balancing...' : 'Balance Teams'}
            </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-brand-gray p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-baseline mb-4">
            <h3 className="text-2xl font-bold text-blue-400">Team A</h3>
            <span className="text-lg font-semibold">Avg Rating: {(teamARating / (teamA.length || 1)).toFixed(2)}</span>
          </div>
          <div className="space-y-3">
            {teamA.length > 0 ? teamA.map(p => <PlayerCard key={p.id} player={p} />) : <p className="text-gray-400">No players yet.</p>}
          </div>
        </div>
        <div className="bg-brand-gray p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-baseline mb-4">
            <h3 className="text-2xl font-bold text-red-400">Team B</h3>
             <span className="text-lg font-semibold">Avg Rating: {(teamBRating / (teamB.length || 1)).toFixed(2)}</span>
          </div>
          <div className="space-y-3">
            {teamB.length > 0 ? teamB.map(p => <PlayerCard key={p.id} player={p} />) : <p className="text-gray-400">No players yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamBalancerPage;
