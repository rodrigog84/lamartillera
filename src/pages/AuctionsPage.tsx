import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown, Building2, Car, Package, Loader2 } from 'lucide-react';
import { useAuctions } from '../hooks/useAuctions';
import { CATEGORY_PROPERTY_TYPES, REGIONS, AUCTION_CATEGORIES } from '../utils/format';
import AuctionCard from '../components/AuctionCard';
import { Auction, AuctionCategory } from '../types';

type SortOption = 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc' | 'newest';

const PRICE_RANGES = [
  { label: 'Cualquier precio',          min: 0,    max: Infinity },
  { label: 'Hasta UF 1.000 / $10M',     min: 0,    max: 1000 },
  { label: 'UF 1.000 – 3.000',          min: 1000, max: 3000 },
  { label: 'UF 3.000 – 8.000',          min: 3000, max: 8000 },
  { label: 'Más de UF 8.000 / $50M+',   min: 8000, max: Infinity },
];

const CATEGORY_ICONS: Record<AuctionCategory, React.ReactNode> = {
  'Inmuebles':     <Building2 className="w-5 h-5" />,
  'Vehículos':     <Car className="w-5 h-5" />,
  'Bienes Muebles': <Package className="w-5 h-5" />,
};

export default function AuctionsPage() {
  const [searchParams] = useSearchParams();
  const { auctions, loading, error } = useAuctions();

  const [search, setSearch]                   = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AuctionCategory | ''>('');
  const [selectedTypes, setSelectedTypes]     = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion]   = useState('');
  const [selectedStatus, setSelectedStatus]   = useState<Auction['status'] | ''>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [sortBy, setSortBy]                   = useState<SortOption>('date-asc');
  const [filtersOpen, setFiltersOpen]           = useState(false);

  useEffect(() => {
    const tipo = searchParams.get('tipo');
    if (tipo) {
      const cat = AUCTION_CATEGORIES.find(c => c === tipo);
      if (cat) setSelectedCategory(cat);
    }
  }, [searchParams]);

  const handleCategoryChange = (cat: AuctionCategory | '') => {
    setSelectedCategory(cat);
    setSelectedTypes([]);
  };

  const availableTypes = selectedCategory ? CATEGORY_PROPERTY_TYPES[selectedCategory] : [];

  const filtered = useMemo(() => {
    let result = auctions.filter(a => a.status !== 'Adjudicada');

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.commune.toLowerCase().includes(q) ||
        a.region.toLowerCase().includes(q) ||
        a.address.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) result = result.filter(a => (a.category ?? 'Inmuebles') === selectedCategory);
    if (selectedTypes.length > 0) result = result.filter(a => selectedTypes.includes(a.propertyType));
    if (selectedRegion) result = result.filter(a => a.region === selectedRegion);
    if (selectedStatus) result = result.filter(a => a.status === selectedStatus);
    if (selectedPriceRange > 0) {
      const range = PRICE_RANGES[selectedPriceRange];
      result = result.filter(a => {
        const price = a.currency === 'UF' ? a.minPrice : a.minPrice / 38000;
        return price >= range.min && price <= range.max;
      });
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':  return a.auctionDate.localeCompare(b.auctionDate);
        case 'date-desc': return b.auctionDate.localeCompare(a.auctionDate);
        case 'price-asc': return a.minPrice - b.minPrice;
        case 'price-desc':return b.minPrice - a.minPrice;
        case 'newest':    return b.createdAt.localeCompare(a.createdAt);
        default: return 0;
      }
    });
    return result;
  }, [auctions, search, selectedCategory, selectedTypes, selectedRegion, selectedStatus, selectedPriceRange, sortBy]);

  const toggleType = (type: string) =>
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);

  const clearFilters = () => {
    setSearch(''); setSelectedCategory(''); setSelectedTypes([]);
    setSelectedRegion(''); setSelectedStatus(''); setSelectedPriceRange(0);
  };

  const hasFilters = search || selectedCategory || selectedTypes.length > 0 || selectedRegion || selectedStatus || selectedPriceRange > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="hero-gradient pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-white mb-3">Subastas disponibles</h1>
          <p className="text-blue-100 text-lg">
            {loading ? 'Cargando…' : `${filtered.length} bien${filtered.length !== 1 ? 'es' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`}
          </p>

          <div className="mt-6 relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input type="text" placeholder="Buscar por nombre, ciudad, región…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-base shadow-lg" />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="mt-6 flex gap-2 flex-wrap">
            <button onClick={() => handleCategoryChange('')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl font-semibold text-sm transition-all ${selectedCategory === '' ? 'bg-white text-brand-purple-700' : 'bg-white/20 text-white hover:bg-white/30'}`}>
              Todos
            </button>
            {AUCTION_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => handleCategoryChange(cat)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl font-semibold text-sm transition-all ${selectedCategory === cat ? 'bg-white text-brand-purple-700' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                {CATEGORY_ICONS[cat]}{cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900">Filtros</h2>
                {hasFilters && <button onClick={clearFilters} className="text-xs text-brand-purple-500 hover:underline font-medium">Limpiar</button>}
              </div>

              <FilterSection title="Estado">
                {(['Disponible', 'Próximamente'] as Auction['status'][]).map(s => (
                  <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="radio" name="status" checked={selectedStatus === s} onChange={() => setSelectedStatus(selectedStatus === s ? '' : s)} className="accent-brand-purple-500" />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">{s}</span>
                  </label>
                ))}
              </FilterSection>

              {selectedCategory && availableTypes.length > 0 && (
                <FilterSection title="Tipo">
                  {availableTypes.map(type => (
                    <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => toggleType(type)} className="accent-brand-purple-500" />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">{type}</span>
                    </label>
                  ))}
                </FilterSection>
              )}

              <FilterSection title="Rango de precio">
                {PRICE_RANGES.map((range, i) => (
                  <label key={i} className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="radio" name="price" checked={selectedPriceRange === i} onChange={() => setSelectedPriceRange(i)} className="accent-brand-purple-500" />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">{range.label}</span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Región">
                <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)} className="input text-sm">
                  <option value="">Todas las regiones</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </FilterSection>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-6">
              <button onClick={() => setFiltersOpen(v => !v)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
                <SlidersHorizontal className="w-4 h-4" /> Filtros
                {hasFilters && <span className="w-5 h-5 bg-brand-purple-500 text-white text-xs rounded-full flex items-center justify-center">{[search, selectedCategory, ...selectedTypes, selectedRegion, selectedStatus].filter(Boolean).length}</span>}
              </button>
              <div className="flex items-center gap-2 ml-auto">
                <label className="text-sm text-gray-500">Ordenar:</label>
                <div className="relative">
                  <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)}
                    className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-purple-500 cursor-pointer">
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

            {/* Active chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory && <button onClick={() => handleCategoryChange('')} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-purple-500 text-white rounded-full text-xs font-medium hover:bg-brand-purple-600 transition-colors">{selectedCategory} <X className="w-3.5 h-3.5" /></button>}
                {selectedTypes.map(t => <button key={t} onClick={() => toggleType(t)} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-purple-100 text-brand-purple-700 rounded-full text-xs font-medium">{t} <X className="w-3.5 h-3.5" /></button>)}
                {selectedRegion && <button onClick={() => setSelectedRegion('')} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue-100 text-brand-blue-700 rounded-full text-xs font-medium">{selectedRegion} <X className="w-3.5 h-3.5" /></button>}
                {selectedStatus && <button onClick={() => setSelectedStatus('')} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">{selectedStatus} <X className="w-3.5 h-3.5" /></button>}
                {selectedPriceRange > 0 && <button onClick={() => setSelectedPriceRange(0)} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">{PRICE_RANGES[selectedPriceRange].label} <X className="w-3.5 h-3.5" /></button>}
              </div>
            )}

            {/* Mobile filter panel */}
            {filtersOpen && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setFiltersOpen(false)}>
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-gray-900">Filtros</h2>
                    <button onClick={() => setFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
                  </div>
                  {hasFilters && <button onClick={() => { clearFilters(); setFiltersOpen(false); }} className="text-xs text-brand-purple-500 hover:underline font-medium mb-4 block">Limpiar filtros</button>}
                  <FilterSection title="Estado">
                    {(['Disponible', 'Próximamente'] as Auction['status'][]).map(s => (
                      <label key={s} className="flex items-center gap-2.5 cursor-pointer">
                        <input type="radio" name="mstatus" checked={selectedStatus === s} onChange={() => setSelectedStatus(selectedStatus === s ? '' : s)} className="accent-brand-purple-500" />
                        <span className="text-sm text-gray-600">{s}</span>
                      </label>
                    ))}
                  </FilterSection>
                  <FilterSection title="Rango de precio">
                    {PRICE_RANGES.map((range, i) => (
                      <label key={i} className="flex items-center gap-2.5 cursor-pointer">
                        <input type="radio" name="mprice" checked={selectedPriceRange === i} onChange={() => setSelectedPriceRange(i)} className="accent-brand-purple-500" />
                        <span className="text-sm text-gray-600">{range.label}</span>
                      </label>
                    ))}
                  </FilterSection>
                  <FilterSection title="Región">
                    <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)} className="input text-sm">
                      <option value="">Todas las regiones</option>
                      {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </FilterSection>
                  <button onClick={() => setFiltersOpen(false)} className="w-full mt-4 btn-primary">Aplicar filtros</button>
                </div>
              </div>
            )}

            {/* Error */}
            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 mb-6 text-sm">{error}</div>}

            {/* Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="w-10 h-10 animate-spin text-brand-purple-400" />
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(auction => <AuctionCard key={auction.id} auction={auction} />)}
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
