import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import BudgetPage from './pages/BudgetPage.jsx';
import GroceryPage from './pages/GroceryPage.jsx';
import MealsPage from './pages/MealsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function RequireAuth({ children }) { const { user, loading } = useAuth(); if (loading) return <div className="min-h-screen grid place-items-center text-moss">Loading your planner…</div>; return user ? children : <Navigate to="/login" replace />; }
function RequireGuest({ children }) { const { user } = useAuth(); return user ? <Navigate to="/" replace /> : children; }
export default function App() { return <Routes><Route path="/login" element={<RequireGuest><LoginPage /></RequireGuest>} /><Route path="/register" element={<RequireGuest><RegisterPage /></RequireGuest>} /><Route path="/reset-password" element={<RequireGuest><ResetPasswordPage /></RequireGuest>} /><Route path="/" element={<RequireAuth><Layout /></RequireAuth>}><Route index element={<DashboardPage />} /><Route path="budget" element={<BudgetPage />} /><Route path="groceries" element={<GroceryPage />} /><Route path="meals" element={<MealsPage />} /><Route path="profile" element={<ProfilePage />} /><Route path="admin" element={<AdminPage />} /></Route><Route path="*" element={<NotFoundPage />} /></Routes>; }
