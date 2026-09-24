import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DeviceFrame } from './components/DeviceFrame';
import { PushNotificationBanner } from './components/PushNotificationBanner';
import { NotificationDrawer } from './components/NotificationDrawer';
import { BiometricLockModal } from './components/BiometricLockModal';
import { AuthModal } from './components/AuthModal';
import { TeacherGradingModal } from './components/TeacherGradingModal';

// Views
import { DashboardView } from './views/DashboardView';
import { GradesView } from './views/GradesView';
import { AttendanceView } from './views/AttendanceView';
import { EventsView } from './views/EventsView';
import { MessagesView } from './views/MessagesView';
import { AiCopilotView } from './views/AiCopilotView';
import { AnalyticsView } from './views/AnalyticsView';
import { CloudBackupView } from './views/CloudBackupView';
import { SettingsView } from './views/SettingsView';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    fontSize,
    highContrast,
    authModalOpen,
    setAuthModalOpen,
    teacherGradingModalOpen,
    setTeacherGradingModalOpen,
  } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'grades':
        return <GradesView />;
      case 'attendance':
        return <AttendanceView />;
      case 'events':
        return <EventsView />;
      case 'messages':
        return <MessagesView />;
      case 'ai':
        return <AiCopilotView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'backup':
        return <CloudBackupView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  const getFontSizeClass = () => {
    if (fontSize === 'large') return 'text-[108%]';
    if (fontSize === 'xlarge') return 'text-[118%]';
    return '';
  };

  return (
    <DeviceFrame>
      <div
        className={`min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 ${getFontSizeClass()} ${
          highContrast ? 'high-contrast' : ''
        }`}
      >
        <Header />
        <BottomNav />

        {/* Main Scrollable View Area */}
        <main className="flex-1 pb-20 md:pb-8">
          {renderActiveView()}
        </main>

        {/* Global Floating Modals & Overlays */}
        <PushNotificationBanner />
        <NotificationDrawer />
        <BiometricLockModal />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
        <TeacherGradingModal
          isOpen={teacherGradingModalOpen}
          onClose={() => setTeacherGradingModalOpen(false)}
        />
      </div>
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
