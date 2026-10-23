import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Sparkles, Scissors } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WelcomeScreen: React.FC = () => {
  const { setWelcomeSeen, setIsOnboardingOpen, setActiveTab, user } = useApp();

  // Slider state
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    setWelcomeSeen(true);
    if (!user.hasCompletedOnboarding) {
      setIsOnboardingOpen(true);
    } else {
      setActiveTab('home');
    }
  };

  const handleDirectExplore = () => {
    setWelcomeSeen(true);
    setActiveTab('services');
  };

  // Drag interaction logic
  const handleTouchStart = () => setIsDragging(true);

  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!isDragging || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const currentX = clientX - rect.left;
      const maxDistance = rect.width - 56; // knob diameter ~56px
      const clamped = Math.max(0, Math.min(currentX, maxDistance));
      const progress = clamped / maxDistance;
      setDragProgress(progress);

      if (progress >= 0.92) {
        setIsDragging(false);
        setDragProgress(1);
        setTimeout(handleStart, 250);
      }
    };

    const handleEnd = () => {
      if (!isDragging) return;
      setIsDragging(false);
      if (dragProgress < 0.92) {
        // Spring return to start
        setDragProgress(0);
      }
    };

    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();
    const onTouchEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, dragProgress]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#080808] text-white overflow-hidden select-none">
      {/* Background with Ambient Dark Wood & Gold Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/barbershop_hero_interior_1792791560086.jpg"
          alt="Barbershop Rocha Interior"
          className="w-full h-full object-cover object-center filter brightness-[0.42] scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/80 via-transparent to-[#080808]" />
      </div>

      {/* Top Brand Bar */}
      <div className="relative z-10 pt-safe px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-black border border-[#F5C542]/40 p-1 shadow-lg shadow-[#F5C542]/20 flex items-center justify-center overflow-hidden shrink-0">
            <img src="/logo.png" alt="Barbershop Rocha" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-wider uppercase text-white">Barbershop Rocha</span>
            <div className="flex items-center gap-1.5 text-[10px] text-[#F5C542] font-semibold tracking-widest uppercase">
              <span>Além do corte</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleDirectExplore}
          className="text-xs text-[#A3A3A3] hover:text-[#F5C542] transition-colors py-1.5 px-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
        >
          Pular introdução
        </button>
      </div>

      {/* Center Editorial Composition */}
      <div className="relative z-10 px-6 sm:px-12 max-w-xl mx-auto my-auto text-center space-y-4">
        {/* Official Brand Logo Showcase */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-black/90 border border-[#F5C542]/40 p-2 shadow-2xl shadow-[#F5C542]/20 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform duration-300">
          <img src="/logo.png" alt="Barbershop Rocha — Além do corte" className="w-full h-full object-contain" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C542]/15 border border-[#F5C542]/30 text-[#F5C542] text-xs font-semibold tracking-wider uppercase mb-1 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Experiência Digital Exclusiva</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15] text-balance">
          Seu estilo. Seu barbeiro. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5C542] to-amber-200">
            A um toque de distância.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#A3A3A3] max-w-md mx-auto leading-relaxed">
          Descubra seu próximo visual e agende seu atendimento com praticidade na melhor barbearia de Maricá RJ.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-3 gap-2.5 pt-3 max-w-sm mx-auto text-left">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <p className="text-[10px] text-[#A3A3A3] uppercase font-medium">Atendimento</p>
            <p className="text-xs font-bold text-white mt-0.5">Visagismo</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <p className="text-[10px] text-[#A3A3A3] uppercase font-medium">Assinatura</p>
            <p className="text-xs font-bold text-[#F5C542] mt-0.5">Signature Club</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <p className="text-[10px] text-[#A3A3A3] uppercase font-medium">Localização</p>
            <p className="text-xs font-bold text-white mt-0.5">Maricá — RJ</p>
          </div>
        </div>
      </div>

      {/* Bottom Slider & Actions */}
      <div className="relative z-10 px-6 pb-safe pb-8 max-w-md w-full mx-auto space-y-3.5">
        {/* Interactive Slide-to-Start Slider */}
        <div
          ref={trackRef}
          className="relative h-14 w-full rounded-full bg-[#181818]/90 border border-[#F5C542]/40 backdrop-blur-xl p-1 overflow-hidden shadow-2xl flex items-center"
        >
          {/* Progress fill */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#F5C542]/30 to-[#F5C542]/60 transition-all pointer-events-none rounded-full"
            style={{ width: `${Math.max(10, dragProgress * 100)}%` }}
          />

          {/* Centered Slider Text */}
          <div className="w-full text-center pointer-events-none select-none">
            <span className="text-xs font-bold tracking-wider uppercase text-white/80 transition-opacity">
              {dragProgress >= 0.8 ? 'Quase lá...' : 'Deslize para começar'}
            </span>
          </div>

          {/* Draggable Knob */}
          <div
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={handleTouchStart}
            style={{
              transform: `translateX(${dragProgress * ((trackRef.current?.offsetWidth || 340) - 56)}px)`,
              transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="absolute left-1 top-1 bottom-1 w-12 h-12 rounded-full bg-gradient-to-br from-[#FFF0A0] via-[#F5C542] to-[#B8860B] text-[#080808] flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg shadow-[#F5C542]/40 hover:scale-105 transition-transform"
            aria-label="Controle de deslizar para começar"
            role="slider"
            aria-valuenow={Math.round(dragProgress * 100)}
          >
            <ChevronRight className="w-6 h-6 stroke-[3]" />
          </div>
        </div>

        {/* Fallback & Direct Links */}
        <div className="flex items-center justify-between text-xs px-2">
          <button
            onClick={handleStart}
            className="text-[#F5C542] hover:underline font-semibold flex items-center gap-1"
          >
            <span>Iniciar diretamente</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDirectExplore}
            className="text-[#A3A3A3] hover:text-white transition-colors flex items-center gap-1"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Explorar serviços</span>
          </button>
        </div>
      </div>
    </div>
  );
};
