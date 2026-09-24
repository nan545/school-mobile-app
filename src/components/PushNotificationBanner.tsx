import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ExternalLink, Bell, Sparkles, CheckCircle2, BookOpen, MessageSquare } from 'lucide-react';

export const PushNotificationBanner: React.FC = () => {
  const { activePushBanner, dismissPushBanner, setActiveTab, markNotificationAsRead } = useApp();

  if (!activePushBanner) return null;

  const getIcon = () => {
    switch (activePushBanner.category) {
      case 'grade':
        return <BookOpen className="w-4 h-4 text-emerald-500" />;
      case 'attendance':
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case 'event':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-500" />;
    }
  };

  const handleAction = () => {
    markNotificationAsRead(activePushBanner.id);
    if (activePushBanner.actionTab) {
      setActiveTab(activePushBanner.actionTab);
    }
    dismissPushBanner();
  };

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-xl flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              EduPulse Push Alert
            </span>
            <span className="text-[10px] text-slate-400">Just now</span>
          </div>
          <div className="text-sm font-semibold text-white truncate">
            {activePushBanner.title}
          </div>
          <p className="text-xs text-slate-300 line-clamp-2 mt-0.5 leading-snug">
            {activePushBanner.body}
          </p>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={handleAction}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition shadow-sm"
            >
              <span>View Update</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={dismissPushBanner}
              className="px-2.5 py-1 text-slate-400 hover:text-white text-xs rounded-lg transition"
            >
              Dismiss
            </button>
          </div>
        </div>

        <button
          onClick={dismissPushBanner}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
