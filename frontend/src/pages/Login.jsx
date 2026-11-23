import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { friendlyError } from '../services/api';
export default function Login() {
  const { token, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  if (token) return <Navigate to="/" replace />;
  async function submit(event) {
    event.preventDefault(); setError(''); setLoading(true);
    try { await signIn(email, password); navigate('/'); } catch (e) { setError(friendlyError(e)); } finally { setLoading(false); }
  }
  return <div className="login-screen"><div className="login-visual"><div className="login-emblem">H</div><h1>Hospitality,<br/><em>organized.</em></h1><p>One workspace to manage every room, reservation, guest, and invoice.</p><div className="login-label">HOTEL ERP SYSTEM</div></div><div className="login-side"><form className="login-card" onSubmit={submit}><div className="eyebrow">WELCOME BACK</div><h2>Sign in to your workspace</h2><p>Enter the administrator account created with the seed command.</p>{error && <div className="notice notice-error">{error}</div>}<label>Email address<input type="email" value={email} required onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" /></label><label>Password<input type="password" value={password} required onChange={e => setPassword(e.target.value)} placeholder="Your password" /></label><button className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in →'}</button><small>Access is restricted to authorized hotel staff.</small></form></div></div>;
}
