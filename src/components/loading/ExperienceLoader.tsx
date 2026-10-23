import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Scissors, Zap, CheckCircle2 } from 'lucide-react';
import { getLoadingMessage } from '../../utils/rules';

interface ExperienceLoaderProps {
  onComplete: () => void;
  brandName?: string;
  slogan?: string;
}

export const ExperienceLoader: React.FC<ExperienceLoaderProps> = ({
  onComplete,
  brandName = 'Barbershop Rocha',
  slogan = 'Além do corte',
}) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [tapMultiplier, setTapMultiplier] = useState(1);
  const [justTapped, setJustTapped] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Smooth realistic progress animation with ease-in-out pacing
  useEffect(() => {
    const duration = 2800; // ~2.8 seconds default without tapping
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - startTime) * tapMultiplier;
      const rawPct = Math.min(100, (elapsed / duration) * 100);

      // Nonlinear easing to feel like real app initialization
      let displayPct = rawPct;
      if (rawPct < 30) {
        displayPct = rawPct * 1.1;
      } else if (rawPct < 70) {
        displayPct = 33 + (rawPct - 30) * 0.9;
      } else if (rawPct < 95) {
        displayPct = 69 + (rawPct - 70) * 1.1;
      } else {
        displayPct = 96 + (rawPct - 95) * 0.8;
      }

      const clamped = Math.min(100, Math.round(displayPct));
      setProgress(clamped);

      if (clamped >= 100) {
        setIsDone(true);
        setTimeout(() => {
          onComplete();
        }, 400);
      } else {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [tapMultiplier, onComplete]);

  // Interactive tap to speed up loading
  const handleBoost = () => {
    setTapMultiplier((prev) => Math.min(prev + 1.2, 5));
    setJustTapped(true);
    setTimeout(() => setJustTapped(false), 300);
  };

  const currentMessage = getLoadingMessage(progress);

  return (
    <div
      onClick={handleBoost}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#080808] text-white p-6 sm:p-10 select-none transition-opacity duration-500 cursor-pointer ${
        isDone ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage: `radial-gradient(circle at 50% 35%, rgba(245, 197, 66, 0.12) 0%, rgba(8, 8, 8, 0.95) 70%)`,
      }}
    >
      {/* Top Brand Micro Header */}
      <div className="w-full flex items-center justify-between pt-safe">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#F5C542]">
          <Scissors className="w-4 h-4 animate-pulse" />
          <span>Experiência Digital</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="text-xs text-[#A3A3A3] hover:text-white px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md transition-colors"
        >
          Entrar direto
        </button>
      </div>

      {/* Centerpiece: Glowing Emblem & Progress */}
      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-7 my-auto">
        {/* Logo Shield with pulsing glow */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#F5C542]/30 via-amber-400/20 to-transparent rounded-3xl blur-xl animate-pulse" />
          <div className="relative w-28 h-28 rounded-3xl bg-black border-2 border-[#F5C542]/50 p-2 shadow-2xl flex items-center justify-center overflow-hidden">
            <img
              src="/logo.png"
              alt="Barbershop Rocha"
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>
        </div>

        {/* Brand Typographic Heading */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-['Inter',sans-serif]">
            {brandName}
          </h1>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F5C542] mt-1">
            {slogan}
          </p>
        </div>

        {/* Interactive Progress Bar */}
        <div className="w-full space-y-3 pt-2">
          {/* Track */}
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10 backdrop-blur-sm relative">
            <div
              className="h-full bg-gradient-to-r from-[#F5C542] via-amber-300 to-[#F5C542] rounded-full transition-all duration-150 ease-out relative shadow-[0_0_12px_rgba(245,197,66,0.8)]"
              style={{ width: `${progress}%` }}
            >
              {/* Highlight particle */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full animate-ping opacity-75" />
            </div>
          </div>

          {/* Progress Percentage and Status Message */}
          <div className="flex items-center justify-between text-xs font-mono font-medium text-[#A3A3A3] px-1">
            <span className="flex items-center gap-1.5 text-white/90">
              <Sparkles className="w-3.5 h-3.5 text-[#F5C542]" />
              <span className="font-sans font-semibold tracking-wide text-xs">
                {currentMessage}
              </span>
            </span>
            <span className="text-[#F5C542] font-bold">{progress}%</span>
          </div>
        </div>

        {/* Tap to boost hint */}
        <div
          className={`flex items-center justify-center gap-1.5 text-[11px] text-[#A3A3A3] transition-transform duration-200 ${
            justTapped ? 'scale-110 text-[#F5C542]' : ''
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-[#F5C542]" />
          <span>Toque na tela para acelerar</span>
        </div>
      </div>

      {/* Bottom Guarantee */}
      <div className="pb-safe text-center">
        <p className="text-[11px] text-[#A3A3A3]/80">
          Maricá RJ · Atendimento com hora marcada e Visagismo
        </p>
      </div>
    </div>
  );
};
