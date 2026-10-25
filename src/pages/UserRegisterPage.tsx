import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { registerUser } from '../utils/userAuth';

export default function UserRegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);

  const set = (f: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(v => ({ ...v, [f]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden.'); return; }
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    setLoading(true);
    const { ok, error: err } = await registerUser(form.name, form.email, form.password, form.phone);
    setLoading(false);
    if (!ok) { setError(err ?? 'Error al registrarse.'); return; }
    setSuccess(true);
    // No redirigir automáticamente: el usuario debe confirmar su email primero
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
          <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
          <p className="text-gray-500 text-sm mt-1">Guarda tus subastas favoritas y recibe novedades</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">¡Revisa tu correo!</h2>
              <p className="text-gray-500 text-sm mb-4">
                Te enviamos un email de confirmación a <strong>{form.email}</strong>.
                Haz clic en el enlace para activar tu cuenta.
              </p>
              <p className="text-xs text-gray-400">
                Si no lo ves, revisa la carpeta de spam.
              </p>
              <Link to="/ingresar" className="mt-6 inline-block text-sm text-brand-purple-500 font-medium hover:underline">
                Ya confirmé mi email → Iniciar sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" required value={form.name} onChange={set('name')}
                    placeholder="Tu nombre" className="input-field pl-9" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" required value={form.email} onChange={set('email')}
                    placeholder="tu@email.com" className="input-field pl-9" />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono <span className="text-gray-400 font-normal">(opcional)</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" value={form.phone} onChange={set('phone')}
                    placeholder="+56 9 1234 5678" className="input-field pl-9" />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPwd ? 'text' : 'password'} required value={form.password} onChange={set('password')}
                    placeholder="Mínimo 6 caracteres" className="input-field pl-9 pr-10" />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar contraseña *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPwd ? 'text' : 'password'} required value={form.confirm} onChange={set('confirm')}
                    placeholder="Repite tu contraseña" className="input-field pl-9" />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2.5">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-brand-blue-500 to-brand-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2 mt-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creando cuenta...</> : 'Crear cuenta'}
              </button>

              <p className="text-center text-sm text-gray-500">
                ¿Ya tienes cuenta?{' '}
                <Link to="/ingresar" className="text-brand-purple-500 font-medium hover:underline">Inicia sesión</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
