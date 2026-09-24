import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Bell,
  Shield,
  Eye,
  Moon,
  Sun,
  Fingerprint,
  Lock,
  Volume2,
  VolumeX,
  Smartphone,
  Sliders,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { FontSize } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    isDarkMode,
    toggleDarkMode,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    lockApp,
    triggerPushNotification,
  } = useApp();

  const [pushGrades, setPushGrades] = useState<boolean>(true);
  const [pushAttendance, setPushAttendance] = useState<boolean>(true);
  const [pushMessages, setPushMessages] = useState<boolean>(true);
  const [pushEvents, setPushEvents] = useState<boolean>(true);
  const [pushEmergency, setPushEmergency] = useState<boolean>(true);
  const [pushSound, setPushSound] = useState<boolean>(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState<boolean>(true);
  const [pinLockEnabled, setPinLockEnabled] = useState<boolean>(true);
  const [savedNotice, setSavedNotice] = useState<string>('');

  const handleSaveSettings = () => {
    setSavedNotice('Preferences saved securely.');
    triggerPushNotification({
      title: 'Preferences Updated',
      body: 'Your notification, accessibility, and security configurations are active.',
      category: 'urgent',
    });
    setTimeout(() => setSavedNotice(''), 4000);
  };

  const handleTestSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        'EduPulse accessibility audio test: Voice readout is functioning normally.'
      );
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported on this browser.');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            <Settings className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              App Settings & Privacy Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Notification preferences, biometric authentication, accessibility & dark mode
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm"
        >
          Save Preferences
        </button>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Grid of Settings Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Push Notification Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
            <Bell className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Push Notification Preferences
            </h3>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                  Daily Grades & Assignment Scores
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Instant alert when teachers publish new assignment scores
                </span>
              </div>
              <input
                type="checkbox"
                checked={pushGrades}
                onChange={(e) => setPushGrades(e.target.checked)}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                  Morning Attendance & Gate Check-in
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Notification as soon as RFID gate scanner confirms student entry
                </span>
              </div>
              <input
                type="checkbox"
                checked={pushAttendance}
                onChange={(e) => setPushAttendance(e.target.checked)}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                  Direct Teacher Messages
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time notification when a teacher sends or replies to a message
                </span>
              </div>
              <input
                type="checkbox"
                checked={pushMessages}
                onChange={(e) => setPushMessages(e.target.checked)}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                  School Events & Conference Reminders
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  24-hour and 1-hour reminders before scheduled school events
                </span>
              </div>
              <input
                type="checkbox"
                checked={pushEvents}
                onChange={(e) => setPushEvents(e.target.checked)}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                  Urgent District & Weather Announcements
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Emergency dismissals, weather warnings, and health alerts
                </span>
              </div>
              <input
                type="checkbox"
                checked={pushEmergency}
                onChange={(e) => setPushEmergency(e.target.checked)}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                  Audible Notification Chime
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Play pleasant audio tone when in-app push banners arrive
                </span>
              </div>
              <input
                type="checkbox"
                checked={pushSound}
                onChange={(e) => setPushSound(e.target.checked)}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Module 2: Biometric & Security Vault */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
            <Shield className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Biometric Authentication & Privacy
            </h3>
          </div>

          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Fingerprint className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Touch ID / Face ID Biometrics
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Require biometric scan on app launch for FERPA compliance
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={biometricsEnabled}
                onChange={(e) => setBiometricsEnabled(e.target.checked)}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                  4-Digit Security PIN Backup
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Configured PIN: **** (Demo code: 1234)
                </span>
              </div>
              <input
                type="checkbox"
                checked={pinLockEnabled}
                onChange={(e) => setPinLockEnabled(e.target.checked)}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={lockApp}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
              >
                <Lock className="w-4 h-4 text-indigo-400" />
                <span>Test Biometric Lock Screen Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Module 3: Accessibility & Readability */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
            <Eye className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Accessibility & Display Controls
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 block mb-2">
                Font Size Scaling
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['normal', 'large', 'xlarge'] as FontSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize transition border ${
                      fontSize === size
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {size === 'normal' ? 'Normal (100%)' : size === 'large' ? 'Large (115%)' : 'X-Large (130%)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                  High Contrast Mode
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Enhance border visibility & color contrast for low-vision users
                </span>
              </div>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={handleTestSpeech}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-600"
              >
                <Volume2 className="w-4 h-4 text-indigo-500" />
                <span>Test Screen Reader Voice Readout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Module 4: Appearance & Dark Mode */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
            {isDarkMode ? (
              <Moon className="w-5 h-5 text-indigo-400" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Appearance & Theme
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                  Dark Mode Theme
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Easier on the eyes during evening homework reviews
                </span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <div className="flex justify-between">
                <span>Account Holder:</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Guardian Email:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{currentUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span>SMS Push Hotline:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{currentUser.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
