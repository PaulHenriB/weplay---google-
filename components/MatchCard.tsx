
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Match, MatchStatus, Player, Role, Rating } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ChevronRightIcon } from './icons';

interface MatchCardProps {
    match: Match;
    onUpdate?: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onUpdate }) => {
    const { user } = useAuth();
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [result, setResult] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);

    useEffect(() => {
        if(user && match.status === MatchStatus.UPCOMING) {
            api.getPlayerAvailabilityForMatch(user.id, match.id).then(setIsAvailable);
        }
    }, [user, match]);

    const handleAvailabilityChange = async (available: boolean) => {
        if(!user) return;
        setIsAvailable(available);
        await api.setPlayerAvailability(user.id, match.id, available);
        onUpdate?.();
    };

    const handleRecordResult = async (e: React.FormEvent) => {
        e.preventDefault();
        await api.recordMatchResult(match.id, result);
        setIsRecording(false);
        onUpdate?.();
    }

    const isManager = user?.role === Role.MANAGER;
    const isUpcoming = match.status === MatchStatus.UPCOMING;

    return (
        <div className="bg-brand-gray rounded-lg shadow-lg overflow-hidden flex flex-col">
            <div className="p-6 flex-grow">
                <p className="text-sm text-gray-400">{new Date(match.date).toLocaleString()}</p>
                <h3 className="text-xl font-bold mt-1">{match.location}</h3>
                {match.status === MatchStatus.COMPLETED && (
                    <p className="text-2xl font-bold text-brand-green my-2">Result: {match.result}</p>
                )}
            </div>
            <div className="p-6 bg-brand-light-gray/50 space-y-4">
                {isUpcoming && user?.role === Role.PLAYER && (
                    <div className="flex space-x-2">
                        <button onClick={() => handleAvailabilityChange(true)} disabled={isAvailable === true} className="flex-1 bg-green-600 text-white py-2 px-4 rounded disabled:bg-green-800 disabled:text-gray-400 transition">Available</button>
                        <button onClick={() => handleAvailabilityChange(false)} disabled={isAvailable === false} className="flex-1 bg-red-600 text-white py-2 px-4 rounded disabled:bg-red-800 disabled:text-gray-400 transition">Unavailable</button>
                    </div>
                )}
                {isUpcoming && isManager && !isRecording && (
                    <div className="flex space-x-2">
                         <Link to={`/team-balancer/${match.id}`} className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">Balance Teams</Link>
                         <button onClick={() => setIsRecording(true)} className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded transition">Record Result</button>
                    </div>
                )}
                {isUpcoming && isManager && isRecording && (
                    <form onSubmit={handleRecordResult} className="flex space-x-2">
                        <input type="text" value={result} onChange={(e) => setResult(e.target.value)} placeholder="e.g., 3-1" className="flex-1 bg-brand-dark border border-gray-600 rounded px-2 py-1 text-white" required />
                        <button type="submit" className="bg-brand-green hover:bg-green-600 text-white py-2 px-4 rounded">Save</button>
                    </form>
                )}
                {match.status === MatchStatus.COMPLETED && user?.role === Role.PLAYER && (
                    <button onClick={() => setShowRatingModal(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors flex justify-center items-center">
                        Rate Players <ChevronRightIcon className="h-5 w-5 ml-2" />
                    </button>
                )}
            </div>
            {showRatingModal && <RatingModal match={match} onClose={() => setShowRatingModal(false)} />}
        </div>
    );
};


const RatingModal: React.FC<{ match: Match; onClose: () => void }> = ({ match, onClose }) => {
    const { user } = useAuth();
    const [ratings, setRatings] = useState<{ [playerId: number]: number }>({});
    const [submittedRatings, setSubmittedRatings] = useState<number[]>([]);

    useEffect(() => {
        const fetchRatings = async () => {
            const existing = await api.getRatingsForMatch(match.id);
            const userSubmitted = existing.filter(r => r.raterId === user?.id).map(r => r.playerId);
            setSubmittedRatings(userSubmitted);
        };
        fetchRatings();
    }, [match.id, user?.id]);


    const handleRatingChange = (playerId: number, score: number) => {
        setRatings(prev => ({ ...prev, [playerId]: score }));
    };

    const handleSubmitRating = async (playerId: number) => {
        if (!user || !ratings[playerId]) return;
        try {
            await api.submitRating(user.id, playerId, match.id, ratings[playerId]);
            setSubmittedRatings(prev => [...prev, playerId]);
        } catch (error) {
            alert((error as Error).message);
        }
    };
    
    // Players can only rate opponents
    const myTeam = match.teamA.some(p => p.id === user?.id) ? match.teamA : match.teamB;
    const opponentTeam = match.teamA.some(p => p.id === user?.id) ? match.teamB : match.teamA;
    const rateablePlayers = opponentTeam.filter(p => p.id !== user?.id);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-brand-gray rounded-lg shadow-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Rate Opponents for Match</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {rateablePlayers.map(player => (
                        <div key={player.id} className="flex justify-between items-center bg-brand-dark p-3 rounded">
                            <span>{player.firstName} {player.lastName}</span>
                            {submittedRatings.includes(player.id) ? (
                                <span className="text-green-400 font-semibold">Rated</span>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        step="0.5"
                                        value={ratings[player.id] || ''}
                                        onChange={e => handleRatingChange(player.id, parseFloat(e.target.value))}
                                        className="w-20 bg-brand-light-gray text-white text-center rounded border border-gray-600"
                                    />
                                    <button onClick={() => handleSubmitRating(player.id)} className="bg-brand-green text-white px-3 py-1 text-sm rounded hover:bg-green-600">Submit</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                 <button onClick={onClose} className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">
                    Close
                </button>
            </div>
        </div>
    );
};

export default MatchCard;
