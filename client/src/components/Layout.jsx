import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

export default function Layout() {
  const { pathname } = useLocation();
  return <div className="min-h-screen bg-paper">
    <Sidebar />
    <main className="ml-72 min-h-screen px-10 pb-12">
      <Header />
      <div key={pathname} className="page-enter"><Outlet /></div>
    </main>
  </div>;
}
