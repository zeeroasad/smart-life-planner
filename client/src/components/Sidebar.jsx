import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/', label: 'Overview', icon: 'overview', end: true },
  { to: '/budget', label: 'Budget', icon: 'budget' },
  { to: '/groceries', label: 'Groceries', icon: 'groceries' },
  { to: '/meals', label: 'Fitness meals', icon: 'meals' },
  { to: '/profile', label: 'Profile', icon: 'profile' }
];

function NavIcon({ name }) {
  const paths = {
    overview: <><rect x="3.5" y="3.5" width="7" height="7" rx="1" /><rect x="13.5" y="3.5" width="7" height="7" rx="1" /><rect x="3.5" y="13.5" width="7" height="7" rx="1" /><rect x="13.5" y="13.5" width="7" height="7" rx="1" /></>,
    budget: <><path d="M4 6.5h15a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.5Z" /><path d="M3 9h18M16 14h2" /><path d="M5 6.5V5a2 2 0 0 1 2-2h10" /></>,
    groceries: <><path d="m3 8 2 12h14l2-12H3Z" /><path d="M8 8a4 4 0 0 1 8 0M8 12v4m4-4v4m4-4v4" /></>,
    meals: <><path d="M7 3v7m-3-7v4a3 3 0 0 0 6 0V3m-3 7v11M17 3v18m0-18c-2 2-3 5-3 8h6c0-3-1-6-3-8Z" /></>,
    profile: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
    admin: <><path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" /><path d="m9 12 2 2 4-4" /></>
  };

  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function LinkItem({ link, index = 0 }) {
  return <NavLink
    to={link.to}
    end={link.end}
    title={link.label}
    style={{ '--nav-index': index }}
    className={({ isActive }) => `nav-link group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition duration-200 ${isActive ? 'is-active' : ''}`}
  >
    <span className="nav-icon-tile"><NavIcon name={link.icon} /></span>
    <span>{link.label}</span>
    <span className="nav-arrow ml-auto" aria-hidden="true">↗</span>
  </NavLink>;
}

export default function Sidebar() {
  const { user } = useAuth();
  return <aside className="app-sidebar fixed inset-y-0 left-0 z-10 flex w-72 flex-col px-5 py-7 text-white">
    <div className="flex items-center gap-3 px-2">
      <div className="brand-mark grid h-11 w-11 place-items-center rounded-2xl text-xl font-black text-ink">S</div>
      <div><p className="text-sm font-black tracking-tight">Smart Life</p><p className="text-xs text-white/50">Planner <span className="ml-1 text-mint">/</span> daily edition</p></div>
    </div>
    <div className="sidebar-rule mx-2 mt-8" />
    <div className="mt-8">
      <p className="sidebar-label mb-3 px-3">Your control room</p>
      <nav aria-label="Main navigation" className="mobile-nav space-y-1.5">
        {links.map((link, index) => <LinkItem key={link.to} link={link} index={index} />)}
        {user?.role === 'admin' && <LinkItem link={{ to: '/admin', label: 'Admin', icon: 'admin' }} index={links.length} />}
      </nav>
    </div>
    <div className="sidebar-note mt-auto rounded-3xl p-5">
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-mint/10 text-mint"><span className="text-lg" aria-hidden="true">✳</span></div>
      <p className="eyebrow text-mint">The rule</p>
      <p className="mt-3 text-sm font-bold leading-6 text-white">Small choices become a calmer week.</p>
      <p className="mt-2 text-xs leading-5 text-white/55">Keep your budget, food, and movement plan in one place.</p>
    </div>
    <p className="px-3 pt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">Make room for what matters</p>
  </aside>;
}
