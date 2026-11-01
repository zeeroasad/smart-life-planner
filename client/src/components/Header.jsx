import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const month = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date());
  return <header className="flex items-center justify-between py-8"><div><p className="eyebrow">{month}</p><h1 className="mt-2 text-3xl font-black tracking-tight">Good to see you, {user?.name?.split(' ')[0]}.</h1></div><div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-bold">{user?.email}</p><p className="text-xs text-moss">{user?.currency} display</p></div><button className="btn-ghost" onClick={logout}>Sign out</button></div></header>;
}
