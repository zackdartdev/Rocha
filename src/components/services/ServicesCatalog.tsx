import React, { useState, useMemo } from 'react';
import { Search, Heart, Clock, ChevronRight, Info, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatBRL } from '../../utils/rules';
import { ServiceCategory, ServiceItem } from '../../types';

export const ServicesCatalog: React.FC = () => {
  const { 
    services, 
    toggleFavorite, 
    user, 
    setSelectedServiceForBooking, 
    setIsBookingModalOpen 
  } = useApp();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'todos'>('todos');
  const [detailService, setDetailService] = useState<ServiceItem | null>(null);

  const categories = [
    { id: 'todos', label: 'Todos os Serviços' },
    { id: 'cortes', label: 'Cortes' },
    { id: 'barba', label: 'Barba' },
    { id: 'acabamento', label: 'Acabamento' },
    { id: 'tratamentos', label: 'Tratamentos' },
  ];

  const filtered = useMemo(() => {
    return services.filter((s) => {
      if (!s.isActive) return false;
      const matchCat = activeCategory === 'todos' || s.category === activeCategory;
      const matchQuery =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [services, activeCategory, search]);

  const handleBook = (srv: ServiceItem) => {
    setSelectedServiceForBooking(srv);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-4 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Catálogo de Serviços</h2>
          <p className="text-xs text-[#A3A3A3]">
            Tabela oficial de preços e tempos estimados de atendimento da Barbershop Rocha.
          </p>
        </div>
        <span className="text-xs text-[#F5C542] font-semibold">
          14 serviços especializados
        </span>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A3A3]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar por corte, barba, pigmentação, nevou..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#141414] border border-white/10 text-white placeholder-[#A3A3A3] focus:outline-none focus:border-[#F5C542] transition-colors text-xs sm:text-sm"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as ServiceCategory | 'todos')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#F5C542] text-[#080808] font-bold shadow-md shadow-[#F5C542]/20'
                  : 'bg-white/5 border border-white/10 text-[#A3A3A3] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((srv) => {
          const isFav = user.favoriteServiceIds.includes(srv.id);
          return (
            <div
              key={srv.id}
              className="rounded-3xl glass-surface border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-[#F5C542]/50 transition-all duration-300"
            >
              <div className="relative h-40 w-full overflow-hidden bg-neutral-900">
                <img
                  src={srv.imageUrl}
                  alt={srv.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white/90 border border-white/10">
                    {srv.categoryLabel}
                  </span>
                </div>

                {/* Favorite Heart Button */}
                <button
                  onClick={() => toggleFavorite(srv.id)}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center transition-colors ${
                    isFav ? 'text-red-500' : 'text-white/80 hover:text-white'
                  }`}
                  aria-label={`Favoritar ${srv.name}`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-[#F5C542] transition-colors leading-snug">
                      {srv.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#A3A3A3] mt-1 line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#A3A3A3]">
                      <Clock className="w-3.5 h-3.5 text-[#F5C542]" />
                      <span>{srv.durationMinutes} min</span>
                    </div>
                    <p className="text-base font-extrabold text-[#F5C542] mt-0.5">
                      {formatBRL(srv.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setDetailService(srv)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A3A3A3] hover:text-white transition-colors"
                      aria-label="Ver Detalhes do Serviço"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleBook(srv)}
                      className="py-2 px-4 rounded-xl bg-[#F5C542] text-[#080808] font-bold text-xs uppercase tracking-wider hover:brightness-105 active:scale-95 transition-all shadow-md shadow-[#F5C542]/20"
                    >
                      Agendar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Service Detail Modal */}
      {detailService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl glass-surface-elevated p-6 border border-[#F5C542]/30 shadow-2xl space-y-4">
            <button
              onClick={() => setDetailService(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Fechar"
            >
              <XIcon className="w-4 h-4" />
            </button>

            <div className="h-44 rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
              <img src={detailService.imageUrl} alt={detailService.name} className="w-full h-full object-cover" />
            </div>

            <div>
              <span className="text-[10px] text-[#F5C542] uppercase tracking-widest font-bold">
                {detailService.categoryLabel}
              </span>
              <h3 className="text-lg font-black text-white tracking-tight mt-0.5">
                {detailService.name}
              </h3>
              <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
                {detailService.description}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
              <div>
                <span className="text-[#A3A3A3]">Duração Estimada:</span>
                <p className="font-bold text-white mt-0.5">{detailService.durationMinutes} minutos</p>
              </div>
              <div className="text-right">
                <span className="text-[#A3A3A3]">Investimento:</span>
                <p className="font-black text-[#F5C542] text-sm mt-0.5">{formatBRL(detailService.price)}</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#F5C542]/40">
                <img src="/src/assets/images/barbershop_fade_cut_1792791560603.jpg" alt="Guilherme Rocha" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Guilherme Rocha</p>
                <p className="text-[10px] text-[#A3A3A3]">Barbeiro habilitado para este procedimento</p>
              </div>
            </div>

            <button
              onClick={() => {
                const srv = detailService;
                setDetailService(null);
                handleBook(srv);
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#F5C542] to-[#D4A325] text-[#080808] font-bold text-xs uppercase tracking-wider hover:brightness-105 active:scale-95 transition-all shadow-lg shadow-[#F5C542]/20"
            >
              Agendar este serviço
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
