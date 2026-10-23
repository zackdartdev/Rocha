import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Sparkles, Scissors, Shield, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GoogleLoginModal } from './GoogleLoginModal';

export const WelcomeScreen: React.FC = () => {
  const { setWelcomeSeen, setIsOnboardingOpen, setActiveTab, user, loginAsGuest } = useApp();

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

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

  const handleGuestEntry = () => {
    loginAsGuest();
    setWelcomeSeen(true);
    setActiveTab('home');
  };

  const handleDirectExplore = () => {
    setWelcomeSeen(true);
    setActiveTab('services');
  };

  const handleGoogleSuccess = () => {
    setIsGoogleModalOpen(false);
    setWelcomeSeen(true);
    if (!user.hasCompletedOnboarding) {
      setIsOnboardingOpen(true);
    } else {
      setActiveTab('home');
    }
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
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#080808] text-white overflow-y-auto overflow-x-hidden select-none">
      {/* Background with Real Barber Guilherme Rocha Portrait & Ambient Dark Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/barber-guilherme.png"
          alt="Guilherme Rocha - Barbershop Rocha"
          className="w-full h-full object-cover sm:object-contain object-top filter brightness-[0.72] contrast-[1.08] transition-transform duration-1000 ease-out"
        />
        {/* Soft Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/90 via-transparent to-[#080808]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_20%,#080808_90%)]" />
      </div>

      {/* Top Brand Bar */}
      <div className="relative z-10 pt-safe px-6 pt-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-black border border-[#F5C542]/50 p-1 shadow-lg shadow-[#F5C542]/20 flex items-center justify-center overflow-hidden shrink-0">
            <img src="/logo.png" alt="Barbershop Rocha" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-['Inter',sans-serif] font-black text-sm sm:text-base tracking-wider uppercase text-white leading-none block">
              Barbershop Rocha
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-[#F5C542] font-semibold tracking-widest uppercase mt-0.5">
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

      {/* Center Editorial Composition with Heavy Inter Typography */}
      <div className="relative z-10 px-5 sm:px-8 max-w-lg mx-auto my-auto text-center space-y-4 pt-10 sm:pt-4">
        {/* Official Brand Logo Showcase */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-black/95 border border-[#F5C542]/50 p-2 shadow-2xl shadow-[#F5C542]/25 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform duration-300">
          <img src="/logo.png" alt="Barbershop Rocha — Além do corte" className="w-full h-full object-contain" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C542]/15 border border-[#F5C542]/30 text-[#F5C542] text-[11px] font-bold tracking-wider uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Primeiro Acesso Oficial</span>
        </div>

        {/* Heavy Inter Premium Display Heading */}
        <h1 className="font-['Inter',sans-serif] font-black text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.08] text-white uppercase drop-shadow-lg">
          Seu Estilo. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5C542] to-amber-200">
            Seu Barbeiro.
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-[#D1D5DB] max-w-sm mx-auto leading-relaxed font-medium drop-shadow-sm">
          Guilherme Rocha traz visagismo milimétrico, cortes na tesoura e atendimento exclusivo em Maricá RJ.
        </p>

        {/* Google Login Call-to-Action Card */}
        <div className="pt-2 max-w-sm mx-auto w-full space-y-3">
          {/* Main Google Sign-In Button */}
          <button
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl bg-white hover:bg-neutral-100 text-[#1F1F1F] font-['Inter',sans-serif] font-extrabold text-sm shadow-xl shadow-black/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-neutral-300"
          >
            {/* Google Multicolor "G" Logo */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continuar com o Google</span>
          </button>

          {/* Quick Info Badge */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#A3A3A3]">
            <Shield className="w-3 h-3 text-[#F5C542]" />
            <span>Acesso rápido e seguro para agendamentos e planos</span>
          </div>
        </div>
      </div>

      {/* Bottom Slider & Actions */}
      <div className="relative z-10 px-6 pb-safe pb-6 max-w-md w-full mx-auto space-y-3">
        {/* Interactive Slide-to-Start Slider */}
        <div
          ref={trackRef}
          className="relative h-13 w-full rounded-full bg-[#141414]/90 border border-[#F5C542]/40 backdrop-blur-xl p-1 overflow-hidden shadow-2xl flex items-center"
        >
          {/* Progress fill */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#F5C542]/30 to-[#F5C542]/60 transition-all pointer-events-none rounded-full"
            style={{ width: `${Math.max(10, dragProgress * 100)}%` }}
          />

          {/* Centered Slider Text */}
          <div className="w-full text-center pointer-events-none select-none">
            <span className="font-['Inter',sans-serif] text-xs font-bold tracking-wider uppercase text-white/80 transition-opacity">
              {dragProgress >= 0.8 ? 'Quase lá...' : 'Deslize para começar'}
            </span>
          </div>

          {/* Draggable Knob */}
          <div
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={handleTouchStart}
            style={{
              transform: `translateX(${dragProgress * ((trackRef.current?.offsetWidth || 340) - 52)}px)`,
              transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="absolute left-1 top-1 bottom-1 w-11 h-11 rounded-full bg-gradient-to-br from-[#FFF0A0] via-[#F5C542] to-[#B8860B] text-[#080808] flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg shadow-[#F5C542]/40 hover:scale-105 transition-transform"
            aria-label="Controle de deslizar para começar"
            role="slider"
            aria-valuenow={Math.round(dragProgress * 100)}
          >
            <ChevronRight className="w-5 h-5 stroke-[3]" />
          </div>
        </div>

        {/* Fallback & Direct Links */}
        <div className="flex items-center justify-between text-xs px-2">
          <button
            onClick={handleStart}
            className="text-[#F5C542] hover:underline font-semibold flex items-center gap-1 font-['Inter',sans-serif]"
          >
            <span>Iniciar diretamente</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleGuestEntry}
            className="text-[#A3A3A3] hover:text-white transition-colors flex items-center gap-1 font-['Inter',sans-serif]"
          >
            <span>Entrar como visitante</span>
          </button>
        </div>
      </div>

      {/* Google Login Modal */}
      <GoogleLoginModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleSuccess}
      />
    </div>
  );
};
