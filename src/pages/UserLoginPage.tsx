import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { loginUser } from '../utils/userAuth';
import { supabase } from '../lib/supabase';

export default function UserLoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') ?? '/mi-cuenta';

  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]     = useState('');
  const [checking, setChecking] = useState(true);

  // Detectar sesión activa al volver de Google OAuth
  useEffect(() => {
    // Verificar sesión existente al montar
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setChecking(false); return; }
      const { data: profile } = await supabase
        .from('profiles').select('is_admin').eq('id', session.user.id).single();
      if (profile?.is_admin) {
        navigate('/admin', { replace: true });
      } else {
        navigate(next, { replace: true });
      }
    });

    // Escuchar cambios de auth (cubre el redirect de OAuth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('profiles').select('is_admin').eq('id', session.user.id).single();
        if (profile?.is_admin) {
          navigate('/admin', { replace: true });
        } else {
          navigate(next, { replace: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, next]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError('');
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/ingresar` },
    });
    setGoogleLoading(false);
  };

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
          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-70 mb-4"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span className="text-sm font-medium text-gray-700">Continuar con Google</span>
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">o con email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

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
