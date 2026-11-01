import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, clearAccessToken, setAccessToken } from '../services/api.js';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.post('/auth/refresh').then(({ data }) => { setAccessToken(data.data.accessToken); setUser(data.data.user); }).catch(() => {}).finally(() => setLoading(false)); }, []);
  const login = async (payload) => { const { data } = await api.post('/auth/login', payload); setAccessToken(data.data.accessToken); setUser(data.data.user); return data.data.user; };
  const register = async (payload) => { const { data } = await api.post('/auth/register', payload); setAccessToken(data.data.accessToken); setUser(data.data.user); return data.data.user; };
  const logout = async () => { try { await api.post('/auth/logout'); } finally { clearAccessToken(); setUser(null); } };
  const refreshUser = async () => { const { data } = await api.get('/auth/me'); setUser(data.data); };
  const value = useMemo(() => ({ user, loading, login, register, logout, refreshUser, setUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
