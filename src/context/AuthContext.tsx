import React, { createContext, useState, useContext, useEffect } from 'react';
import { Tokens } from '../types/model';

interface AuthContextType {
  tokens: Tokens | null;
  login: (tokens: Tokens) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<Tokens | null>(() => {
    const storedTokens = localStorage.getItem('tokens');
    return storedTokens ? JSON.parse(storedTokens) : null;
  });

  const login = (newTokens: Tokens) => {
    setTokens(newTokens);
    localStorage.setItem('tokens', JSON.stringify(newTokens));
  };

  const logout = () => {
    setTokens(null);
    localStorage.removeItem('tokens');
  };

  // Optional: Sync tokens with localStorage if it changes externally (e.g., another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedTokens = localStorage.getItem('tokens');
      setTokens(storedTokens ? JSON.parse(storedTokens) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ tokens, login, logout }}>
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