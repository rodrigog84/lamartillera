import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { getAuctions } from '../data/auctions';
import { PROPERTY_TYPES, REGIONS } from '../utils/format';
import AuctionCard from '../components/AuctionCard';
import { Auction } from '../types';

type SortOption = 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc' | 'newest';

export default function AuctionsPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Auction['status'] | ''>('');
  const [sortBy, setSortBy] = useState<SortOption>('date-asc');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Apply type from query param
  useEffect(() => {
    const tipo = searchParams.get('tipo');
    if (tipo) {
      const matched = PROPERTY_TYPES.find(t =>
        t.toLowerCase() === tipo.toLowerCase() ||
        t.toLowerCase().startsWith(tipo.toLowerCase().slice(0, -1))
      );
      if (matched) setSelectedTypes([matched]);
    }
  }, [searchParams]);

  const allAuctions = getAuctions();

  const filtered = useMemo(() => {
    let result = [...allAuctions];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.commune.toLowerCase().includes(q) ||
        a.region.toLowerCase().includes(q) ||
        a.address.toLowerCase().includes(q)
      );
    }

    if (selectedTypes.length > 0) {
      result = result.filter(a => selectedTypes.includes(a.propertyType));
    }

    if (selectedRegion) {
      result = result.filter(a => a.region === selectedRegion);
    }

    if (selectedStatus) {
      result = result.filter(a => a.status === selectedStatus);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc': return a.auctionDate.localeCompare(b.auctionDate);
        case 'date-desc': return b.auctionDate.localeCompare(a.auctionDate);
        case 'price-asc': return a.minPrice - b.minPrice;
        case 'price-desc': return b.minPrice - a.minPrice;
        case 'newest': return b.createdAt.localeCompare(a.createdAt);
        default: return 0;
      }
    });

    return result;
  }, [allAuctions, search, selectedTypes, selectedRegion, selectedStatus, sortBy]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedTypes([]);
    setSelectedRegion('');
    setSelectedStatus('');
  };

  const hasFilters = search || selectedTypes.length > 0 || selectedRegion || selectedStatus;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="hero-gradient pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-white mb-3">Subastas disponibles</h1>
          <p className="text-blue-100 text-lg">
            {filtered.length} propiedad{filtered.length !== 1 ? 'es' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
          </p>

          {/* Main search */}
          <div className="mt-6 relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por ciudad, región, dirección…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-base shadow-lg"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* ── Sidebar filters (desktop) ── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900">Filtros</h2>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-brand-purple-500 hover:underline font-medium">
                    Limpiar
                  </button>
                )}
              </div>

              {/* Status */}
              <FilterSection title="Estado">
                {(['Disponible', 'Próximamente', 'Adjudicada'] as Auction['status'][]).map(s => (
                  <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="status"
                      checked={selectedStatus === s}
                      onChange={() => setSelectedStatus(selectedStatus === s ? '' : s)}
                      className="accent-brand-purple-500"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">{s}</span>
                  </label>
                ))}
              </FilterSection>

              {/* Property type */}
              <FilterSection title="Tipo de propiedad">
                {PROPERTY_TYPES.map(type => (
                  <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleType(type)}
                      className="accent-brand-purple-500"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">{type}</span>
                  </label>
                ))}
              </FilterSection>

              {/* Region */}
              <FilterSection title="Región">
                <select
                  value={selectedRegion}
                  onChange={e => setSelectedRegion(e.target.value)}
                  className="input text-sm"
                >
                  <option value="">Todas las regiones</option>
                  {REGIONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </FilterSection>
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <button
                onClick={() => setFiltersOpen(v => !v)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
                {hasFilters && (
                  <span className="w-5 h-5 bg-brand-purple-500 text-white text-xs rounded-full flex items-center justify-center">
                    {[search, ...selectedTypes, selectedRegion, selectedStatus].filter(Boolean).length}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <label className="text-sm text-gray-500">Ordenar:</label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as SortOption)}
                    className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-purple-500 cursor-pointer"
                  >
                    <option value="date-asc">Fecha (próximas primero)</option>
                    <option value="date-desc">Fecha (lejanas primero)</option>
                    <option value="price-asc">Precio (menor a mayor)</option>
                    <option value="price-desc">Precio (mayor a menor)</option>
                    <option value="newest">Más recientes</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Mobile filters panel */}
            {filtersOpen && (
              <div className="lg:hidden bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900">Filtros</h2>
                  <div className="flex items-center gap-3">
                    {hasFilters && (
                      <button onClick={clearFilters} className="text-xs text-brand-purple-500 font-medium">Limpiar</button>
                    )}
                    <button onClick={() => setFiltersOpen(false)}>
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Estado</p>
                    <div className="space-y-2">
                      {(['Disponible', 'Próximamente', 'Adjudicada'] as Auction['status'][]).map(s => (
                        <label key={s} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="status-m" checked={selectedStatus === s} onChange={() => setSelectedStatus(selectedStatus === s ? '' : s)} className="accent-brand-purple-500" />
                          <span className="text-sm">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tipo</p>
                    <div className="space-y-2">
                      {PROPERTY_TYPES.map(type => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => toggleType(type)} className="accent-brand-purple-500" />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Región</p>
                    <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)} className="input text-sm">
                      <option value="">Todas</option>
                      {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedTypes.map(t => (
                  <button key={t} onClick={() => toggleType(t)} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-purple-100 text-brand-purple-700 rounded-full text-xs font-medium hover:bg-brand-purple-200 transition-colors">
                    {t} <X className="w-3.5 h-3.5" />
                  </button>
                ))}
                {selectedRegion && (
                  <button onClick={() => setSelectedRegion('')} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue-100 text-brand-blue-700 rounded-full text-xs font-medium hover:bg-brand-blue-200 transition-colors">
                    {selectedRegion} <X className="w-3.5 h-3.5" />
                  </button>
                )}
                {selectedStatus && (
                  <button onClick={() => setSelectedStatus('')} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors">
                    {selectedStatus} <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(auction => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Search className="w-9 h-9 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Sin resultados</h3>
                <p className="text-gray-400 mb-6">No encontramos subastas que coincidan con tu búsqueda.</p>
                <button onClick={clearFilters} className="btn-outline">Limpiar filtros</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{title}</h3>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}
