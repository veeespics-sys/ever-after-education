import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('thuto_token') || null);
  const [user, setUser] = useState(null);
  const [family, setFamily] = useState(null);
  const [activeLearner, setActiveLearner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load current user profile from token
  const loadProfile = async (authToken) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!res.ok) {
        throw new Error('Session invalid or expired');
      }

      const data = await res.json();
      setUser(data.user);
      setFamily(data.family);
      
      // Auto-select first learner if in learner mode or none selected
      if (data.learners && data.learners.length > 0 && !activeLearner) {
        // Keep active learner if still in list, else set first
        setActiveLearner(prev => {
          if (prev) {
            const found = data.learners.find(l => l.id === prev.id);
            return found || data.learners[0];
          }
          return null;
        });
      }
    } catch (err) {
      console.warn('Auth check failed:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadProfile(token);
    } else {
      // Auto-load demo family (Molefe) on initial pilot launch for zero-friction evaluation
      switchDemoFamily('molefe');
    }
  }, []);

  const login = async (email, password) => {
    setError(null);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('thuto_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setFamily(data.family);
    setActiveLearner(null);
    return data;
  };

  const register = async ({ email, password, displayName, familyName }) => {
    setError(null);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName, familyName })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    localStorage.setItem('thuto_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setFamily(data.family);
    setActiveLearner(null);
    return data;
  };

  const switchDemoFamily = async (familyKey) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/auth/demo-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetFamilyKey: familyKey })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Demo switch failed');

      localStorage.setItem('thuto_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setFamily(data.family);
      setActiveLearner(null);
    } catch (err) {
      console.error('Demo family switch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loginLearner = async ({ learnerId, pin }) => {
    setError(null);
    const res = await fetch('/api/auth/learner-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ learnerId, pin })
    });

    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error || 'Learner sign-in failed');
      err.locked = data.locked;
      err.remainingAttempts = data.remainingAttempts;
      throw err;
    }

    localStorage.setItem('thuto_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setFamily(data.family);
    setActiveLearner(data.learner);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('thuto_token');
    setToken(null);
    setUser(null);
    setFamily(null);
    setActiveLearner(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        family,
        activeLearner,
        setActiveLearner,
        loading,
        error,
        login,
        register,
        loginLearner,
        logout,
        switchDemoFamily,
        refreshProfile: () => token && loadProfile(token)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
