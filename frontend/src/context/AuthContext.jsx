import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import { getStoredAuth, setStoredAuth } from '../services/api';
import { getErrorMessage } from '../utils/errorMessages';

const AuthContext = createContext(null);

const STAFF_ROLES = ['editeur', 'gestionnaire', 'administrateur'];
const ADMIN_DASHBOARD_ROLES = ['administrateur', 'gestionnaire', 'editeur'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const applyAuth = useCallback((data) => {
    if (!data?.token || !data?.user) {
      setUser(null);
      setToken(null);
      setStoredAuth(null);
      return;
    }
    setUser(data.user);
    setToken(data.token);
    setStoredAuth({ token: data.token, user: data.user });
  }, []);

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored) {
      setUser(stored.user);
      setToken(stored.token);
    }
    setLoading(false);

    const onExpired = () => {
      setUser(null);
      setToken(null);
      setError('Votre session a expiré. Veuillez vous reconnecter.');
    };
    window.addEventListener('lg:auth-expired', onExpired);
    return () => window.removeEventListener('lg:auth-expired', onExpired);
  }, []);

  const login = useCallback(async (email, mot_de_passe) => {
    setError('');
    try {
      const data = await authService.login(email, mot_de_passe);
      applyAuth(data);
      return data;
    } catch (err) {
      const msg = getErrorMessage(err, 'Identifiants invalides.');
      setError(msg);
      throw new Error(msg);
    }
  }, [applyAuth]);

  const register = useCallback(async (payload) => {
    setError('');
    try {
      const data = await authService.register(payload);
      applyAuth(data);
      return data;
    } catch (err) {
      const msg = getErrorMessage(err, 'Inscription impossible.');
      setError(msg);
      throw new Error(msg);
    }
  }, [applyAuth]);

  const logout = useCallback(() => {
    applyAuth(null);
    setError('');
  }, [applyAuth]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    error,
    setError,
    isAuthenticated: Boolean(user && token),
    isClient: user?.role === 'client',
    isAdmin: user?.role === 'administrateur',
    isStaff: STAFF_ROLES.includes(user?.role),
    canAccessDashboard: ADMIN_DASHBOARD_ROLES.includes(user?.role),
    login,
    register,
    logout,
  }), [user, token, loading, error, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
}
