
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Player } from '../types';
import { useAuth } from '../context/AuthContext';

const LeaderboardPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      const allPlayers = await api.getPlayers();
      // Sort players by average rating in descending order
      const sortedPlayers = allPlayers.sort((a, b) => b.averageRating - a.averageRating);
      setPlayers(sortedPlayers);
      setLoading(false);
    };
    fetchPlayers();
  }, []);

  if (loading) return <p className="text-center">Loading leaderboard...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <div className="bg-brand-gray rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-brand-light-gray/50">
              <tr>
                <th className="p-4 text-sm font-semibold uppercase text-gray-400 w-16 text-center">Rank</th>
                <th className="p-4 text-sm font-semibold uppercase text-gray-400">Player</th>
                <th className="p-4 text-sm font-semibold uppercase text-gray-400 hidden md:table-cell">Position</th>
                <th className="p-4 text-sm font-semibold uppercase text-gray-400 text-right">Rating</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr 
                  key={player.id} 
                  className={`border-t border-brand-light-gray/20 ${player.id === user?.id ? 'bg-brand-green/20' : ''}`}
                >
                  <td className="p-4 font-bold text-lg text-center">{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-brand-light-gray flex items-center justify-center text-lg font-bold text-white mr-4 flex-shrink-0">
                        {player.firstName[0]}{player.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold">{player.firstName} {player.lastName}</p>
                        <p className="text-gray-400 text-sm md:hidden">{player.favoritePosition}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300 hidden md:table-cell">{player.favoritePosition}</td>
                  <td className="p-4 text-right font-bold text-xl text-brand-green">{player.averageRating.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
