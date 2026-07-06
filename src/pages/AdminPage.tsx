import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Pencil, Trash2, Eye, Search, X, Save,
  ChevronLeft, LayoutGrid, CheckCircle, AlertTriangle,
} from 'lucide-react';
import { getAuctions, addAuction, updateAuction, deleteAuction } from '../data/auctions';
import { Auction, PropertyType, AuctionStatus, Currency } from '../types';
import { formatPrice, formatDate, PROPERTY_TYPES, REGIONS, OCCUPATION_TYPES } from '../utils/format';
import clsx from 'clsx';

type AdminView = 'list' | 'add' | 'edit';

const EMPTY_FORM: Omit<Auction, 'id' | 'createdAt'> = {
  title: '',
  address: '',
  commune: '',
  region: 'RM - Metropolitana',
  propertyType: 'Departamento',
  status: 'Disponible',
  minPrice: 0,
  currency: 'UF',
  guarantee: 0,
  auctionDate: '',
  images: [''],
  description: '',
  surface: 0,
  bedrooms: undefined,
  bathrooms: undefined,
  parkingSpaces: undefined,
  occupation: 'Desocupada',
  featured: false,
  externalRegistrationUrl: 'https://lamartillera.cl/registro',
};

export default function AdminPage() {
  const [view, setView] = useState<AdminView>('list');
  const [auctions, setAuctions] = useState(getAuctions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Auction, 'id' | 'createdAt'>>(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const refresh = () => setAuctions(getAuctions());

  const filtered = auctions.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.commune.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setView('add');
  };

  const openEdit = (a: Auction) => {
    setForm({
      title: a.title, address: a.address, commune: a.commune, region: a.region,
      propertyType: a.propertyType, status: a.status, minPrice: a.minPrice,
      currency: a.currency, guarantee: a.guarantee, auctionDate: a.auctionDate,
      images: a.images.length > 0 ? a.images : [''],
      description: a.description, surface: a.surface,
      bedrooms: a.bedrooms, bathrooms: a.bathrooms, parkingSpaces: a.parkingSpaces,
      occupation: a.occupation, featured: a.featured,
      externalRegistrationUrl: a.externalRegistrationUrl,
    });
    setEditingId(a.id);
    setView('edit');
  };

  const handleSave = () => {
    const cleanForm = {
      ...form,
      images: form.images.filter(img => img.trim() !== ''),
      minPrice: Number(form.minPrice),
      guarantee: Number(form.guarantee),
      surface: Number(form.surface),
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      parkingSpaces: form.parkingSpaces ? Number(form.parkingSpaces) : undefined,
    };

    if (view === 'add') {
      addAuction(cleanForm);
    } else if (editingId) {
      updateAuction(editingId, cleanForm);
    }
    refresh();
    setSaved(true);
    setTimeout(() => { setSaved(false); setView('list'); }, 1200);
  };

  const confirmDelete = (id: string) => {
    deleteAuction(id);
    setDeleteTarget(null);
    refresh();
  };

  const setField = <K extends keyof typeof form>(key: K, val: typeof form[K]) => {
    setForm(f => ({ ...f, [key]: val }));
  };

  const updateImage = (idx: number, val: string) => {
    const imgs = [...form.images];
    imgs[idx] = val;
    setForm(f => ({ ...f, images: imgs }));
  };

  const addImageField = () => setForm(f => ({ ...f, images: [...f.images, ''] }));
  const removeImageField = (idx: number) => {
    const imgs = form.images.filter((_, i) => i !== idx);
    setForm(f => ({ ...f, images: imgs.length > 0 ? imgs : [''] }));
  };

  /* ── List view ── */
  if (view === 'list') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="hero-gradient pt-24 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Link to="/" className="text-white/60 hover:text-white text-sm flex items-center gap-1">
                    <ChevronLeft className="w-4 h-4" /> Sitio público
                  </Link>
                </div>
                <h1 className="text-3xl font-black text-white">Panel de Administración</h1>
                <p className="text-blue-200 mt-1">{auctions.length} subasta{auctions.length !== 1 ? 's' : ''} en total</p>
              </div>
              <button onClick={openAdd} className="flex items-center gap-2 px-5 py-3 bg-white text-brand-purple-600 font-bold rounded-2xl hover:bg-blue-50 transition-colors shadow-lg">
                <Plus className="w-5 h-5" /> Nueva subasta
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total', value: auctions.length, color: 'border-brand-purple-200' },
              { label: 'Disponibles', value: auctions.filter(a => a.status === 'Disponible').length, color: 'border-green-200' },
              { label: 'Próximamente', value: auctions.filter(a => a.status === 'Próximamente').length, color: 'border-amber-200' },
              { label: 'Adjudicadas', value: auctions.filter(a => a.status === 'Adjudicada').length, color: 'border-gray-200' },
            ].map(s => (
              <div key={s.label} className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${s.color}`}>
                <p className="text-3xl font-black text-gradient">{s.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar subasta…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-12"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Propiedad</th>
                    <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Tipo</th>
                    <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Fecha</th>
                    <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio mín.</th>
                    <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Estado</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(auction => (
                    <tr key={auction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                            {auction.images[0] ? (
                              <img src={auction.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <LayoutGrid className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm line-clamp-1 max-w-[200px]">{auction.title}</p>
                            <p className="text-xs text-gray-400">{auction.commune}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="badge bg-gray-100 text-gray-600">{auction.propertyType}</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 hidden lg:table-cell">{formatDate(auction.auctionDate)}</td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-sm text-gradient">{formatPrice(auction)}</span>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className={clsx(
                          'badge',
                          auction.status === 'Disponible' ? 'bg-green-100 text-green-700' :
                          auction.status === 'Adjudicada' ? 'bg-gray-100 text-gray-600' :
                          'bg-amber-100 text-amber-700'
                        )}>
                          {auction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/subastas/${auction.id}`}
                            title="Ver"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openEdit(auction)}
                            title="Editar"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-brand-purple-50 hover:text-brand-purple-600 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(auction.id)}
                            title="Eliminar"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-gray-400">
                        <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-medium">Sin resultados</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Delete confirm modal */}
        {deleteTarget && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">¿Eliminar subasta?</h3>
              <p className="text-gray-500 text-center text-sm mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button onClick={() => confirmDelete(deleteTarget)} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── Add / Edit form ── */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hero-gradient pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => setView('list')} className="flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Volver al listado
          </button>
          <h1 className="text-3xl font-black text-white">
            {view === 'add' ? 'Nueva subasta' : 'Editar subasta'}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {saved && (
          <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl">
            <CheckCircle className="w-5 h-5" />
            <p className="font-semibold">¡Guardado correctamente!</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
          {/* Basic info */}
          <FormSection title="Información básica">
            <div>
              <label className="label">Título de la propiedad *</label>
              <input value={form.title} onChange={e => setField('title', e.target.value)} className="input" placeholder="Ej: Departamento céntrico con vista panorámica" />
            </div>
            <div>
              <label className="label">Descripción *</label>
              <textarea value={form.description} onChange={e => setField('description', e.target.value)} rows={4} className="input resize-none" placeholder="Describe la propiedad…" />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label">Tipo de propiedad</label>
                <select value={form.propertyType} onChange={e => setField('propertyType', e.target.value as PropertyType)} className="input">
                  {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Estado</label>
                <select value={form.status} onChange={e => setField('status', e.target.value as AuctionStatus)} className="input">
                  {(['Disponible', 'Próximamente', 'Adjudicada'] as AuctionStatus[]).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </FormSection>

          {/* Location */}
          <FormSection title="Ubicación">
            <div>
              <label className="label">Dirección completa *</label>
              <input value={form.address} onChange={e => setField('address', e.target.value)} className="input" placeholder="Av. Providencia 1234, Depto. 801" />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label">Comuna *</label>
                <input value={form.commune} onChange={e => setField('commune', e.target.value)} className="input" placeholder="Providencia" />
              </div>
              <div>
                <label className="label">Región</label>
                <select value={form.region} onChange={e => setField('region', e.target.value)} className="input">
                  {REGIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </FormSection>

          {/* Price & date */}
          <FormSection title="Precio y fecha">
            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label className="label">Moneda</label>
                <select value={form.currency} onChange={e => setField('currency', e.target.value as Currency)} className="input">
                  <option value="UF">UF</option>
                  <option value="CLP">CLP ($)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label">Precio mínimo *</label>
                <input type="number" value={form.minPrice || ''} onChange={e => setField('minPrice', Number(e.target.value))} className="input" placeholder="0" min="0" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label">Garantía (CLP) *</label>
                <input type="number" value={form.guarantee || ''} onChange={e => setField('guarantee', Number(e.target.value))} className="input" placeholder="4000000" min="0" />
              </div>
              <div>
                <label className="label">Fecha de subasta *</label>
                <input type="date" value={form.auctionDate} onChange={e => setField('auctionDate', e.target.value)} className="input" />
              </div>
            </div>
          </FormSection>

          {/* Characteristics */}
          <FormSection title="Características">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="label">Superficie (m²) *</label>
                <input type="number" value={form.surface || ''} onChange={e => setField('surface', Number(e.target.value))} className="input" min="0" />
              </div>
              <div>
                <label className="label">Dormitorios</label>
                <input type="number" value={form.bedrooms ?? ''} onChange={e => setField('bedrooms', e.target.value ? Number(e.target.value) : undefined)} className="input" min="0" />
              </div>
              <div>
                <label className="label">Baños</label>
                <input type="number" value={form.bathrooms ?? ''} onChange={e => setField('bathrooms', e.target.value ? Number(e.target.value) : undefined)} className="input" min="0" />
              </div>
              <div>
                <label className="label">Estacionamientos</label>
                <input type="number" value={form.parkingSpaces ?? ''} onChange={e => setField('parkingSpaces', e.target.value ? Number(e.target.value) : undefined)} className="input" min="0" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label">Ocupación</label>
                <select value={form.occupation} onChange={e => setField('occupation', e.target.value as typeof form.occupation)} className="input">
                  {OCCUPATION_TYPES.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={e => setField('featured', e.target.checked)}
                  className="w-5 h-5 accent-brand-purple-500 rounded cursor-pointer"
                />
                <label htmlFor="featured" className="font-medium text-gray-700 cursor-pointer">
                  Marcar como destacada
                </label>
              </div>
            </div>
          </FormSection>

          {/* Images */}
          <FormSection title="Imágenes (URLs)">
            <div className="space-y-3">
              {form.images.map((img, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    value={img}
                    onChange={e => updateImage(idx, e.target.value)}
                    className="input flex-1"
                    placeholder="https://images.unsplash.com/..."
                  />
                  {form.images.length > 1 && (
                    <button onClick={() => removeImageField(idx)} className="px-3 py-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addImageField} className="flex items-center gap-2 text-sm text-brand-purple-500 hover:text-brand-purple-700 font-medium transition-colors">
                <Plus className="w-4 h-4" /> Agregar otra imagen
              </button>
            </div>
          </FormSection>

          {/* Registration URL */}
          <FormSection title="Enlace externo">
            <div>
              <label className="label">URL de inscripción (registro externo)</label>
              <input
                type="url"
                value={form.externalRegistrationUrl}
                onChange={e => setField('externalRegistrationUrl', e.target.value)}
                className="input"
                placeholder="https://lamartillera.cl/registro"
              />
              <p className="mt-1.5 text-xs text-gray-400">Este enlace llevará al usuario a la página de registro del martillero.</p>
            </div>
          </FormSection>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button onClick={() => setView('list')} className="px-6 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!form.title || !form.address || !form.commune || !form.auctionDate}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-brand-blue-500 to-brand-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Save className="w-5 h-5" />
              {view === 'add' ? 'Crear subasta' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-bold text-lg text-gray-900 mb-5 pb-3 border-b border-gray-100">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
