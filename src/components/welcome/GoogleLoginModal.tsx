import React, { useState } from 'react';
import { X, Check, Shield, User, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginWithGoogle, user } = useApp();
  const [selectedEmail, setSelectedEmail] = useState(user.email || 'stormilamego@gmail.com');
  const [selectedName, setSelectedName] = useState(user.name || 'Stormi Lamego');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (nameToUse: string, emailToUse: string) => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithGoogle({
        name: nameToUse,
        email: emailToUse,
      });
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 700);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-[#141414] border border-[#F5C542]/40 p-6 sm:p-7 shadow-2xl relative text-white space-y-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading || isSuccess}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#A3A3A3] hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Google Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md p-2 shrink-0">
            <svg className="w-full h-full" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white font-['Inter',sans-serif]">
              Fazer login com o Google
            </h3>
            <p className="text-xs text-[#A3A3A3]">
              Para acessar a Barbershop Rocha
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="text-lg font-black text-white font-['Inter',sans-serif]">
              Autenticado com sucesso!
            </h4>
            <p className="text-xs text-[#A3A3A3]">
              Bem-vindo à Barbershop Rocha, {selectedName}.
            </p>
          </div>
        ) : isLoading ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-10 h-10 border-3 border-[#F5C542] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#A3A3A3] font-medium">
              Conectando com a conta Google...
            </p>
          </div>
        ) : !isCustomMode ? (
          <div className="space-y-4">
            <p className="text-xs text-[#A3A3A3]">
              Selecione uma conta para continuar:
            </p>

            {/* Default Detected Google Account */}
            <button
              onClick={() => handleSignIn(selectedName, selectedEmail)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#F5C542] to-amber-600 text-black font-black flex items-center justify-center text-sm shadow-md">
                  {selectedName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-[#F5C542] transition-colors">
                    {selectedName}
                  </p>
                  <p className="text-xs text-[#A3A3A3]">
                    {selectedEmail}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#A3A3A3] group-hover:text-[#F5C542] group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Use Another Account Button */}
            <button
              onClick={() => setIsCustomMode(true)}
              className="w-full text-center text-xs text-[#F5C542] hover:underline font-semibold py-2"
            >
              Usar outra conta do Google
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignIn(selectedName, selectedEmail);
            }}
            className="space-y-3.5"
          >
            <div>
              <label className="text-xs font-semibold text-[#A3A3A3] block mb-1">
                Nome completo
              </label>
              <input
                type="text"
                required
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-[#F5C542] outline-none"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#A3A3A3] block mb-1">
                E-mail Google (@gmail.com)
              </label>
              <input
                type="email"
                required
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-[#F5C542] outline-none"
                placeholder="seuemail@gmail.com"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCustomMode(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#A3A3A3] transition-colors"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#F5C542] hover:bg-[#FBE288] text-[#080808] text-xs font-extrabold uppercase tracking-wide transition-all shadow-md active:scale-95"
              >
                Continuar
              </button>
            </div>
          </form>
        )}

        {/* Security Disclaimers */}
        <div className="pt-3 border-t border-white/10 flex items-start gap-2 text-[10px] text-[#A3A3A3] leading-relaxed">
          <Shield className="w-3.5 h-3.5 text-[#F5C542] shrink-0 mt-0.5" />
          <span>
            Ao continuar, o Google compartilhará seu nome, e-mail e preferências com a Barbershop Rocha para gerenciar seus agendamentos e planos.
          </span>
        </div>
      </div>
    </div>
  );
};
