import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, User } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role?: string; college?: string }) => Promise<void>;
  logout: () => void;
  quickLogin: (role: 'student' | 'recruiter' | 'admin') => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('skillproof_token'));
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentUser = await api.getMe();
      setUser(currentUser);
    } catch {
      localStorage.removeItem('skillproof_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    localStorage.setItem('skillproof_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  };

  const register = async (data: { name: string; email: string; password: string; role?: string; college?: string }) => {
    const res = await api.register(data);
    localStorage.setItem('skillproof_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('skillproof_token');
    setToken(null);
    setUser(null);
  };

  const quickLogin = async (role: 'student' | 'recruiter' | 'admin') => {
    let email = 'demo.student@skillproof.dev';
    if (role === 'recruiter') email = 'demo.recruiter@skillproof.dev';
    if (role === 'admin') email = 'demo.admin@skillproof.dev';
    await login(email, 'password123');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, quickLogin, refreshUser }}>
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
