import {
  Appointment,
  ExpenseItem,
  FinancialSummary,
  Professional
} from '../types';

/**
 * Format currency to Brazilian Real format: R$ 35,00
 */
export function formatBRL(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

/**
 * Format ISO date string (YYYY-MM-DD) to Brazilian date: DD/MM/AAAA
 */
export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

/**
 * Converts "HH:mm" time string into minutes since midnight
 */
export function timeToMinutes(timeStr: string): number {
  const [hours, mins] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (mins || 0);
}

/**
 * Converts minutes since midnight back into "HH:mm"
 */
export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Checks if a specific time slot overlaps with an existing appointment or lunch break
 */
export function isSlotAvailable(
  date: string,
  time: string,
  durationMinutes: number,
  existingAppointments: Appointment[],
  professional: Professional
): boolean {
  // Check if date is blocked
  if (professional.blockedDates.includes(date)) {
    return false;
  }

  // Check working day of week
  const dateObj = new Date(`${date}T12:00:00`);
  const dayOfWeek = dateObj.getDay(); // 0 is Sunday
  if (!professional.workingDays.includes(dayOfWeek)) {
    return false;
  }

  const slotStart = timeToMinutes(time);
  const slotEnd = slotStart + durationMinutes;

  const workStart = timeToMinutes(professional.workStart);
  const workEnd = timeToMinutes(professional.workEnd);
  const lunchStart = timeToMinutes(professional.lunchStart);
  const lunchEnd = timeToMinutes(professional.lunchEnd);

  // Must fall within working hours
  if (slotStart < workStart || slotEnd > workEnd) {
    return false;
  }

  // Must not overlap with lunch break
  if (slotStart < lunchEnd && slotEnd > lunchStart) {
    return false;
  }

  // Must not overlap with any active appointment on that date
  for (const app of existingAppointments) {
    if (app.date !== date) continue;
    if (app.status === 'cancelado') continue;
    if (app.professionalId !== professional.id) continue;

    const appStart = timeToMinutes(app.time);
    const appEnd = appStart + app.durationMinutes;

    // Overlap condition: (slotStart < appEnd && slotEnd > appStart)
    if (slotStart < appEnd && slotEnd > appStart) {
      return false;
    }
  }

  return true;
}

/**
 * Generates all available slots for a given day and service duration
 */
export function generateAvailableTimeSlots(
  date: string,
  durationMinutes: number,
  existingAppointments: Appointment[],
  professional: Professional,
  intervalMinutes: number = 30
): string[] {
  const slots: string[] = [];
  const workStart = timeToMinutes(professional.workStart);
  const workEnd = timeToMinutes(professional.workEnd);

  for (let mins = workStart; mins + durationMinutes <= workEnd; mins += intervalMinutes) {
    const timeStr = minutesToTime(mins);
    if (isSlotAvailable(date, timeStr, durationMinutes, existingAppointments, professional)) {
      slots.push(timeStr);
    }
  }

  return slots;
}

/**
 * Core Financial Integrity Engine
 * Separates:
 * 1. Services concluded (regardless of payment)
 * 2. Cash actually collected (pago)
 * 3. Accounts receivable (concluded but unpaid)
 * 4. Total expenses & Paid expenses
 * 5. Net cash balance
 */
export function calculateFinancialSummary(
  appointments: Appointment[],
  expenses: ExpenseItem[]
): FinancialSummary {
  let concludedServicesValue = 0;
  let cashReceived = 0;
  let accountsReceivable = 0;

  for (const app of appointments) {
    if (app.status === 'cancelado') continue;

    // Concluded service
    if (app.serviceExecutionStatus === 'concluido' || app.status === 'concluido') {
      concludedServicesValue += app.priceAgreed;

      if (app.paymentStatus === 'pago') {
        cashReceived += app.priceAgreed;
      } else {
        // Concluded service, not yet paid
        accountsReceivable += app.priceAgreed;
      }
    } else {
      // If service is pending or in progress, but already paid (e.g. upfront advance or PIX)
      if (app.paymentStatus === 'pago') {
        cashReceived += app.priceAgreed;
      }
    }
  }

  let totalExpenses = 0;
  let cashPaidExpenses = 0;

  for (const exp of expenses) {
    totalExpenses += exp.amount;
    if (exp.status === 'pago') {
      cashPaidExpenses += exp.amount;
    }
  }

  const cashBalance = cashReceived - cashPaidExpenses;

  return {
    concludedServicesValue,
    cashReceived,
    accountsReceivable,
    totalExpenses,
    cashPaidExpenses,
    cashBalance,
  };
}

/**
 * Verifies cancellation policy
 */
export function canCancelAppointment(
  appointmentDate: string,
  appointmentTime: string,
  policyHours: number = 2
): { allowed: boolean; reason?: string } {
  const appDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
  const now = new Date();

  const diffMs = appDateTime.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 0) {
    return {
      allowed: false,
      reason: 'Não é possível cancelar um agendamento que já ocorreu.',
    };
  }

  if (diffHours < policyHours) {
    return {
      allowed: false,
      reason: `Cancelamento permitido apenas com no mínimo ${policyHours}h de antecedência.`,
    };
  }

  return { allowed: true };
}

/**
 * Verifies if a service is covered under a Signature Club plan on a given day
 * Plano 1: Corte Ilimitado (Seg a Sáb) -> Club Rocha Corte, Pezinho
 * Plano 2: Corte e Barba Ilimitado (Seg a Sáb) -> Club Rocha Cabelo e Barba, Club Rocha Corte, Club Rocha Barba
 * Plano 3: Barba Ilimitado (Ter a Sáb) -> Club Rocha Barba
 */
export function isServiceCoveredBySubscription(
  planId: string,
  serviceName: string,
  dayOfWeek: number // 0=dom, 1=seg, 2=ter... 6=sab
): { covered: boolean; reason?: string } {
  // Sunday is closed
  if (dayOfWeek === 0) {
    return { covered: false, reason: 'A barbearia não opera aos domingos.' };
  }

  if (planId === 'plano-1') {
    // Seg a Sab (1-6)
    const validServices = ['Corte um pente', 'Corte disfarçado ou tesoura', 'Pezinho (acabamento)'];
    if (!validServices.includes(serviceName)) {
      return { covered: false, reason: 'Serviço não incluso no Plano Corte Ilimitado.' };
    }
    return { covered: true };
  }

  if (planId === 'plano-2') {
    // Seg a Sab (1-6)
    const validServices = [
      'Corte um pente',
      'Corte disfarçado ou tesoura',
      'Barba modelada',
      'Barba raspada',
      'Pezinho (acabamento)',
    ];
    if (!validServices.includes(serviceName)) {
      return { covered: false, reason: 'Serviço não incluso no Plano Corte e Barba Ilimitado.' };
    }
    return { covered: true };
  }

  if (planId === 'plano-3') {
    // Ter a Sab (2-6)
    if (dayOfWeek === 1) {
      return { covered: false, reason: 'O Plano Barba Ilimitado é válido de terça a sábado.' };
    }
    const validServices = ['Barba modelada', 'Barba raspada'];
    if (!validServices.includes(serviceName)) {
      return { covered: false, reason: 'Serviço não incluso no Plano Barba Ilimitado.' };
    }
    return { covered: true };
  }

  return { covered: false, reason: 'Plano não reconhecido.' };
}
