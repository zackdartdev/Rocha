import React, { useState, useMemo } from 'react';
import { 
  X, 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  MapPin, 
  Check, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatBRL, formatDateBR, generateAvailableTimeSlots } from '../../utils/rules';
import { PaymentMethod, ServiceItem } from '../../types';

export const BookingModal: React.FC = () => {
  const { 
    isBookingModalOpen, 
    setIsBookingModalOpen, 
    services, 
    professionals, 
    appointments, 
    businessSettings, 
    selectedServiceForBooking, 
    setSelectedServiceForBooking,
    addAppointment,
    user
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(selectedServiceForBooking || services[1] || services[0]);
  const [selectedProfessional] = useState(professionals[0]); // Guilherme Rocha
  
  // Date selection (default today or tomorrow)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(user.activeSubscriptionId ? 'assinatura_club' : 'pix');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Synchronize when opened with a preselected service
  React.useEffect(() => {
    if (selectedServiceForBooking) {
      setSelectedService(selectedServiceForBooking);
    }
  }, [selectedServiceForBooking]);

  // Compute available dates (next 14 days, excluding Sundays if closed)
  const availableDates = useMemo(() => {
    const list: { dateStr: string; dayNum: number; dayName: string; isSunday: boolean }[] = [];
    const base = new Date();
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(base.getDate() + i);
      const dayOfWeek = d.getDay();
      const dateStr = d.toISOString().split('T')[0];
      list.push({
        dateStr,
        dayNum: d.getDate(),
        dayName: dayNames[dayOfWeek],
        isSunday: dayOfWeek === 0,
      });
    }
    return list;
  }, []);

  // Compute available time slots dynamically
  const availableSlots = useMemo(() => {
    if (!selectedService || !selectedProfessional) return [];
    return generateAvailableTimeSlots(
      selectedDate,
      selectedService.durationMinutes,
      appointments,
      selectedProfessional
    );
  }, [selectedDate, selectedService, selectedProfessional, appointments]);

  if (!isBookingModalOpen) return null;

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setSelectedServiceForBooking(null);
    setCurrentStep(1);
    setBookingConfirmed(false);
  };

  const handleConfirmBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    addAppointment({
      clientName: user.name || 'Cliente Rocha',
      clientPhone: user.phone || '(21) 98765-4321',
      clientEmail: user.email || 'cliente@email.com',
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      professionalId: selectedProfessional.id,
      professionalName: selectedProfessional.name,
      date: selectedDate,
      time: selectedTime,
      durationMinutes: selectedService.durationMinutes,
      priceAgreed: selectedService.price,
      address: businessSettings.address,
      status: 'confirmado',
      serviceExecutionStatus: 'pendente',
      paymentStatus: paymentMethod === 'assinatura_club' ? 'pago' : 'pendente',
      paymentMethod,
    });

    setBookingConfirmed(true);
  };

  const mapsQuery = encodeURIComponent(businessSettings.address);
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${mapsQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  const mapsExternalUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-xl rounded-3xl glass-surface-elevated border border-[#F5C542]/30 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-[#F5C542]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#141414]/90 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            {currentStep > 1 && !bookingConfirmed && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#A3A3A3] hover:text-white transition-colors"
                aria-label="Voltar etapa"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 id="booking-modal-title" className="text-base font-bold text-white tracking-tight">
                {bookingConfirmed ? 'Agendamento Confirmado' : 'Agendar Horário'}
              </h2>
              <p className="text-[11px] text-[#A3A3A3]">
                {businessSettings.name} — {businessSettings.slogan}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#A3A3A3] hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Confirmed State Screen */}
          {bookingConfirmed ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Horário Reservado!
                </h3>
                <p className="text-xs text-[#A3A3A3] mt-1 max-w-sm mx-auto">
                  Seu atendimento está registrado em nosso sistema e sincronizado no aplicativo.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-[#F5C542]/30 text-left max-w-sm mx-auto space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-[#A3A3A3]">Serviço</span>
                  <span className="font-bold text-white">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-[#A3A3A3]">Profissional</span>
                  <span className="font-semibold text-white">{selectedProfessional.name}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-[#A3A3A3]">Data e Horário</span>
                  <span className="font-bold text-[#F5C542]">
                    {formatDateBR(selectedDate)} às {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-[#A3A3A3]">Valor Contratado</span>
                  <span className="font-bold text-white">
                    {paymentMethod === 'assinatura_club' ? 'Incluso no Signature Club' : formatBRL(selectedService?.price || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-start pt-1">
                  <span className="text-[#A3A3A3] shrink-0">Endereço</span>
                  <span className="font-medium text-white text-right ml-2">{businessSettings.address}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
                <a
                  href={`https://wa.me/${businessSettings.whatsapp}?text=${encodeURIComponent(
                    `Olá Guilherme! Agendei ${selectedService?.name} para o dia ${formatDateBR(selectedDate)} às ${selectedTime} pelo app Rocha.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  Confirmar no WhatsApp
                </a>
                <button
                  onClick={handleClose}
                  className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
                >
                  Concluir
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Stepper Navigation Indicator */}
              <div className="flex items-center justify-between text-xs text-[#A3A3A3] border-b border-white/5 pb-2">
                <span className="font-semibold text-white">
                  Etapa {currentStep} de 5: {
                    currentStep === 1 ? 'Serviço' :
                    currentStep === 2 ? 'Data' :
                    currentStep === 3 ? 'Horário' :
                    currentStep === 4 ? 'Localização & Mapa' : 'Revisão & Pagamento'
                  }
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 rounded-full transition-all ${
                        s === currentStep ? 'w-5 bg-[#F5C542]' : s < currentStep ? 'w-2 bg-[#F5C542]/50' : 'w-2 bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Step 1: Serviço */}
              {currentStep === 1 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Selecione o Serviço</h3>
                    <span className="text-[11px] text-[#A3A3A3]">{services.length} disponíveis</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
                    {services.map((srv) => {
                      const isSelected = selectedService?.id === srv.id;
                      return (
                        <div
                          key={srv.id}
                          onClick={() => setSelectedService(srv)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-2.5 ${
                            isSelected
                              ? 'bg-[#F5C542]/15 border-[#F5C542] shadow-md shadow-[#F5C542]/10'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-black/40">
                              <img src={srv.imageUrl} alt={srv.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{srv.name}</p>
                              <p className="text-[10px] text-[#A3A3A3] flex items-center gap-1.5 mt-0.5">
                                <span>{srv.durationMinutes} min</span>
                                <span>·</span>
                                <span className="text-[#F5C542] font-semibold">{formatBRL(srv.price)}</span>
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#F5C542] text-black flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Professional Banner */}
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#F5C542]/40">
                        <img src={selectedProfessional.avatarUrl} alt={selectedProfessional.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{selectedProfessional.name}</p>
                        <p className="text-[10px] text-[#A3A3A3]">{selectedProfessional.title}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#F5C542] font-semibold bg-[#F5C542]/10 px-2 py-0.5 rounded-full">
                      Barbeiro Oficial
                    </span>
                  </div>
                </div>
              )}

              {/* Step 2: Data */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-[#F5C542]" />
                      Escolha a Data do Atendimento
                    </h3>
                  </div>

                  <p className="text-xs text-[#A3A3A3]">
                    Atendimento de Segunda a Sábado. Domingos fechado.
                  </p>

                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {availableDates.map((item) => {
                      const isSelected = selectedDate === item.dateStr;
                      const isDisabled = item.isSunday;

                      return (
                        <button
                          key={item.dateStr}
                          disabled={isDisabled}
                          onClick={() => {
                            setSelectedDate(item.dateStr);
                            setSelectedTime('');
                          }}
                          className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center min-h-[64px] ${
                            isDisabled
                              ? 'opacity-30 border-white/5 bg-transparent cursor-not-allowed'
                              : isSelected
                              ? 'bg-[#F5C542] text-[#080808] border-[#F5C542] font-bold shadow-lg shadow-[#F5C542]/20 scale-105'
                              : 'bg-white/5 border-white/10 hover:border-white/20 text-white'
                          }`}
                        >
                          <span className={`text-[10px] uppercase font-semibold ${isSelected ? 'text-black/80' : 'text-[#A3A3A3]'}`}>
                            {item.dayName}
                          </span>
                          <span className="text-base font-extrabold mt-0.5">
                            {item.dayNum}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#A3A3A3]">
                    Data selecionada: <strong className="text-white">{formatDateBR(selectedDate)}</strong>
                  </div>
                </div>
              )}

              {/* Step 3: Horários Disponíveis */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#F5C542]" />
                      Horários Disponíveis em {formatDateBR(selectedDate)}
                    </h3>
                    <span className="text-[11px] text-[#A3A3A3]">
                      Duração: {selectedService?.durationMinutes} min
                    </span>
                  </div>

                  {availableSlots.length === 0 ? (
                    <div className="p-6 text-center rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <p className="text-xs font-semibold text-white">Nenhum horário livre nesta data.</p>
                      <p className="text-[11px] text-[#A3A3A3]">Tente selecionar outro dia para seu atendimento.</p>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="mt-2 text-xs text-[#F5C542] font-semibold hover:underline"
                      >
                        Trocar Data
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-1">
                      {availableSlots.map((slot) => {
                        const isSelected = selectedTime === slot;
                        return (
                          <button
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border ${
                              isSelected
                                ? 'bg-[#F5C542] text-[#080808] border-[#F5C542] shadow-md shadow-[#F5C542]/20 scale-105'
                                : 'bg-white/5 border-white/10 text-white hover:border-white/25 hover:bg-white/10'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {selectedTime && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#A3A3A3] flex items-center justify-between">
                      <span>Horário selecionado:</span>
                      <strong className="text-[#F5C542] text-sm">{selectedTime}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Localização & Google Maps Embed */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#F5C542]" />
                      Localização da Barbearia
                    </h3>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
                    <p className="font-bold text-white text-sm">{businessSettings.name}</p>
                    <p className="text-[#A3A3A3]">{businessSettings.address}</p>
                    <p className="text-[11px] text-[#F5C542] font-medium">{businessSettings.openingHours}</p>
                  </div>

                  {/* Integrated Google Maps Iframe & Link */}
                  <div className="rounded-2xl overflow-hidden border border-white/15 h-56 bg-neutral-900 relative">
                    <iframe
                      title="Google Maps Barbershop Rocha Maricá"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={mapsEmbedUrl}
                    />
                  </div>

                  <a
                    href={mapsExternalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#F5C542] hover:underline font-semibold"
                  >
                    <span>Abrir direções no Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Step 5: Revisão & Forma de Pagamento */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white">Revisão e Forma de Pagamento</h3>

                  {/* Summary */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-[#A3A3A3]">Serviço</span>
                      <span className="font-bold text-white">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-[#A3A3A3]">Data e Horário</span>
                      <span className="font-bold text-[#F5C542]">
                        {formatDateBR(selectedDate)} às {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#A3A3A3]">Total a Pagar</span>
                      <span className="font-extrabold text-base text-white">
                        {paymentMethod === 'assinatura_club' ? 'Incluso no Plano' : formatBRL(selectedService?.price || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <label className="text-xs text-[#A3A3A3] font-semibold uppercase tracking-wider">
                      Escolha como prefere acertar:
                    </label>

                    {user.activeSubscriptionId && (
                      <button
                        onClick={() => setPaymentMethod('assinatura_club')}
                        className={`w-full p-3 rounded-2xl border text-left text-xs transition-all flex items-center justify-between ${
                          paymentMethod === 'assinatura_club'
                            ? 'bg-[#F5C542]/20 border-[#F5C542] text-white font-bold'
                            : 'bg-white/5 border-white/10 text-[#A3A3A3]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-4 h-4 text-[#F5C542]" />
                          <span>Utilizar benefício Signature Club (Sem custo adicional)</span>
                        </div>
                        {paymentMethod === 'assinatura_club' && <Check className="w-4 h-4 text-[#F5C542]" />}
                      </button>
                    )}

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setPaymentMethod('pix')}
                        className={`p-3 rounded-xl border text-center text-xs transition-all flex flex-col items-center justify-center gap-1 ${
                          paymentMethod === 'pix'
                            ? 'bg-[#F5C542]/20 border-[#F5C542] text-white font-bold'
                            : 'bg-white/5 border-white/10 text-[#A3A3A3]'
                        }`}
                      >
                        <QrCode className="w-4 h-4 text-[#F5C542]" />
                        <span>PIX</span>
                      </button>

                      <button
                        onClick={() => setPaymentMethod('credito')}
                        className={`p-3 rounded-xl border text-center text-xs transition-all flex flex-col items-center justify-center gap-1 ${
                          paymentMethod === 'credito'
                            ? 'bg-[#F5C542]/20 border-[#F5C542] text-white font-bold'
                            : 'bg-white/5 border-white/10 text-[#A3A3A3]'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-[#F5C542]" />
                        <span>Cartão</span>
                      </button>

                      <button
                        onClick={() => setPaymentMethod('dinheiro')}
                        className={`p-3 rounded-xl border text-center text-xs transition-all flex flex-col items-center justify-center gap-1 ${
                          paymentMethod === 'dinheiro'
                            ? 'bg-[#F5C542]/20 border-[#F5C542] text-white font-bold'
                            : 'bg-white/5 border-white/10 text-[#A3A3A3]'
                        }`}
                      >
                        <Banknote className="w-4 h-4 text-[#F5C542]" />
                        <span>Na Barbearia</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#A3A3A3] leading-relaxed">
                    * Pagamento realizado no momento do atendimento ou adiantado via PIX. Cancelamentos com até 2h de antecedência.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!bookingConfirmed && (
          <div className="px-5 py-4 border-t border-white/10 bg-[#141414]/90 backdrop-blur-md flex items-center justify-between shrink-0">
            <span className="text-xs text-[#A3A3A3]">
              {selectedService ? `${selectedService.name} · ${selectedService.durationMinutes} min` : ''}
            </span>

            {currentStep < 5 ? (
              <button
                disabled={
                  (currentStep === 1 && !selectedService) ||
                  (currentStep === 2 && !selectedDate) ||
                  (currentStep === 3 && !selectedTime)
                }
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="py-2.5 px-5 rounded-xl bg-[#F5C542] hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed text-[#080808] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-[#F5C542]/20"
              >
                <span>Avançar</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <button
                onClick={handleConfirmBooking}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#F5C542] to-[#D4A325] text-[#080808] font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-105 active:scale-95 transition-all shadow-lg shadow-[#F5C542]/25"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirmar Agendamento</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
