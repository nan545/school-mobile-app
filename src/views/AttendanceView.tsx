import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  UploadCloud,
  Check,
  Plus,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { AbsenceExcuseRequest } from '../types';

export const AttendanceView: React.FC = () => {
  const {
    activeStudent,
    attendance,
    excuseRequests,
    submitExcuseRequest,
    simulateMorningScan,
  } = useApp();

  const [showExcuseModal, setShowExcuseModal] = useState<boolean>(false);
  const [excuseDate, setExcuseDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [excuseReason, setExcuseReason] = useState<AbsenceExcuseRequest['reason']>('Illness');
  const [excuseNote, setExcuseNote] = useState<string>('');
  const [docName, setDocName] = useState<string>('');

  const todayRecord = attendance[0];

  const handleExcuseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!excuseNote.trim()) return;

    submitExcuseRequest({
      studentId: activeStudent.id,
      date: excuseDate,
      reason: excuseReason,
      note: excuseNote.trim(),
      documentName: docName || undefined,
    });

    setExcuseNote('');
    setDocName('');
    setShowExcuseModal(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <CalendarCheck className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Daily Attendance & Check-in
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live automated gate check-ins & period verification for {activeStudent.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={simulateMorningScan}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition border border-slate-200 dark:border-slate-600"
          >
            Simulate RFID Gate Scan
          </button>
          <button
            onClick={() => setShowExcuseModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Absence Note</span>
          </button>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500">
            Attendance Rate
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {activeStudent.attendanceRate}%
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Exceeds 95% school goal
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500">
            Days Present
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            42 Days
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Fall Semester to date
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500">
            Excused Absences
          </span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
            1 Day
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Medical note verified
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500">
            Tardy Count
          </span>
          <div className="text-2xl font-black text-amber-500 mt-0.5">
            1 Instance
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Bus delay (Excused)
          </span>
        </div>
      </div>

      {/* Today's Period-by-Period Status */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Today&apos;s Class Period Verification
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live attendance recorded by each subject teacher
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Campus Arrival: {todayRecord?.checkInTime || '7:51 AM'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(todayRecord?.periods || [
            { period: 1, subject: 'Algebra I Honors', status: 'Present' },
            { period: 2, subject: 'Integrated Science', status: 'Present' },
            { period: 3, subject: 'English Language Arts', status: 'Present' },
            { period: 4, subject: 'World History', status: 'Present' },
            { period: 5, subject: 'Spanish I', status: 'Present' },
            { period: 6, subject: 'Physical Education', status: 'Present' },
          ]).map((p) => (
            <div
              key={p.period}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/80 dark:border-slate-700 text-center flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Period {p.period}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-2">
                  {p.subject}
                </h4>
              </div>
              <div className="mt-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  <Check className="w-3 h-3" />
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom 2 Columns: 30-Day Attendance Log & Submitted Excuse Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance History Timeline */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
            Recent Attendance Log
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-96 overflow-y-auto pr-1">
            {attendance.map((rec, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {rec.date}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {rec.checkInTime ? `Check-in: ${rec.checkInTime}` : 'All Day'}
                    {rec.note ? ` • ${rec.note}` : ''}
                  </span>
                </div>
                <div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      rec.status === 'Present'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : rec.status === 'Tardy'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400'
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Absence Notes & Excuse Submissions */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Submitted Absence & Doctor Excuses
              </h3>
              <span className="text-xs text-slate-400">
                {excuseRequests.length} on file
              </span>
            </div>

            <div className="space-y-3">
              {excuseRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/80 dark:border-slate-700 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Date of Absence: {req.date}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        req.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    Reason: {req.reason}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    &ldquo;{req.note}&rdquo;
                  </p>
                  {req.documentName && (
                    <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Attached: {req.documentName}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => setShowExcuseModal(true)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>Submit New Absence Note / Doctor Slip</span>
            </button>
          </div>
        </div>
      </div>

      {/* Excuse Submission Modal */}
      {showExcuseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Submit Absence or Medical Excuse
              </h3>
              <button
                onClick={() => setShowExcuseModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExcuseSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Date of Absence
                </label>
                <input
                  type="date"
                  value={excuseDate}
                  onChange={(e) => setExcuseDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Reason for Absence
                </label>
                <select
                  value={excuseReason}
                  onChange={(e) => setExcuseReason(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                >
                  <option value="Illness">Illness / Health</option>
                  <option value="Medical Appointment">Doctor / Dental / Therapy Appointment</option>
                  <option value="Family Emergency">Family Emergency</option>
                  <option value="Bereavement">Bereavement</option>
                  <option value="Religious Observance">Religious Observance</option>
                  <option value="Other">Other Excused Reason</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Explanation / Note to Attendance Office
                </label>
                <textarea
                  value={excuseNote}
                  onChange={(e) => setExcuseNote(e.target.value)}
                  placeholder="Please excuse Leo's absence today due to a fever..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Attach Doctor Slip / Note (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. clinic_receipt_oct24.pdf"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setDocName('pediatric_doctor_note_verified.pdf')}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
                  >
                    Attach Sample
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExcuseModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Attendance Office</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
