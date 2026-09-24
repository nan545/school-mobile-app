import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Check,
  CheckCheck,
  Bell,
  GraduationCap,
  CalendarCheck,
  MessageSquare,
  AlertTriangle,
  Play,
  Sliders,
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    notificationDrawerOpen,
    setNotificationDrawerOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
    simulateGradeUpdate,
    simulateMorningScan,
    triggerPushNotification,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>('all');

  if (!notificationDrawerOpen) return null;

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.category === activeFilter;
  });

  const handleSimulateCustom = (type: string) => {
    if (type === 'grade') simulateGradeUpdate();
    else if (type === 'attendance') simulateMorningScan();
    else if (type === 'message') {
      triggerPushNotification({
        title: 'New Message from Coach Davis',
        body: 'Soccer bus departs at 3:30 PM sharp for the regional match at Westlake.',
        category: 'message',
        actionTab: 'messages',
      });
    } else if (type === 'urgent') {
      triggerPushNotification({
        title: 'District Notice: Early Dismissal',
        body: 'Inclement winter storm warning. School will dismiss 2 hours early today.',
        category: 'urgent',
        actionTab: 'events',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Notification Center
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time school & student updates
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              title="Mark all as read"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all</span>
            </button>
            <button
              onClick={() => setNotificationDrawerOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Simulator Toolbar */}
        <div className="bg-indigo-50/70 dark:bg-indigo-950/40 p-3 border-b border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1">
              <Play className="w-3 h-3 text-indigo-600" />
              Push Notification Simulator
            </span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400">
              Test Real-time Push
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handleSimulateCustom('grade')}
              className="px-2 py-1.5 bg-white dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-200 rounded-lg border border-indigo-200/60 dark:border-indigo-800/60 hover:border-indigo-400 transition text-left flex items-center gap-1.5 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>+ Grade Alert (96%)</span>
            </button>
            <button
              onClick={() => handleSimulateCustom('attendance')}
              className="px-2 py-1.5 bg-white dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-200 rounded-lg border border-indigo-200/60 dark:border-indigo-800/60 hover:border-indigo-400 transition text-left flex items-center gap-1.5 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>+ Gate Scan (7:51 AM)</span>
            </button>
            <button
              onClick={() => handleSimulateCustom('message')}
              className="px-2 py-1.5 bg-white dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-200 rounded-lg border border-indigo-200/60 dark:border-indigo-800/60 hover:border-indigo-400 transition text-left flex items-center gap-1.5 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>+ Teacher Message</span>
            </button>
            <button
              onClick={() => handleSimulateCustom('urgent')}
              className="px-2 py-1.5 bg-white dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-200 rounded-lg border border-indigo-200/60 dark:border-indigo-800/60 hover:border-indigo-400 transition text-left flex items-center gap-1.5 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>+ Emergency Alert</span>
            </button>
          </div>
        </div>

        {/* Categories Tab Filter */}
        <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto text-xs">
          {['all', 'grade', 'attendance', 'message', 'event'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-2.5 py-1 rounded-full capitalize font-medium transition shrink-0 ${
                activeFilter === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredNotifs.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No notifications in this category</p>
            </div>
          ) : (
            filteredNotifs.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationAsRead(item.id)}
                className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer flex gap-3 ${
                  !item.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                    !item.read ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-transparent'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-2 whitespace-nowrap">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                    {item.body}
                  </p>

                  {item.actionTab && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationAsRead(item.id);
                        setActiveTab(item.actionTab!);
                        setNotificationDrawerOpen(false);
                      }}
                      className="mt-2 inline-flex items-center text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Open in {item.actionTab.charAt(0).toUpperCase() + item.actionTab.slice(1)} →
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-center">
          <button
            onClick={() => {
              setActiveTab('settings');
              setNotificationDrawerOpen(false);
            }}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium inline-flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize push notification frequencies</span>
          </button>
        </div>
      </div>
    </div>
  );
};
