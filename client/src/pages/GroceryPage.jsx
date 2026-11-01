import { useEffect, useState } from 'react';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Loading from '../components/Loading.jsx';
import LoadError from '../components/LoadError.jsx';
import { api } from '../services/api.js';
import { apiError, currentMonth, formatCurrency } from '../utils/format.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function GroceryPage() {
  const { user } = useAuth(); const [lists, setLists] = useState(null); const [plans, setPlans] = useState([]); const [form, setForm] = useState({ name: '', month: currentMonth(), itemName: '', quantity: 1, unit: 'item', estimatedCost: 0 }); const [error, setError] = useState(''); const [loading, setLoading] = useState(true); const [pendingItems, setPendingItems] = useState(() => new Set());
  const load = async () => { setLoading(true); setError(''); try { const [{ data: listResponse }, { data: planResponse }] = await Promise.all([api.get('/groceries'), api.get('/meals')]); setLists(listResponse.data); setPlans(planResponse.data.plans); } catch (err) { setError(apiError(err)); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const create = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/groceries', { name: form.name, month: form.month, items: [{ name: form.itemName, quantity: Number(form.quantity), unit: form.unit, estimatedCost: Number(form.estimatedCost), checked: false }] });
      setLists((current) => [data.data, ...current]);
      setForm({ ...form, name: '', itemName: '', quantity: 1, estimatedCost: 0 });
    } catch (err) { setError(apiError(err)); }
  };
  const toggle = async (list, item) => {
    const listId = list.id || list._id;
    const itemKey = `${listId}:${item._id}`;
    if (pendingItems.has(itemKey)) return;
    const checked = !item.checked;
    const items = list.items.map((row) => (row._id === item._id ? { ...row, checked } : row));
    const replaceList = (nextList) => setLists((current) => current.map((row) => (row.id === listId ? nextList : row)));

    setError('');
    setPendingItems((current) => new Set(current).add(itemKey));
    setLists((current) => current.map((row) => (row.id === listId ? { ...row, items } : row)));
    try {
      const { data } = await api.put(`/groceries/${listId}`, { name: list.name, month: list.month, items, sourceMealPlanId: list.sourceMealPlanId });
      replaceList(data.data);
    } catch (err) {
      setError(apiError(err));
      setLists((current) => current.map((row) => row.id === listId ? {
        ...row,
        items: row.items.map((currentItem) => currentItem._id === item._id ? { ...currentItem, checked: item.checked } : currentItem)
      } : row));
    } finally {
      setPendingItems((current) => { const next = new Set(current); next.delete(itemKey); return next; });
    }
  };
  const generate = async (plan) => {
    setError('');
    try {
      const { data } = await api.post('/groceries/from-meal-plan', { mealPlanId: plan.id || plan._id, month: currentMonth(), name: `${plan.title} groceries` });
      setLists((current) => [data.data, ...current]);
    } catch (err) { setError(apiError(err)); }
  };
  const remove = async (id) => {
    setError('');
    try {
      await api.delete(`/groceries/${id}`);
      setLists((current) => current.filter((list) => list.id !== id));
    } catch (err) { setError(apiError(err)); }
  };
  if (loading) return <Loading label="Loading your grocery shelf…" />;
  if (!lists) return <LoadError label="Your grocery lists could not be loaded." error={error} onRetry={load} />;
  return <div className="space-y-7"><div><p className="eyebrow">FR-04 · groceries</p><h2 className="mt-2 text-4xl font-black tracking-tight">Buy what your plan needs.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-moss">Estimated list totals flow into your Groceries budget. Check items off as you shop.</p></div><div className="grid grid-cols-[0.85fr_1.15fr] gap-6"><Card eyebrow="Quick list" title="Start a grocery list"><form className="space-y-3" onSubmit={create}><input className="input" placeholder="List name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /><div className="grid grid-cols-2 gap-3"><input className="input" placeholder="First item" value={form.itemName} onChange={(e) => setForm({ ...form, itemName: e.target.value })} required /><input className="input" type="number" min="0" placeholder="Qty" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></div><div className="grid grid-cols-2 gap-3"><input className="input" placeholder="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /><input className="input" type="number" min="0" placeholder="Cost each" value={form.estimatedCost} onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })} /></div><button type="submit" className="btn-primary w-full">Create list</button></form></Card><Card eyebrow="From fitness meals" title="Turn a plan into groceries"><div className="space-y-3">{plans.length === 0 ? <p className="text-sm leading-6 text-moss">Save a meal plan first, then it will appear here.</p> : plans.map((plan) => <div className="flex items-center justify-between rounded-2xl bg-paper px-4 py-3" key={plan.id}><div><p className="font-bold">{plan.title}</p><p className="text-xs text-moss">{plan.meals?.length || 0} meals · {plan.goal}</p></div><button type="button" className="btn-soft" onClick={() => generate(plan)}>Generate list</button></div>)}</div></Card></div>{error && <p className="rounded-2xl bg-coral/15 px-4 py-3 text-sm font-bold">{error}</p>}{lists.length === 0 ? <EmptyState title="No grocery lists yet" body="Start with a quick list or generate one from a saved meal plan." /> : <div className="grid grid-cols-2 gap-6">{lists.map((list) => <Card key={list.id} eyebrow={list.month} title={list.name} action={<button type="button" className="text-xs font-bold text-coral" onClick={() => remove(list.id)}>Delete</button>}><div className="space-y-2">{list.items.map((item) => { const itemKey = `${list.id}:${item._id}`; return <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-paper px-4 py-3" key={item._id}><span className="flex items-center gap-3"><input type="checkbox" checked={item.checked} disabled={pendingItems.has(itemKey)} onChange={() => toggle(list, item)} /><span className={item.checked ? 'text-moss line-through' : 'font-bold'}>{item.name}</span></span><span className="text-xs text-moss">{item.quantity} {item.unit} · {formatCurrency(item.estimatedCost * item.quantity, user.currency)}</span></label>; })}{list.items.length === 0 && <p className="text-sm text-moss">This list is empty.</p>}</div><div className="mt-5 flex items-end justify-between border-t border-line pt-4"><span className="text-sm text-moss">Estimated total</span><strong className="text-xl">{formatCurrency(list.estimatedTotal, user.currency)}</strong></div></Card>)}</div>}</div>;
}
