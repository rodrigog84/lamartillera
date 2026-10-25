import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { loginUser } from '../utils/userAuth';

export default function UserLoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') ?? '/mi-cuenta';

  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (f: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(v => ({ ...v, [f]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { ok, error: err } = await loginUser(form.email, form.password);
    if (!ok) {
      setLoading(false);
      // Mensaje amigable si el email no está confirmado
      const msg = err?.toLowerCase().includes('email not confirmed')
        ? 'Debes confirmar tu email antes de ingresar. Revisa tu bandeja de entrada.'
        : err ?? 'Email o contraseña incorrectos.';
      setError(msg);
      return;
    }
    // Si es admin, redirigir al panel de administración
    const user = await import('../utils/userAuth').then(m => m.getCurrentUser());
    setLoading(false);
    if (user?.isAdmin) {
      navigate('/admin', { replace: true });
    } else {
      navigate(next, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
          <Link to="/">
            <img src="/logo.png" alt="LaMartillera.cl" className="h-14 w-auto mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Iniciar sesión</h1>
          <p className="text-gray-500 text-sm mt-1">Accede a tus favoritos y tu cuenta</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" required value={form.email} onChange={set('email')}
                  placeholder="tu@email.com" className="input-field pl-9" autoFocus />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPwd ? 'text' : 'password'} required value={form.password} onChange={set('password')}
                  placeholder="Tu contraseña" className="input-field pl-9 pr-10" />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2.5">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-blue-500 to-brand-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2 mt-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Ingresando...</> : 'Ingresar'}
            </button>

            <p className="text-center text-sm text-gray-500">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-brand-purple-500 font-medium hover:underline">Regístrate gratis</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
