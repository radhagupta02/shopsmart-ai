import { createContext, useContext, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken, removeToken] = useLocalStorage('ss_token', null);
  const [user, setUser, removeUser] = useLocalStorage('ss_user', null);
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const login = useCallback(
    (tokenValue, userData) => {
      setToken(tokenValue);
      setUser(userData);
      success(`Welcome back, ${userData.name}!`);
    },
    [setToken, setUser, success],
  );

  const logout = useCallback(() => {
    removeToken();
    removeUser();
    navigate('/login');
  }, [removeToken, removeUser, navigate]);

  /** Called by api/client on 401 */
  const clearSession = useCallback(() => {
    removeToken();
    removeUser();
  }, [removeToken, removeUser]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      isAdmin: user?.role === 'ADMIN',
      login,
      logout,
      clearSession,
    }),
    [token, user, login, logout, clearSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
