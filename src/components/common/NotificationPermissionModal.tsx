import React, { useState } from 'react';
import { BellRing, Check, X, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationPermissionModal: React.FC = () => {
  const { isNotificationPromptOpen, setIsNotificationPromptOpen, requestNotificationPermission } = useApp();
  const [granted, setGranted] = useState(false);
  const [denied, setDenied] = useState(false);

  if (!isNotificationPromptOpen) return null;

  const handleAllow = async () => {
    const success = await requestNotificationPermission();
    if (success) {
      setGranted(true);
      setTimeout(() => {
        setIsNotificationPromptOpen(false);
      }, 1600);
    } else {
      setDenied(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-sm rounded-3xl glass-surface-elevated p-6 border border-[#F5C542]/30 shadow-2xl text-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notif-modal-title"
      >
        <button
          onClick={() => setIsNotificationPromptOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-[#F5C542]/20 border border-[#F5C542]/40 text-[#F5C542] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#F5C542]/20">
          <BellRing className="w-7 h-7 animate-bounce" />
        </div>

        <h3 id="notif-modal-title" className="text-lg font-bold text-white tracking-tight">
          Notificações da Rocha
        </h3>
        <p className="text-xs text-[#A3A3A3] mt-1.5 leading-relaxed">
          Receba lembretes automáticos dos seus agendamentos, confirmações de atendimento e comunicados do Signature Club direto na tela do seu aparelho.
        </p>

        {granted ? (
          <div className="mt-5 p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> Permissão concedida!
          </div>
        ) : denied ? (
          <div className="mt-5 p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Permissão recusada ou bloqueada no navegador.</span>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={handleAllow}
              className="w-full py-3 px-4 rounded-xl bg-[#F5C542] text-[#080808] font-bold text-xs uppercase tracking-wider hover:brightness-105 active:scale-[0.98] transition-all shadow-md shadow-[#F5C542]/20"
            >
              Ativar Notificações
            </button>
            <button
              onClick={() => setIsNotificationPromptOpen(false)}
              className="w-full py-2.5 px-4 rounded-xl text-xs text-[#A3A3A3] hover:text-white transition-colors"
            >
              Agora não
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
