import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getCurrentSession,
  loginOwner,
  logoutOwner,
  getBackendStatus
} from '../services/financeService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const initial = getCurrentSession();
  const [user, setUser] = useState(initial.user);
  const [token, setToken] = useState(initial.token);
  const [backendInfo, setBackendInfo] = useState(getBackendStatus());

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    const handleBackendStatus = (event) => {
      if (event?.detail) {
        setBackendInfo(event.detail);
      }
    };

    window.addEventListener('rajash:unauthorized', handleUnauthorized);
    window.addEventListener('rajash:backend-status', handleBackendStatus);

    return () => {
      window.removeEventListener('rajash:unauthorized', handleUnauthorized);
      window.removeEventListener('rajash:backend-status', handleBackendStatus);
    };
  }, []);

  const login = useCallback(async ({ identifier, password }) => {
    const result = await loginOwner({ identifier, password });
    setUser(result.user);
    setToken(result.token);
    return result;
  }, []);

  const logout = useCallback(async () => {
    await logoutOwner();
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        backendInfo,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return ctx;
}

