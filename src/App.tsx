import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AuctionsPage from './pages/AuctionsPage';
import AuctionDetailPage from './pages/AuctionDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AdjudicatedPage from './pages/AdjudicatedPage';
import NotFoundPage from './pages/NotFoundPage';
import UserRegisterPage from './pages/UserRegisterPage';
import UserLoginPage from './pages/UserLoginPage';
import UserDashboardPage from './pages/UserDashboardPage';
import { initUserSession } from './utils/userAuth';
import { supabase } from './lib/supabase';
import { Loader2 } from 'lucide-react';

function ProtectedAdmin() {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed]     = useState(false);

  useEffect(() => {
    // Admin siempre verifica contra Supabase directamente (no mock)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setChecking(false); return; }
      const { data: profile } = await supabase
        .from('profiles').select('is_admin').eq('id', session.user.id).single();
      setAuthed(profile?.is_admin === true);
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-purple-400" />
      </div>
    );
  }
  return authed ? <AdminPage /> : <Navigate to="/login" replace />;
}

export default function App() {
  // Valida sesión de usuario al arrancar (refresca el cache de localStorage)
  useEffect(() => { initUserSession(); }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"              element={<HomePage />} />
          <Route path="/subastas"      element={<AuctionsPage />} />
          <Route path="/subastas/:id"  element={<AuctionDetailPage />} />
          <Route path="/como-funciona" element={<HowItWorksPage />} />
          <Route path="/adjudicados"   element={<AdjudicatedPage />} />
          <Route path="/nosotros"      element={<AboutPage />} />
          <Route path="/contacto"      element={<ContactPage />} />
          <Route path="*"              element={<NotFoundPage />} />
        </Route>
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/admin"     element={<ProtectedAdmin />} />
        <Route path="/registro"  element={<UserRegisterPage />} />
        <Route path="/ingresar"  element={<UserLoginPage />} />
        <Route path="/mi-cuenta" element={<UserDashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
