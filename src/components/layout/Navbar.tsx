import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/subastas', label: 'Subastas' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navBg = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-white shadow-md';

  const textColor = isHome && !scrolled ? 'text-white' : 'text-gray-800';

  return (
    <header
      className={clsx(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        navBg,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src="/logo.png"
              alt="LaMartillera.cl"
              className="h-14 w-auto"
            />
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
                    'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200',
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
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://lamartillera.cl/registro"
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                'px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 border-2',
                isHome && !scrolled
                  ? 'border-white text-white hover:bg-white hover:text-brand-purple-600'
                  : 'border-brand-purple-500 text-brand-purple-500 hover:bg-brand-purple-500 hover:text-white',
              )}
            >
              Inscríbete
            </a>
            <Link
              to="/admin"
              className="px-5 py-2.5 bg-gradient-to-r from-brand-blue-500 to-brand-purple-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg"
            >
              Administrar
            </Link>
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
                    isActive
                      ? 'bg-brand-purple-50 text-brand-purple-600'
                      : 'text-gray-700 hover:bg-gray-50',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
              <a
                href="https://lamartillera.cl/registro"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-center justify-center"
              >
                Inscríbete en subasta
              </a>
              <Link to="/admin" className="btn-secondary text-center justify-center">
                Panel de Administración
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
