/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { PwaInstallModal } from './components/common/PwaInstallModal';
import { NotificationPermissionModal } from './components/common/NotificationPermissionModal';
import { OfflineBanner } from './components/common/OfflineBanner';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { BookingModal } from './components/booking/BookingModal';
import { HomeScreen } from './components/home/HomeScreen';
import { ServicesCatalog } from './components/services/ServicesCatalog';
import { AppointmentsScreen } from './components/appointments/AppointmentsScreen';
import { PlansScreen } from './components/plans/PlansScreen';
import { FavoritesScreen } from './components/favorites/FavoritesScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainAppContent: React.FC = () => {
  const { 
    welcomeSeen, 
    activeTab, 
    setActiveTab, 
    setIsBookingModalOpen, 
    businessSettings 
  } = useApp();

  // Handle URL query parameters (e.g. ?action=booking or ?tab=appointments)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const action = params.get('action');
      const tab = params.get('tab');
      if (action === 'booking') {
        setIsBookingModalOpen(true);
      }
      if (tab === 'appointments' || tab === 'services' || tab === 'plans' || tab === 'favorites' || tab === 'profile' || tab === 'admin') {
        setActiveTab(tab);
      }
    }
  }, [setActiveTab, setIsBookingModalOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)] selection:bg-[#F5C542]/30 selection:text-[#F5C542] transition-colors duration-300">
      {/* Offline Status */}
      <OfflineBanner />

      {/* Welcome Screen Overlay if not seen yet */}
      {!welcomeSeen && <WelcomeScreen />}

      {/* Top Bar Header */}
      <Header />

      {/* Main Dynamic View Content */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'services' && <ServicesCatalog />}
        {activeTab === 'appointments' && <AppointmentsScreen />}
        {activeTab === 'plans' && <PlansScreen />}
        {activeTab === 'favorites' && <FavoritesScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Discreet Footer */}
      <footer className="py-6 border-t border-white/5 text-center text-xs text-[#A3A3A3] pb-24 md:pb-8">
        <p className="font-semibold text-white/90">
          {businessSettings.name} — <span className="text-[#F5C542]">{businessSettings.slogan}</span>
        </p>
        <p className="text-[11px] mt-1 text-[#A3A3A3]">
          {businessSettings.address} · {businessSettings.phone}
        </p>
        <p className="text-[10px] mt-2 text-white/30">
          © {new Date().getFullYear()} Barbershop Rocha. Todos os direitos reservados.
        </p>
      </footer>

      {/* Mobile iOS Floating Bottom Tab Bar */}
      <Navigation />

      {/* Modals & Overlays */}
      <OnboardingModal />
      <BookingModal />
      <PwaInstallModal />
      <NotificationPermissionModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
