import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  CalendarCheck,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  FileText,
  UserCheck,
  Shield,
  Zap,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    activeStudent,
    grades,
    attendance,
    events,
    teacherContacts,
    setActiveTab,
    simulateGradeUpdate,
    simulateMorningScan,
  } = useApp();

  const todayRecord = attendance[0];
  const upcomingEvents = events.slice(0, 3);
  const recentAssignments = grades
    .flatMap((g) =>
      g.assignments.map((a) => ({
        ...a,
        subjectName: g.name,
        teacherName: g.teacherName,
      }))
    )
    .sort((a, b) => (a.status === 'graded' ? -1 : 1))
    .slice(0, 4);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 text-white p-6 shadow-xl shadow-indigo-600/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-indigo-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Academic Year 2026-2027 • Fall Term</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {activeStudent.name}&apos;s Daily Dashboard
            </h1>
            <p className="text-indigo-100 text-sm max-w-xl">
              {activeStudent.grade} • {activeStudent.schoolName} • Homeroom: {activeStudent.homeroom} ({activeStudent.homeroomTeacher})
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-center min-w-[100px]">
              <div className="text-2xl font-black tracking-tight">{activeStudent.currentGpa.toFixed(2)}</div>
              <div className="text-[11px] font-medium text-indigo-100 uppercase tracking-wider">
                Overall GPA
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-center min-w-[100px]">
              <div className="text-2xl font-black tracking-tight text-emerald-300">
                {activeStudent.attendanceRate}%
              </div>
              <div className="text-[11px] font-medium text-indigo-100 uppercase tracking-wider">
                Attendance
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Primary Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Attendance Today Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Today&apos;s Attendance
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {todayRecord?.status || 'Present'}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {todayRecord?.checkInTime ? `Checked In: ${todayRecord.checkInTime}` : 'On Campus'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {todayRecord?.note || 'Main Gate RFID scan registered. All morning class periods marked on-time.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('attendance')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View Periods & History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={simulateMorningScan}
              title="Test real-time attendance scan notification"
              className="text-[11px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
            >
              Test Scan
            </button>
          </div>
        </div>

        {/* Academic Standings Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Current Standing
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
                <TrendingUp className="w-3.5 h-3.5" />
                Honor Roll
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {grades.filter((g) => g.letterGrade.startsWith('A')).length} of {grades.length}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Subjects with straight &apos;A&apos; grade range
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full"
                style={{
                  width: `${(grades.filter((g) => g.letterGrade.startsWith('A')).length / grades.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('grades')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Detailed Subject Breakdown</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={simulateGradeUpdate}
              title="Test new grade posted push alert"
              className="text-[11px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
            >
              + Post Grade
            </button>
          </div>
        </div>

        {/* AI Habit & Insight Spotlight Card */}
        <div className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 dark:from-slate-800 dark:via-slate-800 dark:to-purple-950/40 rounded-2xl p-5 border border-indigo-200/60 dark:border-indigo-900/60 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                EduPulse AI Habit Alert
              </span>
              <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-full">
                Personalized
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Upcoming Algebra Midterm Prep
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Leo has studied an average of 52 mins/day. Completing 2 practice problems on Quadratic roots today will solidify his 88% into an A.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-indigo-100 dark:border-slate-700 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('ai')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Ask AI Copilot for Study Plan</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Grades Overview & Recent Work */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Subject Grade Cards */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Current Course Grades
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Daily updated scores & grading scale
                </p>
              </div>
              <button
                onClick={() => setActiveTab('grades')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View All Subjects</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {grades.map((subject) => (
                <div
                  key={subject.id}
                  onClick={() => setActiveTab('grades')}
                  className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition cursor-pointer bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                        Period {subject.period} • {subject.code}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {subject.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {subject.teacherName}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-slate-900 dark:text-white">
                        {subject.currentPercentage}%
                      </div>
                      <span
                        className={`inline-block px-2 py-0.2 rounded text-[11px] font-bold ${
                          subject.letterGrade.startsWith('A')
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                        }`}
                      >
                        {subject.letterGrade}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        subject.currentPercentage >= 90 ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${Math.min(100, subject.currentPercentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Graded Assignments with Teacher Notes */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Recently Graded Assignments
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Feedback from instructors on recent submissions
                </p>
              </div>
              <button
                onClick={() => setActiveTab('grades')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Gradebook →
              </button>
            </div>

            <div className="space-y-3">
              {recentAssignments.map((assn) => (
                <div
                  key={assn.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/70 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {assn.category}
                      </span>
                      <span className="text-xs text-slate-400">{assn.date}</span>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        • {assn.subjectName}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {assn.title}
                    </div>
                    {assn.feedback && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                        &ldquo;{assn.feedback}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="sm:text-right shrink-0">
                    <div className="text-base font-extrabold text-slate-900 dark:text-white">
                      {assn.score} / {assn.maxScore}
                    </div>
                    <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {assn.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Upcoming Events & Quick Teacher Contacts */}
        <div className="space-y-6">
          {/* Upcoming School Events */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Upcoming Events
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('events')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Calendar →
              </button>
            </div>

            <div className="space-y-3">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setActiveTab('events')}
                  className="p-3 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                    <span>{evt.date}</span>
                    <span className="capitalize text-slate-400">{evt.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                    {evt.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{evt.startTime} • {evt.location.split(' ')[0]}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Direct Message Shortcuts */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Teacher Contacts
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('messages')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Chat Hub →
              </button>
            </div>

            <div className="space-y-2.5">
              {teacherContacts.slice(0, 3).map((teacher) => (
                <div
                  key={teacher.id}
                  onClick={() => setActiveTab('messages')}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {teacher.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {teacher.subject} • {teacher.status}
                    </div>
                  </div>
                  {teacher.unreadCount > 0 ? (
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
