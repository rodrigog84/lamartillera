import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Heart, User, Phone, Mail, Save, Loader2, LogOut, CheckCircle, Edit2 } from 'lucide-react';
import { getCurrentUser, logoutUser, updateUserProfile, UserProfile } from '../utils/userAuth';
import { useFavorites } from '../hooks/useFavorites';
import { useAuctions } from '../hooks/useAuctions';
import AuctionCard from '../components/AuctionCard';

type Tab = 'favoritos' | 'datos';

export default function UserDashboardPage() {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/ingresar" replace />;

  return <Dashboard user={user} />;
}

function Dashboard({ user }: { user: UserProfile }) {
  const [tab, setTab] = useState<Tab>('favoritos');

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-blue-500 to-brand-purple-500 flex items-center justify-center text-white text-xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-8">
          {([
            { id: 'favoritos', label: 'Mis favoritos', icon: Heart },
            { id: 'datos',     label: 'Mis datos',     icon: User  },
          ] as { id: Tab; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === id ? 'bg-white text-brand-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'favoritos' && <FavoritesTab userId={user.id} />}
        {tab === 'datos'     && <ProfileTab user={user} />}
      </div>
    </div>
  );
}

// ── Tab Favoritos ──
function FavoritesTab({ userId: _userId }: { userId: string }) {
  const { favs } = useFavorites();
  const { auctions, loading } = useAuctions();
  const favAuctions = auctions.filter(a => favs.includes(a.id));

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-brand-purple-400" />
    </div>
  );

  if (favAuctions.length === 0) return (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Heart className="w-9 h-9 text-red-300" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Aún no tienes favoritos</h2>
      <p className="text-gray-500 mb-6">Guarda las subastas que te interesen con el corazón ❤️</p>
      <Link to="/subastas" className="px-6 py-3 bg-gradient-to-r from-brand-blue-500 to-brand-purple-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
        Ver subastas disponibles
      </Link>
    </div>
  );

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">{favAuctions.length} subasta{favAuctions.length !== 1 ? 's' : ''} guardada{favAuctions.length !== 1 ? 's' : ''}</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favAuctions.map(a => <AuctionCard key={a.id} auction={a} />)}
      </div>
    </div>
  );
}

// ── Tab Mis datos ──
function ProfileTab({ user }: { user: UserProfile }) {
  const [form, setForm]       = useState({ name: user.name, phone: user.phone ?? '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved]     = useState(false);

  const set = (f: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(v => ({ ...v, [f]: e.target.value }));

  const handleSave = async () => {
    setLoading(true);
    await updateUserProfile({ name: form.name, phone: form.phone || undefined });
    setLoading(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-lg">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 space-y-5">

        {saved && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-xl px-4 py-3 text-sm font-medium">
            <CheckCircle className="w-4 h-4" /> Datos actualizados correctamente
          </div>
        )}

        {/* Email (no editable) */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 text-sm">{user.email}</span>
            <span className="ml-auto text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">No editable</span>
          </div>
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Nombre completo</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={form.name} onChange={set('name')} disabled={!editing}
              className={`input-field pl-9 ${!editing ? 'bg-gray-50 cursor-not-allowed' : ''}`} />
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Teléfono</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="tel" value={form.phone} onChange={set('phone')} disabled={!editing}
              placeholder="+56 9 1234 5678"
              className={`input-field pl-9 ${!editing ? 'bg-gray-50 cursor-not-allowed' : ''}`} />
          </div>
        </div>

        {/* Botones */}
        <div className="pt-2 flex gap-3">
          {editing ? (
            <>
              <button onClick={handleSave} disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-brand-blue-500 to-brand-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70 text-sm">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button onClick={() => { setEditing(false); setForm({ name: user.name, phone: user.phone ?? '' }); }}
                className="px-4 py-2.5 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 text-sm transition-colors">
                Cancelar
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 border border-brand-purple-300 text-brand-purple-500 rounded-xl hover:bg-brand-purple-50 text-sm font-medium transition-colors">
              <Edit2 className="w-4 h-4" /> Editar datos
            </button>
          )}
        </div>

        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Cuenta creada el {new Date(user.createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
