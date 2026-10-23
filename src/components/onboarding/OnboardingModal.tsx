import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  User, 
  Phone, 
  Mail, 
  Scissors, 
  MapPin, 
  Bell, 
  KeyRound, 
  Compass 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OnboardingModal: React.FC = () => {
  const { 
    isOnboardingOpen, 
    setIsOnboardingOpen, 
    user, 
    updateUserProfile, 
    services, 
    setActiveTab, 
    requestNotificationPermission 
  } = useApp();

  const [step, setStep] = useState(1);
  const totalSteps = 9;

  // Form states
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [email, setEmail] = useState(user.email || '');
  const [selectedServices, setSelectedServices] = useState<string[]>(user.preferredServices || []);
  const [locationPref, setLocationPref] = useState('Maricá - Centro');
  const [notificationsGranted, setNotificationsGranted] = useState(false);
  const [password, setPassword] = useState('');

  if (!isOnboardingOpen) return null;

  const handleNext = async () => {
    if (step === 2 && !name.trim()) return;
    if (step === 3 && !phone.trim()) return;
    if (step === 4 && !email.trim()) return;

    if (step === 7) {
      const ok = await requestNotificationPermission();
      setNotificationsGranted(ok);
    }

    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      // Finalize onboarding
      updateUserProfile({
        name,
        phone,
        email,
        preferredServices: selectedServices,
        hasCompletedOnboarding: true,
      });
      setIsOnboardingOpen(false);
      setActiveTab('home');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      setIsOnboardingOpen(false);
    }
  };

  const toggleService = (srvName: string) => {
    setSelectedServices((prev) =>
      prev.includes(srvName) ? prev.filter((s) => s !== srvName) : [...prev, srvName]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-3xl glass-surface-elevated p-6 sm:p-8 border border-[#F5C542]/30 shadow-2xl flex flex-col justify-between min-h-[480px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        {/* Top Progress & Back */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#A3A3A3] hover:text-white transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Stepper Dots */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx + 1 === step
                      ? 'w-6 bg-[#F5C542]'
                      : idx + 1 < step
                      ? 'w-2 bg-[#F5C542]/50'
                      : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                updateUserProfile({ hasCompletedOnboarding: true });
                setIsOnboardingOpen(false);
              }}
              className="text-xs text-[#A3A3A3] hover:text-white transition-colors py-1 px-2"
            >
              Pular
            </button>
          </div>

          {/* Step 1: Apresentação */}
          {step === 1 && (
            <div className="text-center py-4 space-y-3">
              <div className="w-20 h-20 rounded-3xl bg-black border border-[#F5C542]/40 p-1 mx-auto flex items-center justify-center shadow-lg shadow-[#F5C542]/20 overflow-hidden">
                <img src="/logo.png" alt="Barbershop Rocha" className="w-full h-full object-contain" />
              </div>
              <h2 id="onboarding-title" className="text-2xl font-black text-white tracking-tight">
                Barbershop Rocha
              </h2>
              <p className="text-xs uppercase tracking-widest text-[#F5C542] font-bold">
                Além do corte
              </p>
              <p className="text-sm text-[#A3A3A3] max-w-sm mx-auto leading-relaxed pt-2">
                Bem-vindo ao espaço onde visagismo, precisão e bem-estar se encontram. Vamos configurar sua experiência personalizada em menos de 1 minuto.
              </p>
            </div>
          )}

          {/* Step 2: Nome */}
          {step === 2 && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2.5 text-[#F5C542]">
                <User className="w-5 h-5" />
                <span className="text-xs uppercase font-bold tracking-wider">Etapa 2 de 9</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Como podemos te chamar?
              </h2>
              <p className="text-xs text-[#A3A3A3]">
                Seu nome será utilizado para personalizar suas confirmações e saudações.
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                autoFocus
                className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-[#F5C542] transition-colors text-sm"
              />
            </div>
          )}

          {/* Step 3: WhatsApp */}
          {step === 3 && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2.5 text-[#F5C542]">
                <Phone className="w-5 h-5" />
                <span className="text-xs uppercase font-bold tracking-wider">Etapa 3 de 9</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Qual é o seu WhatsApp?
              </h2>
              <p className="text-xs text-[#A3A3A3]">
                Para enviar comprovantes de horários marcados e avisos rápidos de vaga.
              </p>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(21) 99999-9999"
                autoFocus
                className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-[#F5C542] transition-colors text-sm"
              />
            </div>
          )}

          {/* Step 4: E-mail */}
          {step === 4 && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2.5 text-[#F5C542]">
                <Mail className="w-5 h-5" />
                <span className="text-xs uppercase font-bold tracking-wider">Etapa 4 de 9</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Qual seu e-mail preferido?
              </h2>
              <p className="text-xs text-[#A3A3A3]">
                Usado para sincronização do histórico e gerenciamento de assinaturas.
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                autoFocus
                className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-[#F5C542] transition-colors text-sm"
              />
            </div>
          )}

          {/* Step 5: Preferências de Serviços */}
          {step === 5 && (
            <div className="space-y-3 py-1">
              <div className="flex items-center gap-2.5 text-[#F5C542]">
                <Scissors className="w-5 h-5" />
                <span className="text-xs uppercase font-bold tracking-wider">Etapa 5 de 9</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Quais serviços você mais utiliza?
              </h2>
              <p className="text-xs text-[#A3A3A3]">
                Selecione os procedimentos que prefere para atalhos personalizados.
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {services.slice(0, 8).map((srv) => {
                  const isChecked = selectedServices.includes(srv.name);
                  return (
                    <button
                      key={srv.id}
                      onClick={() => toggleService(srv.name)}
                      className={`p-2.5 rounded-xl text-left border text-xs transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-[#F5C542]/20 border-[#F5C542] text-white font-semibold'
                          : 'bg-white/5 border-white/10 text-[#A3A3A3] hover:text-white'
                      }`}
                    >
                      <span className="truncate">{srv.name}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-[#F5C542] shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 6: Localização */}
          {step === 6 && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2.5 text-[#F5C542]">
                <MapPin className="w-5 h-5" />
                <span className="text-xs uppercase font-bold tracking-wider">Etapa 6 de 9</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Você reside em Maricá ou região?
              </h2>
              <p className="text-xs text-[#A3A3A3]">
                Nossa unidade fica na Rua B Lote 44 loja 2 em Maricá RJ.
              </p>
              <div className="space-y-2">
                {['Maricá (Centro / Itaipuaçu / Região)', 'Niterói / São Gonçalo', 'Rio de Janeiro / Outra'].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocationPref(loc)}
                    className={`w-full p-3 rounded-2xl text-left border text-xs transition-all flex items-center justify-between ${
                      locationPref === loc
                        ? 'bg-[#F5C542]/20 border-[#F5C542] text-white font-semibold'
                        : 'bg-white/5 border-white/10 text-[#A3A3A3]'
                    }`}
                  >
                    <span>{loc}</span>
                    {locationPref === loc && <Check className="w-4 h-4 text-[#F5C542]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Notificações */}
          {step === 7 && (
            <div className="text-center py-3 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#F5C542]/20 border border-[#F5C542]/40 text-[#F5C542] mx-auto flex items-center justify-center">
                <Bell className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Permitir lembretes pontuais?
              </h2>
              <p className="text-xs text-[#A3A3A3] max-w-sm mx-auto leading-relaxed">
                Você nunca mais perderá um horário agendado com Guilherme Rocha. Nós avisamos antes do atendimento.
              </p>
              <div className="pt-2">
                <span className="text-[11px] text-[#F5C542]">
                  {notificationsGranted ? 'Permissão já configurada!' : 'Clique em continuar para conceder autorização.'}
                </span>
              </div>
            </div>
          )}

          {/* Step 8: Cadastro ou Login */}
          {step === 8 && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2.5 text-[#F5C542]">
                <KeyRound className="w-5 h-5" />
                <span className="text-xs uppercase font-bold tracking-wider">Etapa 8 de 9</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Defina sua senha de acesso
              </h2>
              <p className="text-xs text-[#A3A3A3]">
                Para proteger seus agendamentos e assinaturas no dispositivo.
              </p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha de 6 dígitos"
                className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-[#F5C542] transition-colors text-sm"
              />
              <p className="text-[11px] text-[#A3A3A3]">
                Sua conta fica vinculada ao e-mail <strong className="text-white">{email || 'stormilamego@gmail.com'}</strong>.
              </p>
            </div>
          )}

          {/* Step 9: Apresentação das Principais Seções */}
          {step === 9 && (
            <div className="space-y-3 py-1">
              <div className="flex items-center gap-2.5 text-[#F5C542]">
                <Compass className="w-5 h-5" />
                <span className="text-xs uppercase font-bold tracking-wider">Tudo Pronto!</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Conheça o ecossistema Rocha
              </h2>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <strong className="text-[#F5C542]">1. Catálogo Completo:</strong> 14 serviços exclusivos com duração e preços transparentes.
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <strong className="text-[#F5C542]">2. Signature Club:</strong> Planos ilimitados para manter corte e barba sempre no padrão.
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <strong className="text-[#F5C542]">3. Agendamento Inteligente:</strong> Escolha dia e horário sem filas de espera.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation CTA */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-[#A3A3A3]">
            {step} de {totalSteps}
          </span>
          <button
            onClick={handleNext}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#F5C542] to-[#D4A325] text-[#080808] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#F5C542]/20 hover:brightness-105 active:scale-95 transition-all"
          >
            <span>{step === totalSteps ? 'Acessar Barbearia' : 'Continuar'}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
