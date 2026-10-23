import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, CheckCircle2, Smartphone, Zap, WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PwaInstallModal: React.FC = () => {
  const { isPwaPromptOpen, setIsPwaPromptOpen, businessSettings } = useApp();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isPwaPromptOpen || isInstalled) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setInstallSuccess(true);
        setTimeout(() => {
          setIsPwaPromptOpen(false);
        }, 2200);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-sm rounded-3xl glass-surface-elevated p-6 border border-[#F5C542]/30 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwa-modal-title"
      >
        {/* Ambient Gold Glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#F5C542]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={() => setIsPwaPromptOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with App Icon */}
        <div className="flex flex-col items-center text-center pt-2">
          <div className="w-20 h-20 rounded-3xl bg-black p-1 border border-[#F5C542]/40 shadow-lg shadow-[#F5C542]/20 mb-3.5 flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Barbershop Rocha" className="w-full h-full object-contain" />
          </div>

          <h2 id="pwa-modal-title" className="text-xl font-bold tracking-tight text-white">
            Instalar {businessSettings.name}
          </h2>
          <p className="text-xs text-[#A3A3A3] mt-1 font-medium">
            {businessSettings.slogan} — Experiência completa de app nativo no seu dispositivo
          </p>
        </div>

        {/* Benefits list */}
        <div className="mt-5 space-y-2.5 text-xs text-white/90 bg-black/40 rounded-2xl p-3.5 border border-white/5">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-[#F5C542] shrink-0" />
            <span>Agendamento ultra rápido em 1 toque na tela inicial</span>
          </div>
          <div className="flex items-center gap-2.5">
            <WifiOff className="w-4 h-4 text-[#F5C542] shrink-0" />
            <span>Funciona offline e consulta seus horários marcados</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-[#F5C542] shrink-0" />
            <span>Interface em tela cheia com visual iOS Glassmorphism</span>
          </div>
        </div>

        {/* Conditional Installation Controls */}
        <div className="mt-6">
          {installSuccess ? (
            <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-semibold animate-pulse">
              <CheckCircle2 className="w-5 h-5" />
              Aplicativo instalado com sucesso!
            </div>
          ) : isInstallable ? (
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#F5C542] to-[#D4A325] text-[#080808] font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-[#F5C542]/25 hover:brightness-105 active:scale-[0.98] transition-all"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              Baixar Agora
            </button>
          ) : isIOS ? (
            <div className="bg-[#1D1D1D] rounded-2xl p-4 border border-white/10 text-xs text-[#A3A3A3]">
              <p className="text-white font-semibold mb-2 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-[#F5C542]" /> Como instalar no iPhone / iPad:
              </p>
              <ol className="space-y-2 list-decimal list-inside text-[11px] leading-relaxed">
                <li>
                  Toque no botão <strong className="text-white">Compartilhar</strong> (ícone de quadrado com seta para cima no Safari).
                </li>
                <li>
                  Role para baixo e selecione <strong className="text-white">Adicionar à Tela de Início</strong> <PlusSquare className="inline w-3 h-3 text-[#F5C542]" />.
                </li>
                <li>
                  Toque em <strong className="text-white">Adicionar</strong> no canto superior direito.
                </li>
              </ol>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#F5C542] text-[#080808] font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-[#F5C542]/20 hover:brightness-105 active:scale-[0.98] transition-all"
              >
                <Download className="w-4 h-4" />
                Baixar Agora
              </button>
              <p className="text-[11px] text-center text-[#A3A3A3]">
                Abra as opções do seu navegador e clique em <strong>Adicionar à tela inicial</strong> ou <strong>Instalar app</strong>.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsPwaPromptOpen(false)}
            className="text-xs text-[#A3A3A3] hover:text-white transition-colors py-1"
          >
            Continuar no navegador
          </button>
        </div>
      </div>
    </div>
  );
};
