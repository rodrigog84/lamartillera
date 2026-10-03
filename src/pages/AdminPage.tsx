import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Edit2, Trash2, X, Save, LogOut, Search,
  LayoutGrid, Upload, Loader2, AlertCircle, RefreshCw,
} from 'lucide-react';
import { useAuctions } from '../hooks/useAuctions';
import { createAuction, updateAuction, deleteAuction } from '../lib/auctionsApi';
import { uploadFile } from '../lib/storageApi';
import { logout } from '../utils/auth';
import { Auction, AuctionCategory, AuctionStatus, Currency, PropertyType } from '../types';
import { REGIONS, AUCTION_CATEGORIES, CATEGORY_PROPERTY_TYPES } from '../utils/format';
import clsx from 'clsx';

type FormData = Omit<Auction, 'id' | 'createdAt'>;

const EMPTY_FORM: FormData = {
  title: '',
  address: '',
  commune: '',
  region: '',
  category: 'Inmuebles',
  propertyType: 'Casa',
  status: 'Disponible',
  minPrice: 0,
  currency: 'UF',
  guarantee: 0,
  auctionDate: '',
  images: [],
  description: '',
  surface: 0,
  bedrooms: undefined,
  bathrooms: undefined,
  parkingSpaces: undefined,
  occupation: 'Desocupada',
  featured: false,
  externalRegistrationUrl: '',
  documents: {},
};

export default function AdminPage() {
  const navigate = useNavigate();
  const { auctions, loading, error, reload } = useAuctions();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const imgInputRef = useRef<HTMLInputElement>(null);

  const filtered = auctions.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.commune.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setSaveError('');
    setShowForm(true);
  };

  const openEdit = (a: Auction) => {
    setForm({
      title: a.title,
      address: a.address,
      commune: a.commune,
      region: a.region,
      category: a.category ?? 'Inmuebles',
      propertyType: a.propertyType,
      status: a.status,
      minPrice: a.minPrice,
      currency: a.currency,
      guarantee: a.guarantee,
      auctionDate: a.auctionDate,
      images: [...a.images],
      description: a.description,
      surface: a.surface,
      bedrooms: a.bedrooms,
      bathrooms: a.bathrooms,
      parkingSpaces: a.parkingSpaces,
      occupation: a.occupation,
      featured: a.featured,
      externalRegistrationUrl: a.externalRegistrationUrl,
      documents: { ...a.documents },
    });
    setEditingId(a.id);
    setSaveError('');
    setShowForm(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteAuction(id);
      reload();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    try {
      if (editingId) {
        await updateAuction(editingId, form);
      } else {
        await createAuction(form);
      }
      reload();
      setShowForm(false);
    } catch (e) {
      setSaveError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleCategoryChange = (cat: AuctionCategory) => {
    const types = CATEGORY_PROPERTY_TYPES[cat];
    setForm(prev => ({ ...prev, category: cat, propertyType: types[0] as PropertyType }));
  };

  // ── File uploads ──
  const uploadImg = async (file: File) => {
    const tempId = editingId ?? 'new-' + Date.now();
    setUploading(p => ({ ...p, img: true }));
    try {
      const url = await uploadFile(file, 'images', tempId);
      setField('images', [...form.images, url]);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setUploading(p => ({ ...p, img: false }));
    }
  };

  const uploadDoc = async (docKey: keyof NonNullable<FormData['documents']>, file: File) => {
    const tempId = editingId ?? 'new-' + Date.now();
    setUploading(p => ({ ...p, [docKey]: true }));
    try {
      const url = await uploadFile(file, 'docs', tempId);
      setForm(prev => ({ ...prev, documents: { ...prev.documents, [docKey]: url } }));
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setUploading(p => ({ ...p, [docKey]: false }));
    }
  };

  const removeImage = (idx: number) =>
    setField('images', form.images.filter((_, i) => i !== idx));

  const availableTypes = CATEGORY_PROPERTY_TYPES[form.category ?? 'Inmuebles'];

  const DOC_FIELDS: { key: keyof NonNullable<FormData['documents']>; label: string }[] = [
    { key: 'basesDelRemate', label: 'Bases del Remate' },
    { key: 'cdv',            label: 'CDV' },
    { key: 'cav',            label: 'CAV' },
    { key: 'gravamenes',     label: 'Gravámenes' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="hero-gradient px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">Panel de Administración</h1>
            <p className="text-blue-200 text-sm mt-0.5">{auctions.length} subasta{auctions.length !== 1 ? 's' : ''} en total</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={reload} title="Actualizar" className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-white text-brand-purple-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
              <Plus className="w-5 h-5" /> Nueva subasta
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-colors text-sm">
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input type="text" placeholder="Buscar subasta…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple-400" />
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 mb-6 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-brand-purple-400" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <LayoutGrid className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">No hay subastas. ¡Crea la primera!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Subasta', 'Categoría', 'Estado', 'Precio', 'Fecha', 'Acciones'].map(h => (
                        <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(a => (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900 max-w-xs truncate">{a.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{a.commune}, {a.region.split(' - ')[1] ?? a.region}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2 py-1 bg-brand-blue-50 text-brand-blue-700 text-xs font-medium rounded-full">{a.category ?? 'Inmuebles'}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={clsx('px-2.5 py-1 rounded-full text-xs font-medium', a.status === 'Disponible' ? 'bg-green-100 text-green-700' : a.status === 'Adjudicada' ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-700')}>
                            {a.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-brand-purple-600">{a.minPrice.toLocaleString('es-CL')} {a.currency}</td>
                        <td className="px-5 py-4 text-gray-500">{a.auctionDate}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(a)} className="p-2 text-gray-500 hover:text-brand-blue-600 hover:bg-brand-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(a.id, a.title)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Form modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-8">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Editar subasta' : 'Nueva subasta'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
              {saveError && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"><AlertCircle className="w-4 h-4" />{saveError}</div>}

              {/* Basic */}
              <div>
                <h3 className="section-title">Información básica</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="label">Título *</label>
                    <input className="input" value={form.title} onChange={e => setField('title', e.target.value)} required />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Categoría *</label>
                      <select className="input" value={form.category} onChange={e => handleCategoryChange(e.target.value as AuctionCategory)}>
                        {AUCTION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Tipo de bien *</label>
                      <select className="input" value={form.propertyType} onChange={e => setField('propertyType', e.target.value as PropertyType)}>
                        {availableTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">Descripción</label>
                    <textarea className="input min-h-[100px] resize-y" value={form.description} onChange={e => setField('description', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="section-title">Ubicación</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="label">Dirección *</label>
                    <input className="input" value={form.address} onChange={e => setField('address', e.target.value)} required />
                  </div>
                  <div>
                    <label className="label">Comuna *</label>
                    <input className="input" value={form.commune} onChange={e => setField('commune', e.target.value)} required />
                  </div>
                  <div>
                    <label className="label">Región *</label>
                    <select className="input" value={form.region} onChange={e => setField('region', e.target.value)} required>
                      <option value="">Seleccionar…</option>
                      {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Auction details */}
              <div>
                <h3 className="section-title">Detalles del remate</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Precio mínimo *</label>
                    <input type="number" className="input" value={form.minPrice || ''} onChange={e => setField('minPrice', +e.target.value)} required min={0} />
                  </div>
                  <div>
                    <label className="label">Moneda *</label>
                    <select className="input" value={form.currency} onChange={e => setField('currency', e.target.value as Currency)}>
                      <option value="UF">UF</option>
                      <option value="CLP">CLP</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Garantía</label>
                    <input type="number" className="input" value={form.guarantee || ''} onChange={e => setField('guarantee', +e.target.value)} min={0} />
                  </div>
                  <div>
                    <label className="label">Fecha remate *</label>
                    <input type="date" className="input" value={form.auctionDate} onChange={e => setField('auctionDate', e.target.value)} required />
                  </div>
                  <div>
                    <label className="label">Estado *</label>
                    <select className="input" value={form.status} onChange={e => setField('status', e.target.value as AuctionStatus)}>
                      {(['Disponible', 'Próximamente', 'Adjudicada'] as AuctionStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Ocupación</label>
                    <select className="input" value={form.occupation} onChange={e => setField('occupation', e.target.value as FormData['occupation'])}>
                      {['Desocupada', 'Ocupada', 'Arrendada'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Characteristics */}
              <div>
                <h3 className="section-title">Características</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="label">Superficie m²</label>
                    <input type="number" className="input" value={form.surface || ''} onChange={e => setField('surface', +e.target.value)} min={0} />
                  </div>
                  <div>
                    <label className="label">Dormitorios</label>
                    <input type="number" className="input" value={form.bedrooms ?? ''} onChange={e => setField('bedrooms', e.target.value ? +e.target.value : undefined)} min={0} />
                  </div>
                  <div>
                    <label className="label">Baños</label>
                    <input type="number" className="input" value={form.bathrooms ?? ''} onChange={e => setField('bathrooms', e.target.value ? +e.target.value : undefined)} min={0} />
                  </div>
                  <div>
                    <label className="label">Estac.</label>
                    <input type="number" className="input" value={form.parkingSpaces ?? ''} onChange={e => setField('parkingSpaces', e.target.value ? +e.target.value : undefined)} min={0} />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <h3 className="section-title">Imágenes</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input ref={imgInputRef} type="file" accept="image/*" className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) uploadImg(f); e.target.value = ''; }} />
                    <button type="button" onClick={() => imgInputRef.current?.click()}
                      disabled={uploading.img}
                      className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-brand-purple-300 text-brand-purple-600 rounded-xl hover:bg-brand-purple-50 transition-colors text-sm font-medium disabled:opacity-50">
                      {uploading.img ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {uploading.img ? 'Subiendo…' : 'Subir imagen'}
                    </button>
                    <input type="text" className="input flex-1 text-sm" placeholder="… o pegar URL de imagen"
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); const v = (e.target as HTMLInputElement).value.trim(); if (v) { setField('images', [...form.images, v]); (e.target as HTMLInputElement).value = ''; } } }} />
                  </div>
                  {form.images.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative group">
                          <img src={img} alt="" className="w-20 h-16 object-cover rounded-xl border border-gray-200" />
                          <button type="button" onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Docs */}
              <div>
                <h3 className="section-title">Documentación legal (PDF)</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {DOC_FIELDS.map(({ key, label }) => (
                    <div key={key}>
                      <label className="label">{label}</label>
                      <div className="flex gap-2">
                        <input type="text" className="input flex-1 text-sm" placeholder="URL del PDF…"
                          value={form.documents?.[key] ?? ''}
                          onChange={e => setForm(prev => ({ ...prev, documents: { ...prev.documents, [key]: e.target.value } }))} />
                        <DocUploadButton
                          uploading={!!uploading[key]}
                          onChange={f => uploadDoc(key, f)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registration URL */}
              <div>
                <h3 className="section-title">Enlace externo</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="label">URL de inscripción</label>
                    <input type="url" className="input" value={form.externalRegistrationUrl} onChange={e => setField('externalRegistrationUrl', e.target.value)} placeholder="https://…" />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="featured" checked={form.featured} onChange={e => setField('featured', e.target.checked)} className="w-4 h-4 accent-brand-purple-500" />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700 cursor-pointer">Marcar como destacada en el home</label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancelar</button>
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Guardando…' : (editingId ? 'Guardar cambios' : 'Crear subasta')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function DocUploadButton({ uploading, onChange }: { uploading: boolean; onChange: (f: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input ref={ref} type="file" accept="application/pdf" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onChange(f); e.target.value = ''; }} />
      <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
        className="p-2.5 border border-dashed border-gray-300 rounded-xl hover:border-brand-purple-300 hover:bg-brand-purple-50 transition-colors disabled:opacity-50">
        {uploading ? <Loader2 className="w-4 h-4 animate-spin text-brand-purple-500" /> : <Upload className="w-4 h-4 text-gray-500" />}
      </button>
    </>
  );
}
