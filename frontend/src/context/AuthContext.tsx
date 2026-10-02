import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, User } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    college?: string;
    company?: string;
    headline?: string;
    location?: string;
    github_url?: string;
    linkedin_url?: string;
    bio?: string;
  }) => Promise<void>;
  logout: () => void;
  quickLogin: (personaOrEmail: string) => Promise<void>;
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

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    college?: string;
    company?: string;
    headline?: string;
    location?: string;
    github_url?: string;
    linkedin_url?: string;
    bio?: string;
  }) => {
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

  const quickLogin = async (personaOrEmail: string) => {
    let email = personaOrEmail;
    if (personaOrEmail.includes('@')) {
      email = personaOrEmail;
    } else if (personaOrEmail === 'student' || personaOrEmail === 'aarav') {
      email = 'demo.student@skillproof.dev';
    } else if (personaOrEmail === 'yash') {
      email = 'yash.pimpalkar@skillproof.dev';
    } else if (personaOrEmail === 'purva') {
      email = 'purva.mahajan@skillproof.dev';
    } else if (personaOrEmail === 'sanika') {
      email = 'sanika.barhate@skillproof.dev';
    } else if (personaOrEmail === 'manthan') {
      email = 'manthan.c0588@gmail.com';
    } else if (personaOrEmail === 'recruiter' || personaOrEmail === 'elena') {
      email = 'demo.recruiter@skillproof.dev';
    } else if (personaOrEmail === 'rajesh') {
      email = 'rajesh.singhania@techcorp.com';
    } else if (personaOrEmail === 'sarah') {
      email = 'sarah.jenkins@cloudscale.io';
    } else if (personaOrEmail === 'admin') {
      email = 'demo.admin@skillproof.dev';
    }
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
