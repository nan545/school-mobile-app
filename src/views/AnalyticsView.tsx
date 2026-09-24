import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart2,
  TrendingUp,
  Activity,
  Clock,
  Eye,
  CheckCircle,
  Users,
  Award,
  Bell,
  ArrowUpRight,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { activeStudent, grades, attendance } = useApp();

  const weeklySessions = [
    { day: 'Mon', sessions: 4, label: '4 Logins' },
    { day: 'Tue', sessions: 6, label: '6 Logins' },
    { day: 'Wed', sessions: 3, label: '3 Logins' },
    { day: 'Thu', sessions: 7, label: '7 Logins' },
    { day: 'Fri', sessions: 5, label: '5 Logins' },
    { day: 'Sat', sessions: 2, label: '2 Logins' },
    { day: 'Sun', sessions: 4, label: '4 Logins' },
  ];

  const maxSessions = Math.max(...weeklySessions.map((s) => s.sessions));

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <BarChart2 className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Engagement & Performance Analytics
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Parent portal usage metrics, academic trajectories, and school-wide benchmarks
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
          <Award className="w-4 h-4" />
          <span>Top 5% Engaged Parent District-wide</span>
        </div>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">
              Engagement Score
            </span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            96 / 100
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +8 pts vs last month
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">
              Weekly Portal Visits
            </span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            31 Sessions
          </div>
          <p className="text-[11px] text-slate-500">
            Avg 4.4 daily app opens
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">
              Push Open Rate
            </span>
            <Bell className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            94.8%
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Median read time: 3.2 mins
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">
              Teacher Response Time
            </span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            18 Mins
          </div>
          <p className="text-[11px] text-slate-500">
            Parent-to-teacher message speed
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Portal Engagement Histogram */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Weekly Parent Engagement Activity
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Daily logins and student record reviews this week
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                Peak: Thursday
              </span>
            </div>

            {/* Bar Chart Visualization */}
            <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
              {weeklySessions.map((item, idx) => {
                const heightPct = (item.sessions / maxSessions) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 transition">
                      {item.sessions}
                    </span>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-xl h-32 flex items-end p-1">
                      <div
                        className="w-full rounded-lg bg-gradient-to-t from-indigo-600 to-cyan-400 group-hover:from-indigo-500 group-hover:to-cyan-300 transition-all duration-300"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 flex items-center justify-between">
            <span>Weekly Average: 4.4 visits/day</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              +14% vs district baseline
            </span>
          </div>
        </div>

        {/* Academic Grade Distribution Breakdown */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Course Grade Performance Matrix
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Current score compared with school grade benchmarks
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              {grades.map((subj) => (
                <div key={subj.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {subj.name}
                    </span>
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                      {subj.currentPercentage}% ({subj.letterGrade})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        subj.currentPercentage >= 90
                          ? 'bg-emerald-500'
                          : 'bg-indigo-600'
                      }`}
                      style={{ width: `${subj.currentPercentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 flex items-center justify-between">
            <span>Overall GPA: {activeStudent.currentGpa.toFixed(2)}</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
              Class Percentile: 95th
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
