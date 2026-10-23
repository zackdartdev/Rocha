export type ServiceCategory = 'cortes' | 'barba' | 'cabelo_barba' | 'acabamento' | 'tratamentos';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number; // In BRL, e.g. 35.00
  durationMinutes: number;
  category: ServiceCategory;
  categoryLabel: string;
  imageUrl: string;
  isActive: boolean;
  professionals: string[]; // professional IDs
}

export interface Professional {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  workingDays: number[]; // 0=dom, 1=seg, 2=ter... 6=sab
  workStart: string; // '09:00'
  workEnd: string; // '20:00'
  lunchStart: string; // '12:00'
  lunchEnd: string; // '13:00'
  blockedDates: string[]; // YYYY-MM-DD
}

export type AppointmentStatus = 'aguardando_confirmacao' | 'confirmado' | 'em_atendimento' | 'concluido' | 'cancelado';
export type ServiceExecutionStatus = 'pendente' | 'em_execucao' | 'concluido';
export type PaymentStatus = 'pendente' | 'pago' | 'estornado';
export type PaymentMethod = 'pix' | 'credito' | 'debito' | 'dinheiro' | 'assinatura_club';

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  priceAgreed: number; // Historical price preserved
  address: string;
  status: AppointmentStatus;
  serviceExecutionStatus: ServiceExecutionStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentDate?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: { status: string; timestamp: string; note?: string }[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  commercialName: string;
  priceMonthly: number;
  daysAllowed: string;
  includedServices: string[];
  rules: string[];
  isPopular?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  userName: string;
  planId: string;
  planName: string;
  status: 'ativa' | 'cancelada' | 'pendente_pagamento';
  startDate: string;
  nextBillingDate: string;
  priceMonthly: number;
  paymentMethod: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: 'produtos' | 'aluguel' | 'energia_agua' | 'equipamentos' | 'marketing' | 'outros';
  categoryLabel: string;
  date: string;
  status: 'pago' | 'pendente';
  notes?: string;
  paidDate?: string;
}

export interface FinancialSummary {
  concludedServicesValue: number; // Total value of finished cuts/services
  cashReceived: number; // Actual cash collected
  accountsReceivable: number; // Concluded services that haven't been paid yet
  totalExpenses: number; // Total expenses registered
  cashPaidExpenses: number; // Expenses actually paid out
  cashBalance: number; // cashReceived - cashPaidExpenses
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'agendamento' | 'assinatura' | 'financeiro' | 'sistema';
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  role: 'cliente' | 'admin';
  preferredServices: string[];
  favoriteServiceIds: string[];
  activeSubscriptionId?: string;
  hasCompletedOnboarding: boolean;
  isLoggedIn?: boolean;
  authProvider?: 'google' | 'convidado' | 'email';
}

export interface BusinessSettings {
  name: string;
  slogan: string;
  address: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  openingHours: string;
  cancelationPolicyHours: number;
}
