import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, UserCircle, Heart } from 'lucide-react';
import clsx from 'clsx';
import { getSession, logout } from '../../utils/auth';
import { supabase } from '../../lib/supabase';
import { getCurrentUser, logoutUser, UserProfile } from '../../utils/userAuth';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/subastas', label: 'Subastas' },
  { to: '/adjudicados', label: 'Adjudicados' },
  { to: '/como-funciona', label: 'Cómo funciona' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authed, setAuthed]     = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(getCurrentUser());
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    getSession().then(s => setAuthed(!!s));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserProfile(getCurrentUser()); // refresca al cambiar de ruta
  }, [location]);

  const handleLogout = async () => {
    await logout();
    setAuthed(false);
    navigate('/');
  };

  const navBg = isHome && !scrolled ? 'bg-transparent' : 'bg-white shadow-md';
  const textColor = isHome && !scrolled ? 'text-white' : 'text-gray-800';

  return (
    <header className={clsx('fixed top-0 inset-x-0 z-50 transition-all duration-300', navBg)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src="/logo.png" alt="LaMartillera.cl" className="h-14 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  clsx(
                    'px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200',
                    isActive
                      ? (isHome && !scrolled ? 'bg-white/20 text-white' : 'bg-brand-purple-50 text-brand-purple-600')
                      : clsx('hover:bg-white/10', textColor),
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Botones de usuario */}
            {userProfile ? (
              <div className="flex items-center gap-2">
                <Link to="/mi-cuenta"
                  className={clsx('flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all border',
                    isHome && !scrolled ? 'border-white/40 text-white hover:bg-white/10' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  )}>
                  <UserCircle className="w-4 h-4" />
                  {userProfile.name.split(' ')[0]}
                </Link>
                <Link to="/mi-cuenta" title="Mis favoritos"
                  className={clsx('p-2.5 rounded-xl transition-colors', isHome && !scrolled ? 'text-white hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100')}>
                  <Heart className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/ingresar"
                  className={clsx('px-4 py-2.5 rounded-xl font-medium text-sm transition-all',
                    isHome && !scrolled ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
                  )}>
                  Ingresar
                </Link>
                <Link to="/registro"
                  className={clsx('px-4 py-2.5 rounded-xl font-semibold text-sm transition-all border-2',
                    isHome && !scrolled
                      ? 'border-white text-white hover:bg-white hover:text-brand-purple-600'
                      : 'border-brand-purple-500 text-brand-purple-500 hover:bg-brand-purple-500 hover:text-white'
                  )}>
                  Registrarse
                </Link>
              </div>
            )}

            {/* Admin */}
            {authed ? (
              <div className="flex items-center gap-2 ml-1 pl-3 border-l border-white/20">
                <Link to="/admin"
                  className="px-4 py-2.5 bg-gradient-to-r from-brand-blue-500 to-brand-purple-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg">
                  Admin
                </Link>
                <button onClick={handleLogout} title="Cerrar sesión admin"
                  className={clsx('p-2.5 rounded-xl transition-colors', isHome && !scrolled ? 'text-white hover:bg-white/20' : 'text-gray-500 hover:bg-gray-100')}>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login"
                className="ml-1 px-4 py-2.5 bg-gradient-to-r from-brand-blue-500 to-brand-purple-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg">
                Admin
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className={clsx('lg:hidden p-2 rounded-lg transition-colors', textColor)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  clsx(
                    'px-4 py-3 rounded-xl font-medium transition-colors',
                    isActive ? 'bg-brand-purple-50 text-brand-purple-600' : 'text-gray-700 hover:bg-gray-50',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
              {userProfile ? (
                <>
                  <Link to="/mi-cuenta" className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">
                    <UserCircle className="w-4 h-4 text-brand-purple-500" /> Mi cuenta ({userProfile.name.split(' ')[0]})
                  </Link>
                  <Link to="/mi-cuenta" className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50">
                    <Heart className="w-4 h-4 text-red-400" /> Mis favoritos
                  </Link>
                  <button onClick={async () => { await logoutUser(); setUserProfile(null); }}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500 hover:text-gray-700">
                    <LogOut className="w-4 h-4" /> Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/ingresar" className="btn-outline text-center justify-center">Ingresar</Link>
                  <Link to="/registro" className="btn-secondary text-center justify-center">Registrarse</Link>
                </>
              )}
              <div className="pt-2 border-t border-gray-100">
                {authed ? (
                  <>
                    <Link to="/admin" className="flex items-center justify-center gap-2 py-3 text-sm text-gray-500 hover:text-gray-700 font-medium">
                      Panel Admin
                    </Link>
                    <button onClick={handleLogout} className="flex items-center justify-center gap-2 py-2 text-xs text-gray-400 hover:text-gray-600 w-full">
                      <LogOut className="w-3 h-3" /> Salir del admin
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="flex items-center justify-center py-2 text-xs text-gray-400 hover:text-gray-600">
                    Acceso administrador
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
