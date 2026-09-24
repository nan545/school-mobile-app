import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Lock,
  Moon,
  Sun,
  RefreshCw,
  Smartphone,
  Tablet,
  Monitor,
  ChevronDown,
  UserCheck,
  PlusCircle,
  LogIn,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeStudent,
    students,
    setActiveStudentId,
    currentUser,
    setUserRole,
    unreadNotifsCount,
    setNotificationDrawerOpen,
    isDarkMode,
    toggleDarkMode,
    deviceFrame,
    setDeviceFrame,
    cloudSyncStatus,
    lockApp,
    backupToCloud,
    authModalOpen,
    setAuthModalOpen,
    setTeacherGradingModalOpen,
    isAuthenticated,
    signOut,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: App Logo + Student Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-black text-lg">
              E
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  EduPulse
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none">
                Oakridge Unified School District
              </p>
            </div>
          </div>

          {/* Child Profile Switcher */}
          <div className="relative group">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200 dark:border-slate-700 cursor-pointer transition">
              <img
                src={activeStudent.avatar}
                alt={activeStudent.name}
                className="w-6 h-6 rounded-full object-cover border border-white dark:border-slate-800"
              />
              <div className="ml-2 text-left">
                <span className="text-xs font-semibold text-slate-900 dark:text-white block leading-tight">
                  {activeStudent.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">
                  {activeStudent.grade} • GPA {activeStudent.currentGpa.toFixed(2)}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 ml-1.5 text-slate-400" />
            </div>

            {/* Dropdown to switch children */}
            <div className="absolute left-0 mt-1.5 w-60 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 hidden group-hover:block hover:block z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Select Student Profile
              </div>
              {students.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setActiveStudentId(st.id)}
                  className={`w-full flex items-center px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700/60 transition ${
                    st.id === activeStudent.id ? 'bg-indigo-50/70 dark:bg-indigo-950/40' : ''
                  }`}
                >
                  <img
                    src={st.avatar}
                    alt={st.name}
                    className="w-8 h-8 rounded-full object-cover border border-indigo-300 dark:border-indigo-600"
                  />
                  <div className="ml-2.5 flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {st.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {st.grade} • {st.schoolName.split(' ')[0]}
                    </div>
                  </div>
                  {st.id === activeStudent.id && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Teacher Grade Entry Shortcut */}
          {currentUser.role === 'teacher' && (
            <button
              onClick={() => setTeacherGradingModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Grade</span>
            </button>
          )}

          {/* Cloud Sync Status */}
          <button
            onClick={() => backupToCloud()}
            title="Live Firestore Real-time Sync - Click to backup"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 transition hover:bg-emerald-100"
          >
            {cloudSyncStatus === 'syncing' ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
            <span className="font-medium text-[11px]">
              {cloudSyncStatus === 'syncing' ? 'Syncing...' : 'Firestore Live'}
            </span>
          </button>

          {/* Device Frame Viewport Toggle */}
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setDeviceFrame('ios')}
              title="iOS iPhone Preview"
              className={`p-1.5 rounded-md transition ${
                deviceFrame === 'ios'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceFrame('android')}
              title="Android Pixel Preview"
              className={`p-1.5 rounded-md transition ${
                deviceFrame === 'android'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceFrame('desktop')}
              title="Fullscreen Responsive View"
              className={`p-1.5 rounded-md transition ${
                deviceFrame === 'desktop'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Role Switcher */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium"
              title="Switch Portal Role"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span className="capitalize text-[11px] font-semibold">{currentUser.role}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 hidden group-hover:block z-50">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">
                Active Portal View
              </div>
              <button
                onClick={() => setUserRole('parent')}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
              >
                <span>Parent View (Sarah)</span>
                {currentUser.role === 'parent' && <span className="text-indigo-500 text-xs">✓</span>}
              </button>
              <button
                onClick={() => setUserRole('teacher')}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
              >
                <span>Teacher View (Jenkins)</span>
                {currentUser.role === 'teacher' && <span className="text-indigo-500 text-xs">✓</span>}
              </button>
              <button
                onClick={() => setUserRole('admin')}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
              >
                <span>Admin View (Principal)</span>
                {currentUser.role === 'admin' && <span className="text-indigo-500 text-xs">✓</span>}
              </button>
            </div>
          </div>

          {/* Auth Account / Sign In Button */}
          {isAuthenticated ? (
            <button
              onClick={() => signOut()}
              title={`Signed in as ${currentUser.name}. Click to log out.`}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold hover:bg-indigo-100 transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Quick Lock Button */}
          <button
            onClick={lockApp}
            title="Lock Portal (Biometric/PIN Security)"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Lock app"
          >
            <Lock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>

          {/* Push Notification Bell */}
          <button
            onClick={() => setNotificationDrawerOpen(true)}
            className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce shadow">
                {unreadNotifsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
