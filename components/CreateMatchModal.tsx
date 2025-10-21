
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Match } from '../types';

interface CreateMatchModalProps {
  onClose: () => void;
  onMatchCreated: (newMatch: Match) => void;
}

const CreateMatchModal: React.FC<CreateMatchModalProps> = ({ onClose, onMatchCreated }) => {
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !date || !location) return;

    setIsSubmitting(true);
    try {
      const newMatch = await api.createMatch({
        date: new Date(date).toISOString(),
        location,
        managerId: user.id,
      });
      onMatchCreated(newMatch);
      onClose();
    } catch (error) {
      console.error("Failed to create match", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-brand-gray rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Create a New Match</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-300">Location</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="mt-1 block w-full bg-brand-dark border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-green focus:border-brand-green"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-300">Date and Time</label>
            <input
              type="datetime-local"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 block w-full bg-brand-dark border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-green focus:border-brand-green"
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-brand-light-gray hover:bg-gray-600 text-white font-semibold rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 bg-brand-green hover:bg-green-600 text-white font-semibold rounded-md disabled:bg-gray-500"
            >
              {isSubmitting ? 'Creating...' : 'Create Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMatchModal;
