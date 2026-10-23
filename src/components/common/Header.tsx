import React from 'react';
import { Bell, Moon, Sun, Download, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const Header: React.FC = () => {
  const {
    businessSettings,
    unreadNotificationsCount,
    setActiveTab,
    activeTab,
    theme,
    toggleTheme,
    setIsPwaPromptOpen,
    setIsNotificationPromptOpen,
  } = useApp();

  const { isInstalled } = usePWAInstall();

  return (
    <header className="sticky top-0 z-40 w-full glass-surface border-b border-white/10 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-black border border-[#F5C542]/30 flex items-center justify-center p-1 shadow-md shadow-[#F5C542]/10 group-hover:border-[#F5C542] transition-colors overflow-hidden shrink-0">
            <img src="/logo.png" alt="Barbershop Rocha Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold tracking-tight text-base sm:text-lg text-white group-hover:text-[#F5C542] transition-colors leading-none">
                {businessSettings.name}
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#A3A3A3] tracking-wider uppercase font-semibold mt-0.5">
              {businessSettings.slogan}
            </p>
          </div>
        </div>

        {/* Desktop Quick Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold text-[#A3A3A3]">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors hover:text-white ${activeTab === 'home' ? 'text-[#F5C542]' : ''}`}
          >
            Início
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`transition-colors hover:text-white ${activeTab === 'services' ? 'text-[#F5C542]' : ''}`}
          >
            Serviços
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`transition-colors hover:text-white ${activeTab === 'appointments' ? 'text-[#F5C542]' : ''}`}
          >
            Agendamentos
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`transition-colors hover:text-white ${activeTab === 'plans' ? 'text-[#F5C542]' : ''}`}
          >
            Signature Club
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1 transition-colors hover:text-white ${activeTab === 'admin' ? 'text-[#F5C542]' : ''}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Gestão
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PWA Install Button */}
          {!isInstalled && (
            <button
              onClick={() => setIsPwaPromptOpen(true)}
              aria-label="Instalar Aplicativo PWA"
              className="flex items-center gap-1.5 bg-[#F5C542]/15 hover:bg-[#F5C542]/25 text-[#F5C542] border border-[#F5C542]/40 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide transition-all active:scale-95 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Baixar App</span>
            </button>
          )}

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Alternar Tema Claro/Escuro"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-[#A3A3A3] hover:text-white transition-colors active:scale-95"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#F5C542]" /> : <Moon className="w-4 h-4 text-[#C99A22]" />}
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => {
              setActiveTab('profile');
              setIsNotificationPromptOpen(true);
            }}
            aria-label="Notificações"
            className="relative w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-[#A3A3A3] hover:text-white transition-colors active:scale-95"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#F5C542] text-[#080808] text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
