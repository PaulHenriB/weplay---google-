
import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <p>Loading profile...</p>;
  }

  const getAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="bg-brand-gray p-8 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <div className="flex-shrink-0">
            <div className="h-32 w-32 rounded-full bg-brand-light-gray flex items-center justify-center text-5xl font-bold text-white">
              {user.firstName[0]}{user.lastName[0]}
            </div>
          </div>
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-4xl font-bold">{user.firstName} {user.lastName}</h2>
            <p className="text-lg text-brand-green capitalize">{user.role}</p>
            <p className="text-gray-400">{user.email}</p>
          </div>
          <div className="text-center md:text-right">
             <p className="text-lg text-gray-300">Overall Rating</p>
             <p className="text-5xl font-bold text-brand-green">{user.averageRating.toFixed(1)}</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-brand-light-gray grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
                <p className="text-sm text-gray-400 uppercase font-semibold">Age</p>
                <p className="text-2xl font-bold">{getAge(user.dob)}</p>
            </div>
             <div>
                <p className="text-sm text-gray-400 uppercase font-semibold">Favorite Position</p>
                <p className="text-2xl font-bold">{user.favoritePosition}</p>
            </div>
             <div>
                <p className="text-sm text-gray-400 uppercase font-semibold">Preferred Foot</p>
                <p className="text-2xl font-bold capitalize">{user.favoriteFoot}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
