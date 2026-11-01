import { useEffect, useState } from 'react';
import Card from '../components/Card.jsx';
import Loading from '../components/Loading.jsx';
import LoadError from '../components/LoadError.jsx';
import { api } from '../services/api.js';
import { apiError } from '../utils/format.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminPage() {
  const { user } = useAuth(); const [accounts, setAccounts] = useState(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); setError(''); try { const { data } = await api.get('/admin/accounts'); setAccounts(data.data); } catch (err) { setError(apiError(err)); } finally { setLoading(false); } };
  useEffect(() => { if (user?.role === 'admin') load(); else { setAccounts([]); setLoading(false); } }, [user]);
  const toggle = async (account) => { try { await api.post(`/admin/accounts/${account._id}/` + (account.status === 'active' ? 'disable' : 'enable')); await load(); } catch (err) { setError(apiError(err)); } };
  if (loading) return <Loading label="Loading account metadata…" />;
  if (user?.role !== 'admin') return <Card title="Admin only"><p className="text-sm text-moss">This area is limited to administrators.</p></Card>;
  if (!accounts) return <LoadError label="Account metadata could not be loaded." error={error} onRetry={load} />;
  return <div className="space-y-7"><div><p className="eyebrow">FR-09 · administration</p><h2 className="mt-2 text-4xl font-black tracking-tight">Keep accounts healthy.</h2><p className="mt-3 text-sm leading-7 text-moss">This view intentionally exposes account metadata only. It never loads user budgets, groceries, meals, or profile data.</p></div>{error && <p className="rounded-2xl bg-coral/15 px-4 py-3 text-sm font-bold">{error}</p>}<Card eyebrow="Account metadata" title={`${accounts.length} accounts`}><div className="overflow-hidden rounded-2xl border border-line"><table className="w-full text-left text-sm"><thead className="bg-paper text-xs uppercase tracking-wider text-moss"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr></thead><tbody>{accounts.map((account) => <tr className="border-t border-line" key={account._id}><td className="px-4 py-4 font-bold">{account.name}</td><td className="px-4 py-4">{account.email}</td><td className="px-4 py-4">{account.role}</td><td className="px-4 py-4 capitalize">{account.status}</td><td className="px-4 py-4">{account.role === 'user' && <button className="btn-ghost" onClick={() => toggle(account)}>{account.status === 'active' ? 'Disable' : 'Enable'}</button>}</td></tr>)}</tbody></table></div></Card></div>;
}
