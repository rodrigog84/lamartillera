import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img
                src="/logo.png"
                alt="LaMartillera.cl"
                className="h-16 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Somos una empresa especializada en la publicación y difusión de subastas inmobiliarias en Chile. 
              Conectamos propiedades con compradores interesados.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Linkedin, href: '#', label: 'LinkedIn' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-purple-500 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Navegación</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Inicio' },
                { to: '/subastas', label: 'Ver Subastas' },
                { to: '/nosotros', label: 'Nosotros' },
                { to: '/contacto', label: 'Contacto' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property types */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Tipo de Propiedad</h3>
            <ul className="space-y-2.5">
              {['Casas', 'Departamentos', 'Parcelas', 'Locales Comerciales', 'Oficinas', 'Terrenos'].map(type => (
                <li key={type}>
                  <Link
                    to={`/subastas?tipo=${encodeURIComponent(type)}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contacto</h3>
            <ul className="space-y-4">
              {[
                { Icon: Phone, text: '+56 9 1234 5678' },
                { Icon: Mail, text: 'contacto@lamartillera.cl' },
                { Icon: MapPin, text: 'Santiago, Chile' },
              ].map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-brand-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-400">{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <a
                href="https://lamartillera.cl/registro"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center px-5 py-3 bg-gradient-to-r from-brand-blue-500 to-brand-purple-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Inscríbete en una subasta →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} LaMartillera.cl — Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-500">
            La Martillera publica información de subastas. La ejecución de remates es responsabilidad de cada martillero autorizado.
          </p>
        </div>
      </div>
    </footer>
  );
}
