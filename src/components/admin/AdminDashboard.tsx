import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  Scissors, 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  FileSpreadsheet, 
  Edit3, 
  Check, 
  X, 
  ArrowLeft,
  Search,
  Filter,
  CreditCard,
  QrCode,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatBRL, formatDateBR } from '../../utils/rules';
import { 
  Appointment, 
  AppointmentStatus, 
  ExpenseItem, 
  PaymentMethod, 
  PaymentStatus, 
  ServiceExecutionStatus, 
  ServiceItem 
} from '../../types';

type AdminTab = 'financeiro' | 'agenda' | 'servicos' | 'horarios' | 'configuracoes';

export const AdminDashboard: React.FC = () => {
  const { 
    appointments, 
    expenses, 
    services, 
    professionals, 
    businessSettings, 
    updateAppointmentStatus, 
    updateServiceExecutionStatus, 
    updatePaymentStatus,
    addExpense,
    updateExpenseStatus,
    updateService,
    addService,
    updateBusinessSettings,
    financialSummary,
    setActiveTab,
    plans
  } = useApp();

  const [currentAdminTab, setCurrentAdminTab] = useState<AdminTab>('financeiro');
  const [filterDate, setFilterDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // New Expense Form State
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState<ExpenseItem['category']>('produtos');
  const [expStatus, setExpStatus] = useState<'pago' | 'pendente'>('pago');

  // Service Edit State
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [editDuration, setEditDuration] = useState<string>('');

  // Commercial Settings Form
  const [bName, setBName] = useState(businessSettings.name);
  const [bSlogan, setBSlogan] = useState(businessSettings.slogan);
  const [bAddress, setBAddress] = useState(businessSettings.address);
  const [bPhone, setBPhone] = useState(businessSettings.phone);
  const [bPolicy, setBPolicy] = useState(businessSettings.cancelationPolicyHours.toString());

  // Today's appointments count
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = useMemo(() => {
    return appointments.filter((app) => app.date === todayStr && app.status !== 'cancelado');
  }, [appointments, todayStr]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      const matchSearch = 
        app.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.clientPhone.includes(searchTerm);
      const matchDate = !filterDate || app.date === filterDate;
      return matchSearch && matchDate;
    });
  }, [appointments, searchTerm, filterDate]);

  // Export Financial CSV
  const handleExportCSV = () => {
    const rows = [
      ['ID', 'Data', 'Cliente', 'Serviço', 'Valor Contratado', 'Execução', 'Pagamento', 'Método'],
      ...appointments.map((a) => [
        a.id,
        a.date,
        `"${a.clientName}"`,
        `"${a.serviceName}"`,
        a.priceAgreed.toFixed(2),
        a.serviceExecutionStatus,
        a.paymentStatus,
        a.paymentMethod || 'Não definido',
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_financeiro_rocha_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || !expAmount) return;

    const catLabels: Record<ExpenseItem['category'], string> = {
      produtos: 'Produtos',
      aluguel: 'Aluguel',
      energia_agua: 'Luz e Água',
      equipamentos: 'Equipamentos',
      marketing: 'Marketing',
      outros: 'Outros',
    };

    addExpense({
      title: expTitle,
      amount: parseFloat(expAmount),
      category: expCategory,
      categoryLabel: catLabels[expCategory],
      date: new Date().toISOString().split('T')[0],
      status: expStatus,
      paidDate: expStatus === 'pago' ? new Date().toISOString() : undefined,
    });

    setExpTitle('');
    setExpAmount('');
    setShowAddExpenseModal(false);
  };

  const handleSaveServiceEdit = () => {
    if (!editingService) return;
    updateService({
      ...editingService,
      price: parseFloat(editPrice) || editingService.price,
      durationMinutes: parseInt(editDuration, 10) || editingService.durationMinutes,
    });
    setEditingService(null);
  };

  const handleSaveCommercialSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessSettings({
      ...businessSettings,
      name: bName,
      slogan: bSlogan,
      address: bAddress,
      phone: bPhone,
      cancelationPolicyHours: parseInt(bPolicy, 10) || 2,
    });
  };

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-4 animate-fade-in">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors shrink-0"
            aria-label="Voltar para a área do cliente"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="w-10 h-10 rounded-xl bg-black border border-[#F5C542]/30 flex items-center justify-center p-1 shadow-md overflow-hidden shrink-0">
            <img src="/logo.png" alt="Barbershop Rocha" className="w-full h-full object-contain" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Painel de Gestão Rocha
              </h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#F5C542]/20 text-[#F5C542] border border-[#F5C542]/30">
                Administrador
              </span>
            </div>
            <p className="text-xs text-[#A3A3A3]">
              Controle de agenda, integridade financeira, serviços e configurações comerciais.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Exportar Relatório CSV</span>
        </button>
      </div>

      {/* Primary Financial & Operation Indicators Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Atendimentos Hoje */}
        <div className="p-4 rounded-3xl glass-surface border border-white/10 space-y-1">
          <span className="text-[11px] text-[#A3A3A3] font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#F5C542]" />
            Agendamentos Hoje
          </span>
          <p className="text-2xl font-black text-white tabular-nums">
            {todayAppointments.length}
          </p>
          <p className="text-[10px] text-[#A3A3A3]">Guilherme Rocha</p>
        </div>

        {/* Dinheiro Efetivamente Recebido */}
        <div className="p-4 rounded-3xl glass-surface border border-emerald-500/30 space-y-1 bg-emerald-500/5">
          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            Dinheiro Recebido (Caixa)
          </span>
          <p className="text-2xl font-black text-white tabular-nums">
            {formatBRL(financialSummary.cashReceived)}
          </p>
          <p className="text-[10px] text-emerald-400">Total liquidado</p>
        </div>

        {/* Contas a Receber (Serviços Concluídos Pendentes de Pagamento) */}
        <div className="p-4 rounded-3xl glass-surface border border-amber-500/30 space-y-1 bg-amber-500/5">
          <span className="text-[11px] text-amber-300 font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Contas a Receber (Pendente)
          </span>
          <p className="text-2xl font-black text-white tabular-nums">
            {formatBRL(financialSummary.accountsReceivable)}
          </p>
          <p className="text-[10px] text-amber-300">Cortes concluídos não pagos</p>
        </div>

        {/* Saldo Líquido de Caixa */}
        <div className="p-4 rounded-3xl glass-surface border border-[#F5C542]/40 space-y-1 bg-[#F5C542]/5">
          <span className="text-[11px] text-[#F5C542] font-medium flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" />
            Saldo Real em Caixa
          </span>
          <p className="text-2xl font-black text-[#F5C542] tabular-nums">
            {formatBRL(financialSummary.cashBalance)}
          </p>
          <p className="text-[10px] text-[#A3A3A3]">Recebido (-) Despesas Pagas</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-white/5">
        <button
          onClick={() => setCurrentAdminTab('financeiro')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            currentAdminTab === 'financeiro'
              ? 'bg-[#F5C542] text-[#080808] shadow-md shadow-[#F5C542]/20'
              : 'text-[#A3A3A3] hover:text-white bg-white/5'
          }`}
        >
          Financeiro & Despesas
        </button>

        <button
          onClick={() => setCurrentAdminTab('agenda')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            currentAdminTab === 'agenda'
              ? 'bg-[#F5C542] text-[#080808] shadow-md shadow-[#F5C542]/20'
              : 'text-[#A3A3A3] hover:text-white bg-white/5'
          }`}
        >
          Gestão de Agendamentos ({appointments.length})
        </button>

        <button
          onClick={() => setCurrentAdminTab('servicos')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            currentAdminTab === 'servicos'
              ? 'bg-[#F5C542] text-[#080808] shadow-md shadow-[#F5C542]/20'
              : 'text-[#A3A3A3] hover:text-white bg-white/5'
          }`}
        >
          Tabela de Serviços ({services.length})
        </button>

        <button
          onClick={() => setCurrentAdminTab('horarios')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            currentAdminTab === 'horarios'
              ? 'bg-[#F5C542] text-[#080808] shadow-md shadow-[#F5C542]/20'
              : 'text-[#A3A3A3] hover:text-white bg-white/5'
          }`}
        >
          Profissional & Jornada
        </button>

        <button
          onClick={() => setCurrentAdminTab('configuracoes')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            currentAdminTab === 'configuracoes'
              ? 'bg-[#F5C542] text-[#080808] shadow-md shadow-[#F5C542]/20'
              : 'text-[#A3A3A3] hover:text-white bg-white/5'
          }`}
        >
          Configurações Comerciais
        </button>
      </div>

      {/* Tab 1: Financeiro & Despesas */}
      {currentAdminTab === 'financeiro' && (
        <div className="space-y-6">
          <div className="rounded-3xl glass-surface border border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Diferenciação Financeira Fundamental
                </h3>
                <p className="text-xs text-[#A3A3A3]">
                  Serviço concluído registra faturamento, mas só ingressa no caixa após confirmação de recebimento.
                </p>
              </div>

              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="py-2 px-3.5 rounded-xl bg-[#F5C542] text-[#080808] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#F5C542]/20 hover:brightness-105"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Despesa</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[#A3A3A3]">Serviços Concluídos (Total Faturado):</span>
                <p className="text-lg font-black text-white">
                  {formatBRL(financialSummary.concludedServicesValue)}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[#A3A3A3]">Total de Despesas Registradas:</span>
                <p className="text-lg font-black text-red-400">
                  {formatBRL(financialSummary.totalExpenses)}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[#A3A3A3]">Despesas Pagas (Saídas Reais):</span>
                <p className="text-lg font-black text-amber-400">
                  {formatBRL(financialSummary.cashPaidExpenses)}
                </p>
              </div>
            </div>
          </div>

          {/* Expenses List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Despesas e Custos Operacionais
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="rounded-2xl glass-surface border border-white/10 p-4 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{exp.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                        {exp.categoryLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A3A3A3] mt-0.5">
                      Vencimento: {formatDateBR(exp.date)}
                    </p>
                  </div>

                  <div className="text-right flex items-center gap-2.5">
                    <div>
                      <p className="text-sm font-black text-white">{formatBRL(exp.amount)}</p>
                      <span
                        className={`text-[10px] font-bold ${
                          exp.status === 'pago' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {exp.status === 'pago' ? 'Liquidado' : 'Pendente'}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        updateExpenseStatus(exp.id, exp.status === 'pago' ? 'pendente' : 'pago')
                      }
                      className="py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] text-white font-medium border border-white/10"
                    >
                      {exp.status === 'pago' ? 'Reabrir' : 'Dar Baixa'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Gestão de Agendamentos */}
      {currentAdminTab === 'agenda' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A3A3]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar por cliente, telefone ou serviço..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#F5C542]"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#F5C542]"
              />
              {filterDate && (
                <button
                  onClick={() => setFilterDate('')}
                  className="text-xs text-[#A3A3A3] hover:text-white"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {filteredAppointments.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl glass-surface border border-white/10 p-4 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{app.clientName}</span>
                      <span className="text-xs text-[#A3A3A3]">({app.clientPhone})</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-medium">
                        {app.serviceName}
                      </span>
                    </div>
                    <p className="text-xs text-[#F5C542] font-semibold mt-0.5">
                      {formatDateBR(app.date)} às {app.time} ({app.durationMinutes} min)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">{formatBRL(app.priceAgreed)}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        app.paymentStatus === 'pago'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {app.paymentStatus === 'pago' ? 'Pago' : 'Não Pago'}
                    </span>
                  </div>
                </div>

                {/* Status Update Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#A3A3A3]">Execução:</span>
                    <button
                      onClick={() => updateServiceExecutionStatus(app.id, 'em_execucao')}
                      className={`py-1 px-2.5 rounded-lg border text-[11px] transition-colors ${
                        app.serviceExecutionStatus === 'em_execucao'
                          ? 'bg-[#F5C542] text-black font-bold border-[#F5C542]'
                          : 'bg-white/5 border-white/10 text-[#A3A3A3] hover:text-white'
                      }`}
                    >
                      Em Execução
                    </button>
                    <button
                      onClick={() => updateServiceExecutionStatus(app.id, 'concluido')}
                      className={`py-1 px-2.5 rounded-lg border text-[11px] transition-colors ${
                        app.serviceExecutionStatus === 'concluido'
                          ? 'bg-blue-600 text-white font-bold border-blue-500'
                          : 'bg-white/5 border-white/10 text-[#A3A3A3] hover:text-white'
                      }`}
                    >
                      Concluído
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#A3A3A3]">Pagamento:</span>
                    {app.paymentStatus !== 'pago' ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updatePaymentStatus(app.id, 'pago', 'pix')}
                          className="py-1 px-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[11px] font-semibold border border-emerald-500/30 transition-colors"
                        >
                          Recebido PIX
                        </button>
                        <button
                          onClick={() => updatePaymentStatus(app.id, 'pago', 'dinheiro')}
                          className="py-1 px-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[11px] font-semibold border border-emerald-500/30 transition-colors"
                        >
                          Dinheiro
                        </button>
                        <button
                          onClick={() => updatePaymentStatus(app.id, 'pago', 'credito')}
                          className="py-1 px-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[11px] font-semibold border border-emerald-500/30 transition-colors"
                        >
                          Cartão
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Recebimento Confirmado ({app.paymentMethod})
                      </span>
                    )}

                    {app.status !== 'cancelado' && (
                      <button
                        onClick={() => updateAppointmentStatus(app.id, 'cancelado', 'Cancelado pela administração')}
                        className="py-1 px-2 rounded-lg text-red-400 hover:bg-red-500/10 text-[11px] border border-red-500/20"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Gestão de Serviços */}
      {currentAdminTab === 'servicos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Tabela de Preços e Tempos (14 Serviços Oficiais)
            </h3>
            <span className="text-xs text-[#A3A3A3]">
              Valores antigos acordados em agendamentos passados são sempre preservados.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="rounded-2xl glass-surface border border-white/10 p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-900 shrink-0">
                    <img src={srv.imageUrl} alt={srv.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{srv.name}</h4>
                    <p className="text-[10px] text-[#A3A3A3]">{srv.categoryLabel}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="font-extrabold text-[#F5C542]">{formatBRL(srv.price)}</span>
                      <span className="text-white/40">·</span>
                      <span className="text-white/70">{srv.durationMinutes} min</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingService(srv);
                      setEditPrice(srv.price.toString());
                      setEditDuration(srv.durationMinutes.toString());
                    }}
                    className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => updateService({ ...srv, isActive: !srv.isActive })}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold ${
                      srv.isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {srv.isActive ? 'Ativo' : 'Inativo'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Service Modal */}
          {editingService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="w-full max-w-sm rounded-3xl glass-surface-elevated p-6 border border-[#F5C542]/30 shadow-2xl space-y-4">
                <h3 className="text-sm font-bold text-white">Editar {editingService.name}</h3>

                <div>
                  <label className="text-xs text-[#A3A3A3] block mb-1">Preço Atual (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#A3A3A3] block mb-1">Duração (minutos)</label>
                  <input
                    type="number"
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveServiceEdit}
                    className="flex-1 py-2.5 rounded-xl bg-[#F5C542] text-black font-bold text-xs uppercase tracking-wider"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditingService(null)}
                    className="py-2.5 px-4 rounded-xl bg-white/10 text-white text-xs"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Profissional & Jornada */}
      {currentAdminTab === 'horarios' && (
        <div className="space-y-4">
          <div className="rounded-3xl glass-surface border border-white/10 p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#F5C542]/40 bg-neutral-900">
                <img
                  src={professionals[0].avatarUrl}
                  alt={professionals[0].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{professionals[0].name}</h3>
                <p className="text-xs text-[#A3A3A3]">{professionals[0].title}</p>
                <p className="text-xs text-[#F5C542] mt-0.5">Barbeiro Exclusivo Barbershop Rocha</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[#A3A3A3] font-semibold block">Horário de Atendimento:</span>
                <p className="text-white font-bold">{professionals[0].workStart} às {professionals[0].workEnd}</p>
                <p className="text-[11px] text-[#A3A3A3]">Segunda a Sábado</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[#A3A3A3] font-semibold block">Intervalo de Almoço:</span>
                <p className="text-white font-bold">{professionals[0].lunchStart} às {professionals[0].lunchEnd}</p>
                <p className="text-[11px] text-emerald-400">Horários bloqueados automaticamente no sistema</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Configurações Comerciais */}
      {currentAdminTab === 'configuracoes' && (
        <form onSubmit={handleSaveCommercialSettings} className="rounded-3xl glass-surface border border-white/10 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Dados Comerciais da Barbershop Rocha
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[#A3A3A3] block mb-1">Nome Comercial</label>
              <input
                type="text"
                value={bName}
                onChange={(e) => setBName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white"
              />
            </div>

            <div>
              <label className="text-[#A3A3A3] block mb-1">Slogan Oficial</label>
              <input
                type="text"
                value={bSlogan}
                onChange={(e) => setBSlogan(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[#A3A3A3] block mb-1">Endereço Físico (com Google Maps)</label>
              <input
                type="text"
                value={bAddress}
                onChange={(e) => setBAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white"
              />
            </div>

            <div>
              <label className="text-[#A3A3A3] block mb-1">WhatsApp de Contato</label>
              <input
                type="text"
                value={bPhone}
                onChange={(e) => setBPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white"
              />
            </div>

            <div>
              <label className="text-[#A3A3A3] block mb-1">Regra de Cancelamento (Horas mínimas)</label>
              <input
                type="number"
                value={bPolicy}
                onChange={(e) => setBPolicy(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-[#F5C542] text-black font-bold text-xs uppercase tracking-wider hover:brightness-105 shadow-md"
          >
            Salvar Configurações
          </button>
        </form>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <form
            onSubmit={handleCreateExpense}
            className="relative w-full max-w-sm rounded-3xl glass-surface-elevated p-6 border border-[#F5C542]/30 shadow-2xl space-y-4"
          >
            <h3 className="text-sm font-bold text-white">Lançar Nova Despesa</h3>

            <div>
              <label className="text-xs text-[#A3A3A3] block mb-1">Descrição</label>
              <input
                type="text"
                value={expTitle}
                onChange={(e) => setExpTitle(e.target.value)}
                placeholder="Ex: Lâminas descartáveis, conta de luz"
                required
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs text-[#A3A3A3] block mb-1">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs text-[#A3A3A3] block mb-1">Categoria</label>
              <select
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value as ExpenseItem['category'])}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
              >
                <option value="produtos">Produtos</option>
                <option value="aluguel">Aluguel</option>
                <option value="energia_agua">Energia / Água</option>
                <option value="equipamentos">Equipamentos</option>
                <option value="marketing">Marketing</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-[#A3A3A3] block mb-1">Status de Pagamento</label>
              <select
                value={expStatus}
                onChange={(e) => setExpStatus(e.target.value as 'pago' | 'pendente')}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
              >
                <option value="pago">Já Pago (Saiu do Caixa)</option>
                <option value="pendente">A Pagar (Pendente)</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#F5C542] text-black font-bold text-xs uppercase tracking-wider"
              >
                Registrar Despesa
              </button>
              <button
                type="button"
                onClick={() => setShowAddExpenseModal(false)}
                className="py-2.5 px-4 rounded-xl bg-white/10 text-white text-xs"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
