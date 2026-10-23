import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatBRL,
  formatDateBR,
  timeToMinutes,
  minutesToTime,
  isSlotAvailable,
  calculateFinancialSummary,
  isServiceCoveredBySubscription
} from './rules.js';
import { Appointment, ExpenseItem, Professional } from '../types/index.js';

test('formatBRL formats Brazilian Real correctly', () => {
  const result = formatBRL(35);
  // Reais string contains R$, 35 and 00
  assert.ok(result.includes('35,00') || result.includes('35.00'));
});

test('formatDateBR formats YYYY-MM-DD to DD/MM/AAAA', () => {
  assert.equal(formatDateBR('2026-10-25'), '25/10/2026');
});

test('timeToMinutes and minutesToTime conversions are accurate', () => {
  assert.equal(timeToMinutes('09:30'), 570);
  assert.equal(minutesToTime(570), '09:30');
  assert.equal(minutesToTime(timeToMinutes('14:45')), '14:45');
});

test('calculateFinancialSummary separates concluded services from received cash and accounts receivable', () => {
  const mockAppointments: Appointment[] = [
    {
      id: 'app-1',
      clientName: 'Carlos Silva',
      clientPhone: '21999999999',
      clientEmail: 'carlos@email.com',
      serviceId: 'srv-2',
      serviceName: 'Corte disfarçado ou tesoura',
      professionalId: 'pro-1',
      professionalName: 'Guilherme Rocha',
      date: '2026-10-24',
      time: '10:00',
      durationMinutes: 30,
      priceAgreed: 35.0,
      address: 'Rua B Lote 44 loja 2 - Maricá RJ',
      status: 'concluido',
      serviceExecutionStatus: 'concluido',
      paymentStatus: 'pendente', // Service concluded but NOT paid
      createdAt: '2026-10-24T09:00:00Z',
      updatedAt: '2026-10-24T10:30:00Z',
      statusHistory: [],
    },
    {
      id: 'app-2',
      clientName: 'Marcos Souza',
      clientPhone: '21988888888',
      clientEmail: 'marcos@email.com',
      serviceId: 'srv-3',
      serviceName: 'Barba modelada',
      professionalId: 'pro-1',
      professionalName: 'Guilherme Rocha',
      date: '2026-10-24',
      time: '11:00',
      durationMinutes: 20,
      priceAgreed: 25.0,
      address: 'Rua B Lote 44 loja 2 - Maricá RJ',
      status: 'concluido',
      serviceExecutionStatus: 'concluido',
      paymentStatus: 'pago', // Service concluded AND paid
      paymentMethod: 'pix',
      createdAt: '2026-10-24T09:00:00Z',
      updatedAt: '2026-10-24T11:20:00Z',
      statusHistory: [],
    },
    {
      id: 'app-3',
      clientName: 'João Paulo',
      clientPhone: '21977777777',
      clientEmail: 'joao@email.com',
      serviceId: 'srv-1',
      serviceName: 'Corte um pente',
      professionalId: 'pro-1',
      professionalName: 'Guilherme Rocha',
      date: '2026-10-24',
      time: '15:00',
      durationMinutes: 20,
      priceAgreed: 25.0,
      address: 'Rua B Lote 44 loja 2 - Maricá RJ',
      status: 'cancelado', // Cancelled appointment does NOT contribute to active totals
      serviceExecutionStatus: 'pendente',
      paymentStatus: 'pendente',
      createdAt: '2026-10-24T09:00:00Z',
      updatedAt: '2026-10-24T10:00:00Z',
      statusHistory: [],
    },
  ];

  const mockExpenses: ExpenseItem[] = [
    {
      id: 'exp-1',
      title: 'Lâminas descartáveis e pomadas',
      amount: 40.0,
      category: 'produtos',
      categoryLabel: 'Produtos',
      date: '2026-10-24',
      status: 'pago',
    },
    {
      id: 'exp-2',
      title: 'Conta de luz',
      amount: 150.0,
      category: 'energia_agua',
      categoryLabel: 'Luz e Água',
      date: '2026-10-30',
      status: 'pendente',
    },
  ];

  const summary = calculateFinancialSummary(mockAppointments, mockExpenses);

  // app-1 (R$ 35) + app-2 (R$ 25) = R$ 60 concluded services
  assert.equal(summary.concludedServicesValue, 60.0);
  // app-2 (R$ 25 paid) = R$ 25 cash collected
  assert.equal(summary.cashReceived, 25.0);
  // app-1 (R$ 35 unpaid) = R$ 35 accounts receivable
  assert.equal(summary.accountsReceivable, 35.0);
  // total expenses = 40 + 150 = 190
  assert.equal(summary.totalExpenses, 190.0);
  // paid expenses = 40
  assert.equal(summary.cashPaidExpenses, 40.0);
  // cashBalance = cashReceived (25) - cashPaidExpenses (40) = -15
  assert.equal(summary.cashBalance, -15.0);
});

test('isSlotAvailable detects conflict with lunch break and existing appointment', () => {
  const mockProfessional: Professional = {
    id: 'pro-1',
    name: 'Guilherme Rocha',
    title: 'Mestre Barbeiro',
    bio: 'Especialista em visagismo e cortes clássicos e modernos.',
    avatarUrl: '',
    workingDays: [1, 2, 3, 4, 5, 6], // Mon-Sat
    workStart: '09:00',
    workEnd: '20:00',
    lunchStart: '12:00',
    lunchEnd: '13:00',
    blockedDates: ['2026-12-25'],
  };

  const existingAppointments: Appointment[] = [
    {
      id: 'app-1',
      clientName: 'Pedro',
      clientPhone: '21999999999',
      clientEmail: 'pedro@email.com',
      serviceId: 'srv-2',
      serviceName: 'Corte disfarçado',
      professionalId: 'pro-1',
      professionalName: 'Guilherme Rocha',
      date: '2026-10-24', // Saturday
      time: '10:00',
      durationMinutes: 30, // 10:00 to 10:30
      priceAgreed: 35,
      address: 'Rua B Lote 44 loja 2 - Maricá RJ',
      status: 'confirmado',
      serviceExecutionStatus: 'pendente',
      paymentStatus: 'pendente',
      createdAt: '2026-10-24T00:00:00Z',
      updatedAt: '2026-10-24T00:00:00Z',
      statusHistory: [],
    },
  ];

  // 10:00 overlaps with existing 10:00 - 10:30
  assert.equal(
    isSlotAvailable('2026-10-24', '10:00', 30, existingAppointments, mockProfessional),
    false
  );
  // 10:15 overlaps with existing 10:00 - 10:30
  assert.equal(
    isSlotAvailable('2026-10-24', '10:15', 30, existingAppointments, mockProfessional),
    false
  );
  // 10:30 is right after app ends -> Available
  assert.equal(
    isSlotAvailable('2026-10-24', '10:30', 30, existingAppointments, mockProfessional),
    true
  );
  // 12:00 is lunch break -> Unavailable
  assert.equal(
    isSlotAvailable('2026-10-24', '12:00', 30, existingAppointments, mockProfessional),
    false
  );
  // 12:30 inside lunch break -> Unavailable
  assert.equal(
    isSlotAvailable('2026-10-24', '12:30', 30, existingAppointments, mockProfessional),
    false
  );
  // 13:00 right after lunch break -> Available
  assert.equal(
    isSlotAvailable('2026-10-24', '13:00', 30, existingAppointments, mockProfessional),
    true
  );
  // Blocked holiday date
  assert.equal(
    isSlotAvailable('2026-12-25', '14:00', 30, existingAppointments, mockProfessional),
    false
  );
});

test('isServiceCoveredBySubscription validates plan rules and allowed days', () => {
  // Plano 1 (Corte Ilimitado): covers Corte and Pezinho on Mon-Sat (day 1-6)
  const res1 = isServiceCoveredBySubscription('plano-1', 'Corte disfarçado ou tesoura', 2);
  assert.equal(res1.covered, true);

  const res1Invalid = isServiceCoveredBySubscription('plano-1', 'Barba modelada', 2);
  assert.equal(res1Invalid.covered, false);

  // Plano 3 (Barba Ilimitado): only Tue-Sat (day 2-6)
  const res3Monday = isServiceCoveredBySubscription('plano-3', 'Barba modelada', 1); // Monday
  assert.equal(res3Monday.covered, false);
  assert.ok(res3Monday.reason?.includes('terça a sábado'));

  const res3Tuesday = isServiceCoveredBySubscription('plano-3', 'Barba modelada', 2); // Tuesday
  assert.equal(res3Tuesday.covered, true);
});
