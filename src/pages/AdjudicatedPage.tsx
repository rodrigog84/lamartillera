import { useMemo, useState } from 'react';
import { Search, Trophy, X } from 'lucide-react';
import { getAuctions } from '../data/auctions';
import AuctionCard from '../components/AuctionCard';
import { AUCTION_CATEGORIES } from '../utils/format';
import { AuctionCategory } from '../types';

export default function AdjudicatedPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AuctionCategory | ''>('');

  const adjudicados = useMemo(() => {
    let result = getAuctions().filter(a => a.status === 'Adjudicada');

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.commune.toLowerCase().includes(q) ||
        a.region.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter(a => (a.category ?? 'Inmuebles') === selectedCategory);
    }

    return result.sort((a, b) => b.auctionDate.localeCompare(a.auctionDate));
  }, [search, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="hero-gradient pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-300" />
            </div>
            <span className="text-blue-200 font-semibold text-sm uppercase tracking-wider">Historial</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Remates Adjudicados</h1>
          <p className="text-blue-100 text-lg">
            {adjudicados.length} remate{adjudicados.length !== 1 ? 's' : ''} finalizados exitosamente
          </p>

          {/* Search */}
          <div className="mt-6 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar en el historial…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-base shadow-lg"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="mt-6 flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-5 py-2.5 rounded-t-xl font-semibold text-sm transition-all ${selectedCategory === '' ? 'bg-white text-brand-purple-700' : 'bg-white/20 text-white hover:bg-white/30'}`}
            >
              Todos
            </button>
            {AUCTION_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                className={`px-5 py-2.5 rounded-t-xl font-semibold text-sm transition-all ${selectedCategory === cat ? 'bg-white text-brand-purple-700' : 'bg-white/20 text-white hover:bg-white/30'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {adjudicados.length > 0 ? (
          <>
            {/* Info banner */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-8 text-sm text-amber-800">
              <Trophy className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p>
                Estos bienes ya fueron adjudicados y <strong>no están disponibles para participar</strong>.
                Este historial es de referencia para conocer los tipos de bienes y precios alcanzados en remates anteriores.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {adjudicados.map(auction => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Trophy className="w-9 h-9 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Sin resultados</h3>
            <p className="text-gray-400">No hay remates adjudicados que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
