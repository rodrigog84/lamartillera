import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/nueva-contrasena`,
    });

    setLoading(false);

    if (err) {
      setError('Ocurrió un error. Verifica el email e intenta nuevamente.');
      return;
    }

    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/ingresar" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio de sesión
          </Link>
          <Link to="/">
            <img src="/logo.png" alt="LaMartillera.cl" className="h-14 w-auto mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Recuperar contraseña</h1>
          <p className="text-gray-500 text-sm mt-1">
            Te enviaremos un enlace para crear una nueva contraseña
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {sent ? (
            /* Estado: correo enviado */
            <div className="text-center space-y-4">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
              <h2 className="text-lg font-semibold text-gray-800">¡Correo enviado!</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Revisa tu bandeja de entrada en <span className="font-medium text-gray-700">{email}</span>.
                Haz clic en el enlace del correo para crear tu nueva contraseña.
              </p>
              <p className="text-xs text-gray-400">
                Si no lo ves, revisa la carpeta de spam.
              </p>
              <Link
                to="/ingresar"
                className="block w-full mt-4 py-3 text-center bg-gradient-to-r from-brand-blue-500 to-brand-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            /* Formulario */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email de tu cuenta
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="input-field pl-9"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2.5">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-brand-blue-500 to-brand-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                  : 'Enviar enlace de recuperación'}
              </button>

              <p className="text-center text-sm text-gray-500">
                ¿Recordaste tu contraseña?{' '}
                <Link to="/ingresar" className="text-brand-purple-500 font-medium hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
