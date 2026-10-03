import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

const LAUNCH_DATE = new Date('2027-03-01T10:00:00');

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function Pad({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
        <span className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-2 text-xs sm:text-sm text-white/60 uppercase tracking-widest">{label}</span>
    </div>
  );
}

export default function ComingSoonPage() {
  const { days, hours, minutes, seconds } = useCountdown(LAUNCH_DATE);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-brand-blue-800 via-brand-purple-700 to-brand-purple-900">

      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-brand-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-brand-blue-400/15 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <main className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-20">

        {/* Logo */}
        <img
          src="/logo.png"
          alt="LaMartillera.cl"
          className="h-16 sm:h-20 w-auto brightness-0 invert mb-10 drop-shadow-lg"
        />

        {/* Badge */}
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest mb-6">
          Próximamente
        </span>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 max-w-3xl">
          La plataforma de subastas
          <br />
          <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            inmobiliarias de Chile
          </span>
        </h1>

        <p className="text-white/70 text-lg sm:text-xl max-w-xl mb-14 leading-relaxed">
          Estamos preparando algo increíble. Lanzamos en{' '}
          <strong className="text-white">marzo 2027</strong>. 
          Sé el primero en conocer nuestras subastas.
        </p>

        {/* Countdown */}
        <div className="flex gap-4 sm:gap-6 mb-14">
          <Pad value={days}    label="días"     />
          <Pad value={hours}   label="horas"    />
          <Pad value={minutes} label="minutos"  />
          <Pad value={seconds} label="segundos" />
        </div>

        {/* Divider */}
        <div className="w-16 h-px bg-white/20 mb-12" />

        {/* Contact */}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-white/70 text-sm">
          <a href="tel:+56912345678" className="flex items-center gap-2 hover:text-white transition-colors">
            <Phone className="w-4 h-4" />
            +56 9 1234 5678
          </a>
          <a href="mailto:contacto@lamartillera.cl" className="flex items-center gap-2 hover:text-white transition-colors">
            <Mail className="w-4 h-4" />
            contacto@lamartillera.cl
          </a>
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Santiago, Chile
          </span>
        </div>

        {/* Social */}
        <div className="flex gap-3 mt-8">
          {[
            { Icon: Facebook,  href: '#', label: 'Facebook'  },
            { Icon: Instagram, href: '#', label: 'Instagram' },
            { Icon: Linkedin,  href: '#', label: 'LinkedIn'  },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
            >
              <Icon className="w-4 h-4 text-white" />
            </a>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-6 text-center text-white/40 text-xs px-4">
        © {new Date().getFullYear()} LaMartillera.cl — Todos los derechos reservados.
      </footer>
    </div>
  );
}
