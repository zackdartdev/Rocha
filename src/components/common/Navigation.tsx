import React from 'react';
import { Home, Calendar, Heart, Scissors, User } from 'lucide-react';
import { useApp, AppTab } from '../../context/AppContext';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: { id: AppTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'appointments', label: 'Agendamentos', icon: Calendar },
    { id: 'favorites', label: 'Favoritos', icon: Heart },
    { id: 'services', label: 'Serviços', icon: Scissors },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav 
      aria-label="Navegação Principal"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md md:hidden pointer-events-auto"
    >
      <div className="glass-surface rounded-full px-2 py-1.5 shadow-2xl border border-white/15 backdrop-blur-xl flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all duration-200 relative min-w-[54px] min-h-[44px] ${
                isActive ? 'text-[#F5C542]' : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              {isActive && (
                <span 
                  aria-hidden="true"
                  className="absolute inset-0 bg-[#F5C542]/10 rounded-full scale-100 transition-transform" 
                />
              )}
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />
              <span className={`text-[10px] mt-0.5 font-semibold tracking-tight ${isActive ? 'text-[#F5C542]' : 'text-[#A3A3A3]'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
