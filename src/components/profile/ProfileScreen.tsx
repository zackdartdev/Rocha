import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Crown, 
  Moon, 
  Sun, 
  Bell, 
  Download, 
  ShieldCheck, 
  LogOut, 
  Check, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const ProfileScreen: React.FC = () => {
  const { 
    user, 
    updateUserProfile, 
    theme, 
    toggleTheme, 
    plans, 
    setActiveTab, 
    setIsPwaPromptOpen,
    setIsNotificationPromptOpen,
    setWelcomeSeen
  } = useApp();

  const { isInstalled } = usePWAInstall();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const activePlan = plans.find((p) => p.id === user.activeSubscriptionId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, phone, email });
    setIsEditing(false);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handleResetData = () => {
    if (window.confirm('Deseja redefinir as preferências e ver a tela de introdução novamente?')) {
      setWelcomeSeen(false);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto px-4 sm:px-6 pt-4 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Perfil e Configurações</h2>
        <p className="text-xs text-[#A3A3A3]">
          Gerencie seus dados pessoais, preferências de tema e notificações da Rocha.
        </p>
      </div>

      {savedFeedback && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" /> Dados atualizados com sucesso!
        </div>
      )}

      {/* User Identity Card */}
      <div className="rounded-3xl glass-surface border border-white/10 p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#222222] to-[#111111] border-2 border-[#F5C542]/40 text-[#F5C542] text-2xl font-black flex items-center justify-center shadow-xl shadow-[#F5C542]/10 shrink-0">
            {user.name ? user.name.charAt(0).toUpperCase() : 'R'}
          </div>

          <div>
            <h3 className="text-lg font-black text-white">{user.name || 'Cliente Rocha'}</h3>
            <p className="text-xs text-[#A3A3A3] mt-0.5">{user.email || 'stormilamego@gmail.com'}</p>
            <p className="text-xs text-[#A3A3A3]">{user.phone || '(21) 99123-4567'}</p>

            <div className="flex items-center gap-2 justify-center sm:justify-start mt-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#F5C542]/15 text-[#F5C542] border border-[#F5C542]/30">
                Cliente VIP
              </span>
              {activePlan && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Crown className="w-3 h-3" /> Club Ativo
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
        >
          {isEditing ? 'Cancelar' : 'Editar Dados'}
        </button>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="rounded-3xl glass-surface border border-white/10 p-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Editar Informações</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-[#A3A3A3] block mb-1">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#F5C542]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#A3A3A3] block mb-1">Telefone (WhatsApp)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#F5C542]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#A3A3A3] block mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#F5C542]"
              />
            </div>
          </div>
          <button
            type="submit"
            className="py-2.5 px-5 rounded-xl bg-[#F5C542] text-[#080808] font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-105"
          >
            Salvar Alterações
          </button>
        </form>
      )}

      {/* Signature Club Status Card */}
      <div className="rounded-3xl glass-surface border border-white/10 p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F5C542]/20 border border-[#F5C542]/40 text-[#F5C542] flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Signature Club Rocha</h4>
            <p className="text-xs text-[#A3A3A3]">
              {activePlan ? `Plano ativo: ${activePlan.name}` : 'Você ainda não possui um plano de assinatura ativo.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('plans')}
          className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors shrink-0"
        >
          {activePlan ? 'Gerenciar' : 'Assinar'}
        </button>
      </div>

      {/* Preferences Section */}
      <div className="rounded-3xl glass-surface border border-white/10 p-5 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#A3A3A3]">Preferências do App</h4>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-[#F5C542]" /> : <Sun className="w-4 h-4 text-[#C99A22]" />}
            <div>
              <p className="text-xs font-semibold text-white">Tema Visual</p>
              <p className="text-[11px] text-[#A3A3A3]">
                {theme === 'dark' ? 'Modo Escuro (Padrão Rocha)' : 'Modo Claro'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white font-medium"
          >
            Alternar para {theme === 'dark' ? 'Claro' : 'Escuro'}
          </button>
        </div>

        {/* Notification Alert Prompt */}
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-[#F5C542]" />
            <div>
              <p className="text-xs font-semibold text-white">Notificações Push</p>
              <p className="text-[11px] text-[#A3A3A3]">Lembretes de horários e avisos no celular</p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationPromptOpen(true)}
            className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white font-medium"
          >
            Configurar
          </button>
        </div>

        {/* Install PWA Button */}
        {!isInstalled && (
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-[#F5C542]" />
              <div>
                <p className="text-xs font-semibold text-white">Instalar Aplicativo</p>
                <p className="text-[11px] text-[#A3A3A3]">Adicionar à tela de início do seu aparelho</p>
              </div>
            </div>
            <button
              onClick={() => setIsPwaPromptOpen(true)}
              className="py-1.5 px-3 rounded-lg bg-[#F5C542] text-[#080808] text-xs font-bold shadow-sm"
            >
              Baixar App
            </button>
          </div>
        )}
      </div>

      {/* Admin Panel Entry */}
      <div className="rounded-3xl glass-surface-elevated border border-[#F5C542]/30 p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F5C542]/20 border border-[#F5C542]/40 text-[#F5C542] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Painel Administrativo da Barbearia
            </h4>
            <p className="text-[11px] text-[#A3A3A3]">
              Gestão de agenda, financeiro real, fluxo de caixa, serviços e clientes.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('admin')}
          className="py-2 px-4 rounded-xl bg-[#F5C542] text-[#080808] font-bold text-xs uppercase tracking-wider shrink-0 hover:brightness-105 active:scale-95 transition-all shadow-md shadow-[#F5C542]/20"
        >
          Acessar Painel
        </button>
      </div>

      {/* Reset Session Option */}
      <div className="text-center pt-2">
        <button
          onClick={handleResetData}
          className="text-xs text-[#A3A3A3] hover:text-red-400 transition-colors inline-flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Reiniciar introdução e preferências locais</span>
        </button>
      </div>
    </div>
  );
};
