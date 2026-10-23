import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  Heart, 
  ChevronRight, 
  Download, 
  Scissors, 
  Crown,
  ExternalLink 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatBRL, formatDateBR } from '../../utils/rules';
import { ServiceCategory, ServiceItem } from '../../types';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const HomeScreen: React.FC = () => {
  const { 
    user, 
    services, 
    appointments, 
    businessSettings, 
    setActiveTab, 
    setSelectedServiceForBooking, 
    setIsBookingModalOpen, 
    toggleFavorite,
    setIsPwaPromptOpen
  } = useApp();

  const { isInstalled } = usePWAInstall();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'todos'>('todos');

  // Next upcoming active appointment
  const nextAppointment = useMemo(() => {
    return appointments.find(
      (app) => app.status === 'confirmado' || app.status === 'aguardando_confirmacao'
    );
  }, [appointments]);

  // Featured service (Corte disfarçado ou tesoura)
  const featuredService = services.find((s) => s.id === 'srv-2') || services[0];

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesQuery = 
        srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'todos' || srv.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [services, searchQuery, selectedCategory]);

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'cortes', label: 'Cortes' },
    { id: 'barba', label: 'Barba' },
    { id: 'acabamento', label: 'Acabamento' },
    { id: 'tratamentos', label: 'Tratamentos' },
  ];

  const handleBookService = (service: ServiceItem) => {
    setSelectedServiceForBooking(service);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-4 animate-fade-in">
      {/* User Greeting & Header Profile Bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#A3A3A3] font-medium tracking-wide">
            Bem-vindo à Barbershop Rocha
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
            Olá, {user.name ? user.name.split(' ')[0] : 'Cliente'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {user.activeSubscriptionId && (
            <div 
              onClick={() => setActiveTab('plans')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5C542]/15 border border-[#F5C542]/30 text-[#F5C542] text-xs font-semibold cursor-pointer hover:bg-[#F5C542]/25 transition-colors"
            >
              <Crown className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Signature Club</span>
            </div>
          )}

          <button
            onClick={() => setActiveTab('profile')}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#222222] to-[#111111] border border-[#F5C542]/40 text-[#F5C542] font-black text-xs flex items-center justify-center shadow-md shadow-[#F5C542]/10 hover:border-[#F5C542] transition-colors"
            aria-label="Meu Perfil"
          >
            {user.name ? user.name.charAt(0).toUpperCase() : 'R'}
          </button>
        </div>
      </div>

      {/* PWA Reactive Promo Card (if not installed) */}
      {!isInstalled && (
        <div className="rounded-2xl p-4 glass-surface-elevated border border-[#F5C542]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-[#F5C542]/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5C542]/20 border border-[#F5C542]/40 text-[#F5C542] flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Instale o App Barbershop Rocha</p>
              <p className="text-[11px] text-[#A3A3A3]">
                Atalho direto na tela inicial, carregamento instantâneo e acesso offline.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPwaPromptOpen(true)}
            className="w-full sm:w-auto py-2 px-4 rounded-xl bg-[#F5C542] hover:brightness-105 text-[#080808] font-bold text-xs uppercase tracking-wider shrink-0 transition-all active:scale-95 shadow-md shadow-[#F5C542]/20"
          >
            Baixar Agora
          </button>
        </div>
      )}

      {/* Real Next Scheduled Appointment Banner */}
      {nextAppointment ? (
        <div className="rounded-3xl p-5 bg-gradient-to-br from-[#1A1A1A] to-[#0E0E0E] border border-[#F5C542]/40 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5C542]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#F5C542] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Próximo Atendimento
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
              Confirmado
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {nextAppointment.serviceName}
              </h3>
              <p className="text-xs text-[#A3A3A3] mt-0.5">
                com {nextAppointment.professionalName}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-white/90 mt-2.5">
                <span className="flex items-center gap-1 text-[#F5C542] font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDateBR(nextAppointment.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#A3A3A3]" />
                  {nextAppointment.time} ({nextAppointment.durationMinutes} min)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('appointments')}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
              >
                Ver Detalhes
              </button>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessSettings.address)}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-[#F5C542]/20 hover:bg-[#F5C542]/30 text-[#F5C542] border border-[#F5C542]/40 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Como Chegar</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl p-5 bg-white/5 border border-white/10 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-white">Sem agendamentos futuros</p>
            <p className="text-[11px] text-[#A3A3A3] mt-0.5">
              Garanta seu horário com Guilherme Rocha sem fila de espera.
            </p>
          </div>
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-[#F5C542] text-[#080808] font-bold text-xs uppercase tracking-wider shrink-0 hover:brightness-105 active:scale-95 transition-all shadow-md shadow-[#F5C542]/20"
          >
            Agendar Agora
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A3A3]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar serviços ou profissionais..."
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#141414] border border-white/10 text-white placeholder-[#A3A3A3] focus:outline-none focus:border-[#F5C542] transition-colors text-xs sm:text-sm shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#A3A3A3] hover:text-white"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Featured Service Spotlight Banner */}
      {featuredService && !searchQuery && (
        <div className="rounded-3xl overflow-hidden glass-surface border border-white/10 relative group">
          <div className="relative h-48 sm:h-64 w-full">
            <img
              src={featuredService.imageUrl}
              alt={featuredService.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent" />
            
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-[#F5C542] text-[#080808] text-[10px] font-extrabold uppercase tracking-widest shadow-md">
                Destaque Rocha
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-2xl font-black text-white keep-white tracking-tight">
                  {featuredService.name}
                </h3>
                <p className="text-xs text-white/80 keep-white line-clamp-1 max-w-md mt-0.5">
                  {featuredService.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs font-semibold">
                  <span className="text-[#F5C542] text-sm font-extrabold">{formatBRL(featuredService.price)}</span>
                  <span className="text-white/60 keep-white">·</span>
                  <span className="text-white/90 keep-white">{featuredService.durationMinutes} minutos</span>
                </div>
              </div>

              <button
                onClick={() => handleBookService(featuredService)}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#F5C542] to-[#D4A325] text-[#080808] font-bold text-xs uppercase tracking-wider shrink-0 hover:brightness-105 active:scale-95 transition-all shadow-lg shadow-[#F5C542]/20"
              >
                Agendar Agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Segmented Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as ServiceCategory | 'todos')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#F5C542] text-[#080808] shadow-md shadow-[#F5C542]/20 font-bold'
                  : 'bg-white/5 border border-white/10 text-[#A3A3A3] hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Catalog Services Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
            {selectedCategory === 'todos' ? 'Serviços Populares' : `Serviços — ${selectedCategory}`}
          </h3>
          <button
            onClick={() => setActiveTab('services')}
            className="text-xs text-[#F5C542] hover:underline font-semibold flex items-center gap-1"
          >
            <span>Ver todos (14)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {filteredServices.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <p className="text-xs font-semibold text-white">Nenhum serviço encontrado.</p>
            <p className="text-[11px] text-[#A3A3A3]">Tente buscar por corte, barba ou pigmentação.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredServices.slice(0, 6).map((srv) => {
              const isFav = user.favoriteServiceIds.includes(srv.id);
              return (
                <div
                  key={srv.id}
                  className="rounded-2xl glass-surface border border-white/10 p-3.5 flex flex-col justify-between gap-3 group hover:border-[#F5C542]/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-900 border border-white/5 relative">
                      <img
                        src={srv.imageUrl}
                        alt={srv.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-white group-hover:text-[#F5C542] transition-colors line-clamp-1">
                          {srv.name}
                        </h4>
                        <button
                          onClick={() => toggleFavorite(srv.id)}
                          className={`p-1 rounded-full transition-colors ${
                            isFav ? 'text-red-500' : 'text-[#A3A3A3] hover:text-white'
                          }`}
                          aria-label={`Favoritar ${srv.name}`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#A3A3A3] line-clamp-2 mt-0.5 leading-snug">
                        {srv.description}
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-[11px]">
                        <span className="font-extrabold text-[#F5C542]">{formatBRL(srv.price)}</span>
                        <span className="text-white/40">·</span>
                        <span className="text-white/70">{srv.durationMinutes} min</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-[#A3A3A3] uppercase tracking-wider font-semibold">
                      Guilherme Rocha
                    </span>
                    <button
                      onClick={() => handleBookService(srv)}
                      className="py-1.5 px-3 rounded-lg bg-[#F5C542]/15 hover:bg-[#F5C542] text-[#F5C542] hover:text-[#080808] text-xs font-bold transition-all active:scale-95"
                    >
                      Agendar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Signature Club Banner CTA */}
      <div 
        onClick={() => setActiveTab('plans')}
        className="rounded-3xl p-5 bg-gradient-to-r from-[#201A09] via-[#1A1A1A] to-[#0A0A0A] border border-[#F5C542]/30 cursor-pointer hover:border-[#F5C542]/60 transition-all shadow-xl group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#F5C542]/20 border border-[#F5C542]/50 text-[#F5C542] flex items-center justify-center shrink-0">
            <Crown className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#F5C542]">
              Signature Club
            </span>
            <h4 className="text-sm sm:text-base font-black text-white tracking-tight">
              Corte e Barba Ilimitados no Mês
            </h4>
            <p className="text-xs text-[#A3A3A3] mt-0.5">
              Planos a partir de R$ 64,90/mês. Cabelo e barba sempre na régua sem surpresas.
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab('plans');
          }}
          className="py-2.5 px-4 rounded-xl bg-[#F5C542] text-[#080808] font-bold text-xs uppercase tracking-wider shrink-0 group-hover:brightness-105 transition-all"
        >
          Conhecer Planos
        </button>
      </div>
    </div>
  );
};
