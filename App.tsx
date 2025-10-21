
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MatchesPage from './pages/MatchesPage';
import ProfilePage from './pages/ProfilePage';
import TeamBalancerPage from './pages/TeamBalancerPage';
import Navbar from './components/Navbar';
import { Role } from './types';
import SignupPage from './pages/SignupPage';
import LeaderboardPage from './pages/LeaderboardPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
};

const Main: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-brand-dark">
      {user && <Navbar />}
      <main className="container mx-auto p-4 md:p-8">
        <Routes>
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />} />
          
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/team-balancer/:matchId" element={
            <ProtectedRoute requiredRole={Role.MANAGER}>
              <TeamBalancerPage />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={user ? <Navigate to="/" /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
};

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: Role;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};


export default App;