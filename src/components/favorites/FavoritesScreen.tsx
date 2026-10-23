import React, { useMemo } from 'react';
import { Heart, Clock, Scissors, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatBRL } from '../../utils/rules';
import { ServiceItem } from '../../types';

export const FavoritesScreen: React.FC = () => {
  const { 
    services, 
    user, 
    toggleFavorite, 
    setSelectedServiceForBooking, 
    setIsBookingModalOpen, 
    setActiveTab 
  } = useApp();

  const favoriteServices = useMemo(() => {
    return services.filter((srv) => user.favoriteServiceIds.includes(srv.id));
  }, [services, user.favoriteServiceIds]);

  const handleBook = (srv: ServiceItem) => {
    setSelectedServiceForBooking(srv);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-4 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Meus Favoritos</h2>
        <p className="text-xs text-[#A3A3A3]">
          Seus serviços habituais salvos para agendamento rápido com Guilherme Rocha.
        </p>
      </div>

      {favoriteServices.length === 0 ? (
        <div className="rounded-3xl glass-surface border border-white/10 p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#A3A3A3] flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">Nenhum serviço favoritado</h3>
          <p className="text-xs text-[#A3A3A3] max-w-xs mx-auto">
            Toque no ícone de coração nos cards do catálogo para salvar seus serviços favoritos aqui.
          </p>
          <button
            onClick={() => setActiveTab('services')}
            className="mt-2 py-2 px-4 rounded-xl bg-[#F5C542] text-[#080808] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md shadow-[#F5C542]/20"
          >
            <span>Explorar Catálogo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteServices.map((srv) => (
            <div
              key={srv.id}
              className="rounded-3xl glass-surface border border-white/10 p-4 space-y-3 flex flex-col justify-between hover:border-[#F5C542]/40 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-900 shrink-0">
                  <img src={srv.imageUrl} alt={srv.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-bold text-white truncate">{srv.name}</h4>
                    <button
                      onClick={() => toggleFavorite(srv.id)}
                      className="text-red-500 hover:text-red-400 p-1"
                      aria-label="Desfavoritar"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <p className="text-[11px] text-[#A3A3A3] line-clamp-2 mt-0.5 leading-snug">
                    {srv.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className="font-extrabold text-[#F5C542]">{formatBRL(srv.price)}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-white/70">{srv.durationMinutes} min</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-[#A3A3A3] uppercase tracking-wider font-semibold">
                  Guilherme Rocha
                </span>
                <button
                  onClick={() => handleBook(srv)}
                  className="py-1.5 px-4 rounded-xl bg-[#F5C542] text-[#080808] font-bold text-xs uppercase tracking-wider hover:brightness-105 active:scale-95 transition-all shadow-md shadow-[#F5C542]/20"
                >
                  Agendar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
