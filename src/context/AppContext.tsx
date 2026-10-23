import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_BUSINESS_SETTINGS,
  INITIAL_EXPENSES,
  INITIAL_NOTIFICATIONS,
  INITIAL_PLANS,
  INITIAL_PROFESSIONALS,
  INITIAL_SERVICES,
  INITIAL_USER,
} from '../data/initialData';
import {
  Appointment,
  AppointmentStatus,
  BusinessSettings,
  ExpenseItem,
  FinancialSummary,
  NotificationItem,
  PaymentMethod,
  PaymentStatus,
  Professional,
  ServiceExecutionStatus,
  ServiceItem,
  SubscriptionPlan,
  UserProfile,
} from '../types';
import { calculateFinancialSummary } from '../utils/rules';

export type AppTab = 'home' | 'appointments' | 'favorites' | 'services' | 'plans' | 'profile' | 'admin';

interface AppContextType {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  services: ServiceItem[];
  professionals: Professional[];
  appointments: Appointment[];
  expenses: ExpenseItem[];
  plans: SubscriptionPlan[];
  user: UserProfile;
  businessSettings: BusinessSettings;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  selectedServiceForBooking: ServiceItem | null;
  setSelectedServiceForBooking: (service: ServiceItem | null) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  isPwaPromptOpen: boolean;
  setIsPwaPromptOpen: (open: boolean) => void;
  isNotificationPromptOpen: boolean;
  setIsNotificationPromptOpen: (open: boolean) => void;
  welcomeSeen: boolean;
  setWelcomeSeen: (seen: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isExperienceLoading: boolean;
  setIsExperienceLoading: (loading: boolean) => void;
  replayExperienceLoading: () => void;
  
  // Actions
  loginWithGoogle: (accountInfo?: Partial<UserProfile>) => void;
  loginAsGuest: () => void;
  logout: () => void;
  addAppointment: (appData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => Appointment;
  cancelAppointment: (id: string, reason?: string) => { success: boolean; message?: string };
  updateAppointmentStatus: (id: string, status: AppointmentStatus, note?: string) => void;
  updateServiceExecutionStatus: (id: string, status: ServiceExecutionStatus) => void;
  updatePaymentStatus: (id: string, paymentStatus: PaymentStatus, method?: PaymentMethod) => void;
  toggleFavorite: (serviceId: string) => void;
  subscribeToPlan: (planId: string) => void;
  cancelSubscription: () => void;
  addExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  updateExpenseStatus: (id: string, status: 'pago' | 'pendente') => void;
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (service: ServiceItem) => void;
  updateBusinessSettings: (settings: BusinessSettings) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (title: string, message: string, type?: NotificationItem['type']) => void;
  financialSummary: FinancialSummary;
  requestNotificationPermission: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rocha_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem('rocha_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Welcome state (Show once or until dismissed)
  const [welcomeSeen, setWelcomeSeen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      // Check query parameter ?autostart=1 or localStorage
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') return true;
      return localStorage.getItem('rocha_welcome_seen') === 'true';
    }
    return false;
  });

  const handleSetWelcomeSeen = (seen: boolean) => {
    setWelcomeSeen(seen);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rocha_welcome_seen', seen ? 'true' : 'false');
    }
  };

  // Main UI Tab
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isPwaPromptOpen, setIsPwaPromptOpen] = useState(false);
  const [isNotificationPromptOpen, setIsNotificationPromptOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Interactive experience loader state
  const [isExperienceLoading, setIsExperienceLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('skip_loader') === '1') return false;
      return sessionStorage.getItem('rocha_experience_loaded') !== 'true';
    }
    return false;
  });

  const handleSetExperienceLoading = (loading: boolean) => {
    setIsExperienceLoading(loading);
    if (!loading && typeof window !== 'undefined') {
      sessionStorage.setItem('rocha_experience_loaded', 'true');
    }
  };

  const replayExperienceLoading = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('rocha_experience_loaded');
    }
    setIsExperienceLoading(true);
  };

  // Entities stored in localStorage
  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('rocha_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [professionals] = useState<Professional[]>(INITIAL_PROFESSIONALS);

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('rocha_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('rocha_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [plans] = useState<SubscriptionPlan[]>(INITIAL_PLANS);

  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(() => {
    const saved = localStorage.getItem('rocha_settings');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_SETTINGS;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('rocha_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('rocha_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Persist mutations
  useEffect(() => {
    localStorage.setItem('rocha_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('rocha_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('rocha_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('rocha_settings', JSON.stringify(businessSettings));
  }, [businessSettings]);

  useEffect(() => {
    localStorage.setItem('rocha_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('rocha_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Derived Financial Summary
  const financialSummary = calculateFinancialSummary(appointments, expenses);

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const addNotification = (title: string, message: string, type: NotificationItem['type'] = 'sistema') => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Agora',
      isRead: false,
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Native browser notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/icon.svg',
        });
      } catch (err) {
        console.warn('Native notification suppressed:', err);
      }
    }
  };

  const addAppointment = (appData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Appointment => {
    const nowIso = new Date().toISOString();
    const newAppointment: Appointment = {
      ...appData,
      id: `app-${Date.now()}`,
      createdAt: nowIso,
      updatedAt: nowIso,
      statusHistory: [
        {
          status: appData.status,
          timestamp: nowIso,
          note: 'Agendamento criado pelo cliente',
        },
      ],
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    addNotification(
      'Agendamento Confirmado',
      `${appData.serviceName} no dia ${appData.date} às ${appData.time} com ${appData.professionalName}.`,
      'agendamento'
    );
    return newAppointment;
  };

  const cancelAppointment = (id: string, reason?: string) => {
    const nowIso = new Date().toISOString();
    setAppointments((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          return {
            ...app,
            status: 'cancelado' as const,
            cancellationReason: reason || 'Cancelado pelo usuário',
            updatedAt: nowIso,
            statusHistory: [
              ...app.statusHistory,
              {
                status: 'cancelado',
                timestamp: nowIso,
                note: reason || 'Cancelado pelo usuário',
              },
            ],
          };
        }
        return app;
      })
    );
    addNotification('Agendamento Cancelado', 'O horário foi liberado com sucesso.', 'agendamento');
    return { success: true };
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus, note?: string) => {
    const nowIso = new Date().toISOString();
    setAppointments((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          return {
            ...app,
            status,
            updatedAt: nowIso,
            statusHistory: [
              ...app.statusHistory,
              {
                status,
                timestamp: nowIso,
                note: note || `Status alterado para ${status}`,
              },
            ],
          };
        }
        return app;
      })
    );
  };

  const updateServiceExecutionStatus = (id: string, status: ServiceExecutionStatus) => {
    const nowIso = new Date().toISOString();
    setAppointments((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          return {
            ...app,
            serviceExecutionStatus: status,
            status: status === 'concluido' ? 'concluido' : app.status,
            updatedAt: nowIso,
          };
        }
        return app;
      })
    );
  };

  const updatePaymentStatus = (id: string, paymentStatus: PaymentStatus, method?: PaymentMethod) => {
    const nowIso = new Date().toISOString();
    setAppointments((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          return {
            ...app,
            paymentStatus,
            paymentMethod: method || app.paymentMethod,
            paymentDate: paymentStatus === 'pago' ? nowIso : undefined,
            updatedAt: nowIso,
          };
        }
        return app;
      })
    );
    if (paymentStatus === 'pago') {
      addNotification('Pagamento Confirmado', 'Recebimento registrado com sucesso no caixa.', 'financeiro');
    }
  };

  const toggleFavorite = (serviceId: string) => {
    setUser((prev) => {
      const exists = prev.favoriteServiceIds.includes(serviceId);
      const nextFavorites = exists
        ? prev.favoriteServiceIds.filter((id) => id !== serviceId)
        : [...prev.favoriteServiceIds, serviceId];
      return {
        ...prev,
        favoriteServiceIds: nextFavorites,
      };
    });
  };

  const subscribeToPlan = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;
    setUser((prev) => ({
      ...prev,
      activeSubscriptionId: planId,
    }));
    addNotification(
      'Signature Club Ativado!',
      `Você agora é membro do plano ${plan.name}. Aproveite seus benefícios exclusivos!`,
      'assinatura'
    );
  };

  const cancelSubscription = () => {
    setUser((prev) => ({
      ...prev,
      activeSubscriptionId: undefined,
    }));
    addNotification('Assinatura Cancelada', 'Sua assinatura foi desativada.', 'assinatura');
  };

  const addExpense = (expenseData: Omit<ExpenseItem, 'id'>) => {
    const newExpense: ExpenseItem = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExpense, ...prev]);
    addNotification('Despesa Registrada', `${expenseData.title}: R$ ${expenseData.amount.toFixed(2)}`, 'financeiro');
  };

  const updateExpenseStatus = (id: string, status: 'pago' | 'pendente') => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status, paidDate: status === 'pago' ? new Date().toISOString() : undefined } : e))
    );
  };

  const addService = (serviceData: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...serviceData,
      id: `srv-${Date.now()}`,
    };
    setServices((prev) => [...prev, newService]);
    addNotification('Novo Serviço Cadastrado', `${newService.name} adicionado ao catálogo.`, 'sistema');
  };

  const updateService = (updated: ServiceItem) => {
    setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    addNotification('Serviço Atualizado', `${updated.name} foi modificado.`, 'sistema');
  };

  const updateBusinessSettings = (settings: BusinessSettings) => {
    setBusinessSettings(settings);
    addNotification('Configurações Salvas', 'Informações comerciais atualizadas.', 'sistema');
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profile }));
  };

  const loginWithGoogle = (accountInfo?: Partial<UserProfile>) => {
    const updated: UserProfile = {
      ...user,
      id: user.id || `usr-${Date.now()}`,
      name: accountInfo?.name || user.name || 'Stormi Lamego',
      email: accountInfo?.email || user.email || 'stormilamego@gmail.com',
      avatarUrl: accountInfo?.avatarUrl || user.avatarUrl,
      isLoggedIn: true,
      authProvider: 'google',
    };
    setUser(updated);
    addNotification('Login com Google', `Conectado com sucesso como ${updated.name} (${updated.email}).`, 'sistema');
  };

  const loginAsGuest = () => {
    const updated: UserProfile = {
      ...user,
      isLoggedIn: true,
      authProvider: 'convidado',
    };
    setUser(updated);
    addNotification('Acesso Convidado', 'Navegando como visitante. Você pode agendar serviços normalmente.', 'sistema');
  };

  const logout = () => {
    const updated: UserProfile = {
      ...user,
      isLoggedIn: false,
      authProvider: undefined,
    };
    setUser(updated);
    addNotification('Sessão encerrada', 'Você saiu da sua conta.', 'sistema');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        addNotification('Notificações Ativadas', 'Você receberá avisos de agendamentos e novidades da Rocha.');
        return true;
      }
    } catch (e) {
      console.warn('Error requesting notification permission:', e);
    }
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        services,
        professionals,
        appointments,
        expenses,
        plans,
        user,
        businessSettings,
        notifications,
        unreadNotificationsCount,
        theme,
        toggleTheme,
        selectedServiceForBooking,
        setSelectedServiceForBooking,
        isBookingModalOpen,
        setIsBookingModalOpen,
        isPwaPromptOpen,
        setIsPwaPromptOpen,
        isNotificationPromptOpen,
        setIsNotificationPromptOpen,
        welcomeSeen,
        setWelcomeSeen: handleSetWelcomeSeen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isExperienceLoading,
        setIsExperienceLoading: handleSetExperienceLoading,
        replayExperienceLoading,
        loginWithGoogle,
        loginAsGuest,
        logout,
        addAppointment,
        cancelAppointment,
        updateAppointmentStatus,
        updateServiceExecutionStatus,
        updatePaymentStatus,
        toggleFavorite,
        subscribeToPlan,
        cancelSubscription,
        addExpense,
        updateExpenseStatus,
        addService,
        updateService,
        updateBusinessSettings,
        updateUserProfile,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        financialSummary,
        requestNotificationPermission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
};
