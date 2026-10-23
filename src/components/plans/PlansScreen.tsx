import React, { useState } from 'react';
import { Crown, Check, AlertCircle, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatBRL } from '../../utils/rules';
import { SubscriptionPlan } from '../../types';

export const PlansScreen: React.FC = () => {
  const { plans, user, subscribeToPlan, cancelSubscription, setActiveTab } = useApp();
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SubscriptionPlan | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const activePlan = plans.find((p) => p.id === user.activeSubscriptionId);

  const handleConfirmSubscription = () => {
    if (!selectedPlanForCheckout) return;
    subscribeToPlan(selectedPlanForCheckout.id);
    setCheckoutSuccess(true);
    setTimeout(() => {
      setSelectedPlanForCheckout(null);
      setCheckoutSuccess(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-24 max-w-6xl mx-auto px-4 sm:px-6 pt-4 animate-fade-in">
      {/* Editorial Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5C542]/15 border border-[#F5C542]/30 text-[#F5C542] text-xs font-semibold uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5" />
          <span>Assinaturas Oficiais</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Signature Club Rocha
        </h2>
        <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
          Corte e barba com frequência livre mediante mensalidade fixa. Sem preocupações e sempre impecável.
        </p>
      </div>

      {/* Active Subscription Banner if user has one */}
      {activePlan && (
        <div className="rounded-3xl p-5 bg-gradient-to-r from-[#2A200B] via-[#1B1B1B] to-[#111111] border border-[#F5C542]/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#F5C542]/20 border border-[#F5C542]/40 text-[#F5C542] flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#F5C542]">
                Plano Ativo no Seu Perfil
              </span>
              <h3 className="text-base font-black text-white">{activePlan.name}</h3>
              <p className="text-xs text-[#A3A3A3]">
                {formatBRL(activePlan.priceMonthly)}/mês · Dias válidos: {activePlan.daysAllowed}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('appointments')}
              className="py-2 px-4 rounded-xl bg-[#F5C542] text-[#080808] font-bold text-xs uppercase tracking-wider hover:brightness-105 transition-all shadow-md shadow-[#F5C542]/20"
            >
              Agendar com Meu Plano
            </button>
            <button
              onClick={cancelSubscription}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-red-500/10 text-[#A3A3A3] hover:text-red-400 text-xs font-semibold border border-white/10 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* 3 Plans Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => {
          const isCurrent = user.activeSubscriptionId === plan.id;
          return (
            <div
              key={plan.id}
              className={`rounded-3xl glass-surface p-6 flex flex-col justify-between relative transition-all duration-300 ${
                plan.isPopular
                  ? 'border-[#F5C542] shadow-xl shadow-[#F5C542]/10 scale-[1.02]'
                  : 'border-white/10 hover:border-white/25'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3.5 py-1 rounded-full bg-[#F5C542] text-[#080808] text-[10px] font-extrabold uppercase tracking-widest shadow-md">
                    Mais Escolhido
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-black text-white">{plan.name}</h3>
                  <p className="text-[11px] text-[#A3A3A3] uppercase tracking-wider font-semibold mt-0.5">
                    {plan.commercialName}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 py-1">
                  <span className="text-3xl font-black text-[#F5C542]">
                    {formatBRL(plan.priceMonthly)}
                  </span>
                  <span className="text-xs text-[#A3A3A3] font-medium">/mês</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/90">
                  <span className="text-[#A3A3A3] text-[10px] uppercase font-bold block">
                    Dias de Utilização:
                  </span>
                  <span className="font-semibold text-white">{plan.daysAllowed}</span>
                </div>

                {/* Included Services */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs text-[#A3A3A3] uppercase font-bold tracking-wider block">
                    Serviços Inclusos:
                  </span>
                  <ul className="space-y-1.5 text-xs text-white">
                    {plan.includedServices.map((inc, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#F5C542] shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rules List */}
                <div className="pt-2 border-t border-white/5 space-y-1.5 text-[11px] text-[#A3A3A3] leading-relaxed">
                  {plan.rules.slice(0, 3).map((rule, idx) => (
                    <p key={idx}>· {rule}</p>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                {isCurrent ? (
                  <div className="w-full py-3 rounded-2xl bg-[#F5C542]/15 text-[#F5C542] font-bold text-xs uppercase tracking-wider text-center border border-[#F5C542]/40">
                    Seu Plano Atual
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedPlanForCheckout(plan)}
                    className={`w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-md ${
                      plan.isPopular
                        ? 'bg-[#F5C542] text-[#080808] hover:brightness-105 shadow-[#F5C542]/20'
                        : 'bg-white/10 text-white hover:bg-white/15'
                    }`}
                  >
                    Contratar {plan.name.split('—')[0]}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* General Rules & Conditions */}
      <div className="rounded-3xl glass-surface border border-white/10 p-6 space-y-3">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#F5C542]" />
          Regras e Condições Gerais dos Planos
        </h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#A3A3A3] leading-relaxed">
          <li>• Os planos são mensais, mediante pagamento da mensalidade contratada.</li>
          <li>• A utilização é permitida somente nos dias previstos para cada plano.</li>
          <li>• Apenas os serviços incluídos fazem parte do benefício contratado.</li>
          <li>• Serviços adicionais são cobrados separadamente conforme a tabela vigente.</li>
          <li>• O plano é pessoal e intransferível.</li>
          <li>• O atendimento depende da disponibilidade e das regras de agendamento.</li>
          <li>• Serviços não utilizados não acumulam nem geram desconto no mês seguinte.</li>
          <li>• Dúvidas sobre os serviços incluídos devem ser esclarecidas com Guilherme Rocha.</li>
        </ul>
      </div>

      {/* Checkout Modal Simulation */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl glass-surface-elevated p-6 border border-[#F5C542]/30 shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedPlanForCheckout(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Fechar"
            >
              <XClose className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#F5C542]/20 text-[#F5C542] border border-[#F5C542]/40 flex items-center justify-center mx-auto">
              <Crown className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-black text-white">{selectedPlanForCheckout.name}</h3>
              <p className="text-xs text-[#A3A3A3] mt-0.5">Barbershop Rocha — Signature Club</p>
            </div>

            {checkoutSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold text-center flex items-center justify-center gap-2 animate-bounce">
                <Check className="w-5 h-5 stroke-[3]" />
                Assinatura ativada com sucesso!
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#A3A3A3]">Mensalidade</span>
                    <span className="font-extrabold text-[#F5C542] text-sm">
                      {formatBRL(selectedPlanForCheckout.priceMonthly)}/mês
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A3A3A3]">Cobrança</span>
                    <span className="text-white font-medium">Recorrente Mensal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A3A3A3]">Dias permitidos</span>
                    <span className="text-white font-medium">{selectedPlanForCheckout.daysAllowed}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[#A3A3A3]">
                  A ativação da assinatura confere acesso imediato aos agendamentos sem custos avulsos dos serviços cobertos.
                </div>

                <button
                  onClick={handleConfirmSubscription}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#F5C542] to-[#D4A325] text-[#080808] font-bold text-xs uppercase tracking-wider hover:brightness-105 active:scale-95 transition-all shadow-lg shadow-[#F5C542]/20"
                >
                  Confirmar e Ativar Assinatura
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const XClose = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
