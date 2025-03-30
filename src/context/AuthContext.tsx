import React, { createContext, useState, useContext, useEffect } from 'react';
import { Tokens } from '../types/model';

interface AuthContextType {
  tokens: Tokens | null;
  userId: number | null;
  username: string | null; // Add username
  login: (tokens: Tokens, username: string) => void; // Updated login signature
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<Tokens | null>(() => {
    const storedTokens = localStorage.getItem('tokens');
    return storedTokens ? JSON.parse(storedTokens) : null;
  });
  const [userId, setUserId] = useState<number | null>(() => {
    const storedUserId = sessionStorage.getItem('userId');
    return storedUserId ? parseInt(storedUserId, 10) : null;
  });
  const [username, setUsername] = useState<string | null>(() => {
    const storedUsername = sessionStorage.getItem('username');
    return storedUsername || null;
  });

  const login = (newTokens: Tokens, username: string) => {
    setTokens(newTokens);
    setUserId(newTokens.userId); // Assuming userId is part of Tokens (if not, adjust accordingly)
    setUsername(username); // Store the username from the login form
    localStorage.setItem('tokens', JSON.stringify(newTokens));
    sessionStorage.setItem('userId', newTokens.userId?.toString() || '0'); // Adjust if userId isn't in tokens
    sessionStorage.setItem('username', username);
  };

  const logout = () => {
    setTokens(null);
    setUserId(null);
    setUsername(null);
    localStorage.removeItem('tokens');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const storedTokens = localStorage.getItem('tokens');
      const storedUserId = sessionStorage.getItem('userId');
      const storedUsername = sessionStorage.getItem('username');
      setTokens(storedTokens ? JSON.parse(storedTokens) : null);
      setUserId(storedUserId ? parseInt(storedUserId, 10) : null);
      setUsername(storedUsername || null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ tokens, userId, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};