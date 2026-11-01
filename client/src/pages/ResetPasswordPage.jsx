import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { apiError } from '../utils/format.js';

export default function ResetPasswordPage() {
  const [params] = useSearchParams(); const navigate = useNavigate(); const [password, setPassword] = useState(''); const [message, setMessage] = useState(''); const [error, setError] = useState('');
  const submit = async (event) => { event.preventDefault(); try { await api.post('/auth/password-reset/confirm', { token: params.get('token'), password }); setMessage('Password reset. You can sign in now.'); setTimeout(() => navigate('/login'), 1000); } catch (err) { setError(apiError(err)); } };
  return <div className="grid min-h-screen place-items-center bg-paper p-12"><div className="panel w-full max-w-md p-8"><p className="eyebrow">Account recovery</p><h1 className="mt-3 text-3xl font-black">Choose a new password.</h1><form className="mt-8 space-y-4" onSubmit={submit}><input className="input" type="password" minLength="8" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required />{error && <p className="rounded-2xl bg-coral/15 px-4 py-3 text-sm font-bold">{error}</p>}{message && <p className="rounded-2xl bg-mint px-4 py-3 text-sm font-bold">{message}</p>}<button className="btn-primary w-full">Reset password</button></form><Link className="mt-5 block text-center text-sm font-bold text-moss underline" to="/login">Back to sign in</Link></div></div>;
}
