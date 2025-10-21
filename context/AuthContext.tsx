
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Player } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: Player | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = localStorage.getItem('weplay_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    const loggedInUser = await api.login(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      localStorage.setItem('weplay_user', JSON.stringify(loggedInUser));
    } else {
        throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('weplay_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
