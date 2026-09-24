import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Fingerprint,
  ScanFace,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  Smartphone,
  Eye,
  CheckCircle,
} from 'lucide-react';

export const BiometricLockModal: React.FC = () => {
  const { isBiometricLocked, unlockWithBiometrics, currentUser } = useApp();
  const [pin, setPin] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [authMethod, setAuthMethod] = useState<'biometric' | 'pin'>('biometric');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isBiometricLocked) return null;

  const handleTriggerBiometrics = () => {
    setIsScanning(true);
    setErrorMsg('');
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      setTimeout(() => {
        setScanSuccess(false);
        unlockWithBiometrics();
      }, 700);
    }, 1200);
  };

  const handlePinInput = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === '1234' || nextPin === '0000' || nextPin.length === 4) {
          setScanSuccess(true);
          setTimeout(() => {
            setScanSuccess(false);
            setPin('');
            unlockWithBiometrics();
          }, 600);
        } else {
          setErrorMsg('Incorrect PIN. (Default demo PIN is 1234)');
          setPin('');
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center text-white relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Badges */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            AES-256 Encrypted Session
          </span>
        </div>

        {/* User Card */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
            </div>
          </div>
          <h3 className="text-lg font-bold mt-2.5 text-white">{currentUser.name}</h3>
          <p className="text-xs text-slate-400">Oakridge Parent Portal • Session Locked</p>
        </div>

        {authMethod === 'biometric' ? (
          <div className="flex flex-col items-center">
            {/* Animated Biometric Scanner Button */}
            <button
              onClick={handleTriggerBiometrics}
              disabled={isScanning || scanSuccess}
              className="relative w-28 h-28 rounded-full bg-slate-800/80 border-2 border-slate-700 hover:border-indigo-500 flex flex-col items-center justify-center transition group shadow-inner"
            >
              {isScanning && (
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-75" />
              )}
              {scanSuccess ? (
                <CheckCircle className="w-12 h-12 text-emerald-400 animate-in zoom-in" />
              ) : isScanning ? (
                <ScanFace className="w-12 h-12 text-cyan-400 animate-pulse" />
              ) : (
                <Fingerprint className="w-12 h-12 text-indigo-400 group-hover:scale-105 transition" />
              )}
              <span className="text-[10px] font-semibold text-slate-300 mt-1">
                {scanSuccess ? 'Verified!' : isScanning ? 'Scanning...' : 'Tap Sensor'}
              </span>
            </button>

            <p className="text-xs text-slate-400 mt-4">
              Touch ID / Face ID Biometric Authentication
            </p>

            <button
              onClick={() => setAuthMethod('pin')}
              className="mt-4 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Use 4-Digit Security PIN</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* PIN Dots */}
            <div className="flex items-center gap-3 my-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full transition ${
                    pin.length > i
                      ? 'bg-indigo-500 scale-110 shadow-sm shadow-indigo-500'
                      : 'border-2 border-slate-700'
                  }`}
                />
              ))}
            </div>

            {errorMsg && <p className="text-xs text-rose-400 mb-2">{errorMsg}</p>}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2.5 w-60 my-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
                <button
                  key={n}
                  onClick={() => handlePinInput(n)}
                  className="w-16 h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:bg-indigo-600 text-lg font-bold text-white transition flex items-center justify-center border border-slate-700/60"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setAuthMethod('biometric')}
                className="w-16 h-12 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-xs font-semibold text-slate-400 transition flex items-center justify-center"
              >
                Face ID
              </button>
              <button
                onClick={() => handlePinInput('0')}
                className="w-16 h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-lg font-bold text-white transition flex items-center justify-center border border-slate-700/60"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="w-16 h-12 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-xs font-semibold text-slate-400 transition flex items-center justify-center"
              >
                ⌫
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mt-2">
              Demo PIN: <span className="text-slate-300 font-mono">1234</span>
            </p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>End-to-End Encrypted</span>
          <span>Oakridge Shield v2.4</span>
        </div>
      </div>
    </div>
  );
};
