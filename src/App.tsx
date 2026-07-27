import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { isAuthenticated } from './utils/auth';

function ProtectedAdmin() {
  return isAuthenticated() ? <AdminPage /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/subastas" element={<AuctionsPage />} />
          <Route path="/subastas/:id" element={<AuctionDetailPage />} />
          <Route path="/como-funciona" element={<HowItWorksPage />} />
          <Route path="/adjudicados" element={<AdjudicatedPage />} />
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<ProtectedAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}
