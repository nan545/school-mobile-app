import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  GraduationCap,
  CalendarCheck,
  CalendarDays,
  MessageSquare,
  Sparkles,
  BarChart2,
  Cloud,
  Settings,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, notifications, teacherContacts } = useApp();

  const unreadMessagesCount = teacherContacts.reduce((acc, t) => acc + t.unreadCount, 0);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'grades', label: 'Grades', icon: GraduationCap },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'ai', label: 'AI Copilot', icon: Sparkles, highlight: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'backup', label: 'Cloud & Sync', icon: Cloud },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Bottom Bar (visible on small screens / mobile frames) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe">
        <div className="flex items-center justify-around px-1 py-1.5 overflow-x-auto no-scrollbar">
          {navItems.slice(0, 5).concat(navItems.slice(5, 6)).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center min-w-[54px] py-1 px-1 rounded-xl transition ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 ${
                      item.highlight && !isActive
                        ? 'text-amber-500 dark:text-amber-400 animate-pulse'
                        : ''
                    }`}
                  />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  ) : null}
                  {item.highlight && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 truncate max-w-[56px]">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 w-6 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop / Tablet Sub-Header Tab Ribbon */}
      <nav className="hidden md:block bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200/60 dark:border-indigo-800/60 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    item.highlight && !isActive ? 'text-amber-500' : ''
                  }`}
                />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold">
                    {item.badge}
                  </span>
                ) : null}
                {item.highlight && !isActive && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
