import { createContext, useContext, useState } from 'react';
import * as authService from '../services/authService';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('hotel_erp_user') || 'null'); } catch { return null; } });
  const [token, setToken] = useState(() => localStorage.getItem('hotel_erp_token'));
  async function signIn(email, password) {
    const result = await authService.login(email, password);
    localStorage.setItem('hotel_erp_token', result.token);
    localStorage.setItem('hotel_erp_user', JSON.stringify(result.user));
    setUser(result.user); setToken(result.token);
  }
  function signOut() {
    localStorage.removeItem('hotel_erp_token'); localStorage.removeItem('hotel_erp_user');
    setToken(null); setUser(null);
  }
  return <AuthContext.Provider value={{ user, token, signIn, signOut }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error('AuthContext missing'); return ctx; }
