import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { apiError } from '../utils/format.js';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetting, setResetting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login({ ...form, email: form.email.trim() });
      navigate('/');
    } catch (err) {
      setError(apiError(err));
    }
  };

  const reset = async () => {
    if (!form.email) return setError('Enter your email first.');
    setResetting(true);
    setError('');
    try {
      const { data } = await api.post('/auth/password-reset/request', { email: form.email });
      setResetMessage(data.message);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setResetting(false);
    }
  };

  return <div className="page-enter grid min-h-screen grid-cols-1 bg-paper lg:grid-cols-[1fr_1.1fr]">
    <div className="flex min-h-[320px] flex-col justify-between bg-ink p-8 text-white lg:min-h-screen lg:p-12">
      <div>
        <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-mint font-black text-ink">S</div><span className="font-black">Smart Life Planner</span></div>
        <div className="mt-12 max-w-md lg:mt-32"><p className="eyebrow text-mint">A calmer week starts here</p><h1 className="mt-5 text-4xl font-black leading-[0.98] tracking-tight lg:text-6xl">Plan the money. Prep the food. Keep moving.</h1><p className="mt-7 text-lg leading-8 text-white/65">One dashboard for the practical choices that make everyday life feel lighter.</p></div>
      </div>
      <p className="text-sm text-white/45">Built for thoughtful routines, not perfect ones.</p>
    </div>
    <div className="grid place-items-center p-8 lg:p-12">
      <div className="w-full max-w-md">
        <p className="eyebrow">Sign in</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight">Welcome back.</h2>
        <p className="mt-3 text-sm leading-6 text-moss">Your planner is ready when you are.</p>
        <form className="mt-5 space-y-4" onSubmit={submit}>
          <input className="input" type="email" autoComplete="username" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input" type="password" autoComplete="current-password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error && <p className="rounded-2xl bg-coral/15 px-4 py-3 text-sm font-bold text-ink">{error}</p>}
          {resetMessage && <p className="rounded-2xl bg-mint px-4 py-3 text-sm font-bold">{resetMessage}</p>}
          <button className="btn-primary w-full" type="submit">Enter planner</button>
        </form>
        <button className="mt-4 text-sm font-bold text-moss underline" onClick={reset} disabled={resetting}>{resetting ? 'Sending…' : 'Forgot your password?'}</button>
        <p className="mt-10 text-sm text-moss">New here? <Link className="font-black text-ink underline" to="/register">Create an account</Link></p>
      </div>
    </div>
  </div>;
}
