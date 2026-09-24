import React from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, Battery, Signal, Smartphone, Sparkles, X } from 'lucide-react';

export const DeviceFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { deviceFrame, setDeviceFrame } = useApp();

  if (deviceFrame === 'desktop') {
    return <div className="min-h-screen w-full flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900/90 dark:bg-black py-4 sm:py-8 px-2 flex flex-col items-center justify-center transition-colors">
      {/* Device Mode Switcher Floating Bar */}
      <div className="mb-3 flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-full border border-slate-700 shadow-lg text-xs">
        <span className="text-slate-400 font-medium">Previewing Platform:</span>
        <span className="font-bold text-indigo-400 uppercase tracking-wider">
          {deviceFrame === 'ios' ? 'iOS (iPhone 16 Pro)' : 'Android (Pixel 9 Pro)'}
        </span>
        <button
          onClick={() => setDeviceFrame('desktop')}
          className="ml-2 px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-[11px] transition text-slate-200"
        >
          Exit Device Mode
        </button>
      </div>

      {/* Frame Container */}
      <div
        className={`relative w-full max-w-[412px] h-[870px] bg-slate-950 rounded-[50px] p-3 shadow-[0_0_60px_rgba(0,0,0,0.8)] border-[6px] transition-all flex flex-col overflow-hidden ${
          deviceFrame === 'ios' ? 'border-slate-800 ring-1 ring-slate-700' : 'border-zinc-800 ring-1 ring-zinc-700'
        }`}
      >
        {/* Device Top Bezel & Status Bar */}
        <div className="relative pt-2 pb-1 px-6 flex items-center justify-between text-white text-[12px] font-semibold select-none z-30 shrink-0">
          {deviceFrame === 'ios' ? (
            <>
              <span>9:41</span>
              {/* Dynamic Island */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-28 h-6 bg-black rounded-full flex items-center justify-between px-2.5 border border-zinc-800 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-500/80 animate-pulse"></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </>
          ) : (
            <>
              {/* Android Status Bar */}
              <span>10:42</span>
              {/* Android Punch Hole Camera */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-3.5 h-3.5 bg-black rounded-full border border-zinc-800"></div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono">5G</span>
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </>
          )}
        </div>

        {/* Screen Content Wrapper */}
        <div className="relative flex-1 bg-slate-50 dark:bg-slate-900 rounded-[38px] overflow-hidden flex flex-col shadow-inner">
          <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
            {children}
          </div>

          {/* Device Home Bar Indicator */}
          <div className="h-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center shrink-0">
            {deviceFrame === 'ios' ? (
              <div className="w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
            ) : (
              <div className="w-18 h-1 bg-zinc-400 dark:bg-zinc-600 rounded-full" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
