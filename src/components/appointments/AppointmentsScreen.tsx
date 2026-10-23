import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ExternalLink,
  Receipt,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { canCancelAppointment, formatBRL, formatDateBR } from '../../utils/rules';
import { Appointment } from '../../types';

export const AppointmentsScreen: React.FC = () => {
  const { 
    appointments, 
    cancelAppointment, 
    businessSettings, 
    setIsBookingModalOpen 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'proximos' | 'historico' | 'cancelados'>('proximos');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancellationError, setCancellationError] = useState<string | null>(null);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      if (activeSubTab === 'proximos') {
        return app.status === 'confirmado' || app.status === 'aguardando_confirmacao' || app.status === 'em_atendimento';
      }
      if (activeSubTab === 'historico') {
        return app.status === 'concluido';
      }
      if (activeSubTab === 'cancelados') {
        return app.status === 'cancelado';
      }
      return true;
    });
  }, [appointments, activeSubTab]);

  const handleCancelClick = (app: Appointment) => {
    const check = canCancelAppointment(app.date, app.time, businessSettings.cancelationPolicyHours);
    if (!check.allowed) {
      setCancellationError(check.reason || 'Cancelamento indisponível');
      setTimeout(() => setCancellationError(null), 4000);
      return;
    }

    if (window.confirm(`Deseja realmente cancelar o agendamento de ${app.serviceName}?`)) {
      cancelAppointment(app.id, 'Cancelado pelo cliente no app');
      setSelectedAppointment(null);
    }
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmado':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Confirmado
          </span>
        );
      case 'em_atendimento':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F5C542]/20 text-[#F5C542] border border-[#F5C542]/30">
            Em Atendimento
          </span>
        );
      case 'concluido':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Concluído
          </span>
        );
      case 'cancelado':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            Cancelado
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/80">
            Pendente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-4 animate-fade-in">
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Meus Agendamentos</h2>
          <p className="text-xs text-[#A3A3A3]">
            Acompanhe seus horários marcados, histórico e status de atendimento.
          </p>
        </div>

        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="py-2.5 px-4 rounded-xl bg-[#F5C542] text-[#080808] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto hover:brightness-105 active:scale-95 transition-all shadow-md shadow-[#F5C542]/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Novo Agendamento</span>
        </button>
      </div>

      {/* Cancellation Error Alert */}
      {cancellationError && (
        <div className="p-3.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{cancellationError}</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveSubTab('proximos')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'proximos'
              ? 'bg-[#1D1D1D] text-white shadow-sm font-bold border border-[#F5C542]/30'
              : 'text-[#A3A3A3] hover:text-white'
          }`}
        >
          Próximos
        </button>
        <button
          onClick={() => setActiveSubTab('historico')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'historico'
              ? 'bg-[#1D1D1D] text-white shadow-sm font-bold border border-[#F5C542]/30'
              : 'text-[#A3A3A3] hover:text-white'
          }`}
        >
          Histórico
        </button>
        <button
          onClick={() => setActiveSubTab('cancelados')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'cancelados'
              ? 'bg-[#1D1D1D] text-white shadow-sm font-bold border border-[#F5C542]/30'
              : 'text-[#A3A3A3] hover:text-white'
          }`}
        >
          Cancelados
        </button>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="rounded-3xl glass-surface border border-white/10 p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#A3A3A3] flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">Nenhum agendamento encontrado</h3>
          <p className="text-xs text-[#A3A3A3] max-w-xs mx-auto">
            {activeSubTab === 'proximos'
              ? 'Você ainda não possui horários agendados para os próximos dias.'
              : 'Não há registros nesta categoria.'}
          </p>
          {activeSubTab === 'proximos' && (
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="mt-2 py-2 px-4 rounded-xl bg-[#F5C542] text-[#080808] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md shadow-[#F5C542]/20"
            >
              Agendar Primeiro Horário
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((app) => (
            <div
              key={app.id}
              className="rounded-3xl glass-surface border border-white/10 p-5 space-y-4 hover:border-white/20 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-extrabold text-base text-white">{app.serviceName}</span>
                  {getStatusBadge(app.status)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#F5C542]">
                    {formatBRL(app.priceAgreed)}
                  </span>
                  <span className="text-[10px] text-[#A3A3A3]">
                    ({app.paymentStatus === 'pago' ? 'Pago' : 'Pagamento Pendente'})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#A3A3A3]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#F5C542]" />
                  <span>{formatDateBR(app.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#F5C542]" />
                  <span>{app.time} ({app.durationMinutes} minutos)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F5C542]" />
                  <span>Profissional: {app.professionalName}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-[11px] text-[#A3A3A3] flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#F5C542] shrink-0" />
                  <span className="truncate">{app.address}</span>
                </p>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(app.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <span>Como Chegar</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {app.status === 'confirmado' && (
                    <button
                      onClick={() => handleCancelClick(app)}
                      className="py-1.5 px-3 rounded-lg text-red-400 hover:bg-red-500/10 text-xs font-semibold border border-red-500/30 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
