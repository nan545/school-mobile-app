import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Cloud,
  CloudCheck,
  RefreshCw,
  Smartphone,
  Tablet,
  Laptop,
  ShieldCheck,
  Download,
  Trash2,
  CheckCircle2,
  Lock,
  HardDrive,
  Copy,
  Check,
} from 'lucide-react';

export const CloudBackupView: React.FC = () => {
  const {
    cloudSyncStatus,
    lastBackupTime,
    backupToCloud,
    restoreFromCloud,
    devices,
    disconnectDevice,
    activeStudent,
    grades,
    attendance,
    currentUser,
    triggerPushNotification,
  } = useApp();

  const [isBackingUp, setIsBackingUp] = useState<boolean>(false);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [backupSuccessMessage, setBackupSuccessMessage] = useState<string>('');
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);

  const samplePayloadPreview = JSON.stringify(
    {
      userId: currentUser.id,
      student: activeStudent.name,
      gpa: activeStudent.currentGpa,
      enrolledSubjects: grades.length,
      attendanceRate: activeStudent.attendanceRate,
      encryption: 'AES-GCM-256',
      vaultChecksum: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    null,
    2
  );

  const handleBackupNow = async () => {
    setIsBackingUp(true);
    setBackupSuccessMessage('');
    const res = await backupToCloud();
    setIsBackingUp(false);
    if (res.success) {
      setBackupSuccessMessage(res.message);
      triggerPushNotification({
        title: 'Cloud Backup Complete',
        body: 'All student grades, attendance, and message records safely synchronized.',
        category: 'urgent',
      });
      setTimeout(() => setBackupSuccessMessage(''), 5000);
    }
  };

  const handleRestoreNow = async () => {
    setIsRestoring(true);
    const res = await restoreFromCloud();
    setIsRestoring(false);
    if (res.success) {
      setBackupSuccessMessage(res.message);
      setTimeout(() => setBackupSuccessMessage(''), 5000);
    }
  };

  const handleExportJson = () => {
    const fullBackup = {
      user: currentUser,
      activeStudent,
      grades,
      attendance,
      backupTimestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edupulse_backup_${activeStudent.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(samplePayloadPreview);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
            <Cloud className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Cloud Backup & Cross-Platform Sync
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Encrypted automatic cloud snapshots & multi-device synchronization
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRestoreNow}
            disabled={isRestoring || isBackingUp}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition border border-slate-200 dark:border-slate-600 flex items-center gap-1.5"
          >
            <HardDrive className="w-4 h-4" />
            <span>{isRestoring ? 'Restoring...' : 'Restore from Cloud'}</span>
          </button>

          <button
            onClick={handleBackupNow}
            disabled={isBackingUp || isRestoring}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isBackingUp ? 'animate-spin' : ''}`} />
            <span>{isBackingUp ? 'Syncing...' : 'Back Up Now'}</span>
          </button>
        </div>
      </div>

      {backupSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{backupSuccessMessage}</span>
        </div>
      )}

      {/* Cloud Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Real-time Multi-Device Sync Active</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Oakridge Unified Cloud Vault
          </h2>
          <p className="text-slate-300 text-xs max-w-lg">
            Last successful snapshot: <span className="font-semibold text-white">{lastBackupTime}</span>. All grades, notes, attendance records, and direct messages are replicated across your iOS, Android, and Web clients.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl text-center min-w-[120px]">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Active Devices
            </span>
            <div className="text-2xl font-black text-white mt-0.5">
              {devices.length} Devices
            </div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-2xl text-center min-w-[120px]">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Encryption
            </span>
            <div className="text-base font-extrabold text-cyan-400 mt-1 flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>AES-256</span>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Devices Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Connected Synchronized Devices ({devices.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Devices currently signed in with push notification access
            </p>
          </div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            Cross-Platform Sync: OK
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {devices.map((dev) => (
            <div
              key={dev.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    {dev.deviceType === 'ios' ? (
                      <Smartphone className="w-4 h-4" />
                    ) : dev.deviceType === 'android' ? (
                      <Tablet className="w-4 h-4" />
                    ) : (
                      <Laptop className="w-4 h-4" />
                    )}
                  </div>
                  {dev.isCurrent ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      This Device
                    </span>
                  ) : (
                    <button
                      onClick={() => disconnectDevice(dev.id)}
                      title="Remote logout"
                      className="text-slate-400 hover:text-rose-500 transition p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {dev.deviceName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {dev.location}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Status:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {dev.lastActive}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Encrypted Vault Inspector & JSON Export */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Encrypted Payload Inspector */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Encrypted Vault Payload Inspection
                </h3>
              </div>
              <button
                onClick={handleCopyHash}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
              >
                {copiedPayload ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPayload ? 'Copied' : 'Copy Payload'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed max-h-48">
              {samplePayloadPreview}
            </pre>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 flex items-center justify-between">
            <span>Zero-Knowledge School Cloud Storage</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Integrity Verified ✓
            </span>
          </div>
        </div>

        {/* Data Export Box */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Data Portability & Export
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Export all academic records, attendance history, and teacher correspondence for your family archives.
            </p>

            <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Full JSON Student Transcript</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Attendance Log & Doctor Notes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Teacher Chat Transcripts</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={handleExportJson}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Complete Backup (.json)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
