import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const month = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date());
  return <header className="flex min-w-0 flex-wrap items-center justify-between gap-3 py-5 sm:flex-nowrap sm:py-8"><div className="min-w-0"><p className="eyebrow">{month}</p><h1 className="mt-2 break-words text-2xl font-black tracking-tight sm:text-3xl">Good to see you, {user?.name?.split(' ')[0]}.</h1></div><div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-bold">{user?.email}</p><p className="text-xs text-moss">{user?.currency} display</p></div><button className="btn-ghost shrink-0" onClick={logout}>Sign out</button></div></header>;
}
