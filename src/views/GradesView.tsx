import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Award,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  FileCheck,
  Download,
  PlusCircle,
  HelpCircle,
  Filter,
} from 'lucide-react';
import { SubjectGrade } from '../types';

export const GradesView: React.FC = () => {
  const { activeStudent, grades, setActiveTab, simulateGradeUpdate } = useApp();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(grades[0]?.id || '');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const selectedSubject = grades.find((g) => g.id === selectedSubjectId) || grades[0];

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Grades Header & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <GraduationCap className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Daily Grades & Academic Progress
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official records for {activeStudent.name} • {activeStudent.term}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={simulateGradeUpdate}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Simulate New Grade</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-600"
          >
            <Download className="w-4 h-4" />
            <span>Export Report Card</span>
          </button>
        </div>
      </div>

      {/* GPA & Academic Achievements Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 block">
            Weighted GPA
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {activeStudent.currentGpa.toFixed(2)}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3 h-3" />
            Top 5% of Class
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 block">
            Unweighted GPA
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {activeStudent.unweightedGpa.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            4.0 Standard Scale
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 block">
            Honor Roll Status
          </span>
          <div className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>High Honors</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Principal&apos;s List
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 block">
            Total Enrolled
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {grades.length} Courses
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            All currently passing
          </span>
        </div>
      </div>

      {/* Main Grid: Subject List (Left) + Detailed Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Subjects List */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 px-1">
            Subject Catalog
          </div>
          {grades.map((subj) => {
            const isSelected = subj.id === selectedSubjectId;
            return (
              <div
                key={subj.id}
                onClick={() => setSelectedSubjectId(subj.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Period {subj.period} • {subj.room}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {subj.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {subj.teacherName}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-lg font-black text-slate-900 dark:text-white">
                      {subj.currentPercentage}%
                    </div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        subj.letterGrade.startsWith('A')
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {subj.letterGrade}
                    </span>
                  </div>
                </div>

                {/* Micro trend indicator */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <span>Assignments: {subj.assignments.length}</span>
                  <span className="capitalize text-indigo-600 dark:text-indigo-400 font-semibold">
                    Trend: {subj.trend}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 Columns: Detailed Grade Breakdown */}
        {selectedSubject && (
          <div className="lg:col-span-2 space-y-5">
            {/* Subject Banner Card */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedSubject.teacherAvatar}
                    alt={selectedSubject.teacherName}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      {selectedSubject.code} • Period {selectedSubject.period}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {selectedSubject.name}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Instructor: {selectedSubject.teacherName} • {selectedSubject.room}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message Teacher</span>
                  </button>
                </div>
              </div>

              {/* Weighting Breakdown & Historical Quarters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-1">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Grade Weights
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Tests & Exams:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {selectedSubject.categoryWeights.tests}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quizzes:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {selectedSubject.categoryWeights.quizzes}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Homework & Classwork:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {selectedSubject.categoryWeights.homework}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Projects & Labs:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {selectedSubject.categoryWeights.projects}%
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Quarter History
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                      <span className="text-[10px] text-slate-400 block font-semibold">Q1</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {selectedSubject.quarterHistory.q1}%
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block font-bold">
                        Q2 (Current)
                      </span>
                      <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                        {selectedSubject.quarterHistory.q2}%
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                      <span className="text-[10px] text-slate-400 block font-semibold">Q3 (Proj.)</span>
                      <span className="text-sm font-bold text-slate-400">
                        {selectedSubject.quarterHistory.q3}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Assignments List */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Graded Items & Submissions ({selectedSubject.assignments.length})
                </h3>
                <span className="text-xs text-slate-400">Real-time Gradebook Sync</span>
              </div>

              <div className="space-y-3">
                {selectedSubject.assignments.map((assn) => (
                  <div
                    key={assn.id}
                    className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/70 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                            {assn.category}
                          </span>
                          <span className="text-xs text-slate-400">{assn.date}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase ${
                              assn.status === 'graded'
                                ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                                : 'text-amber-600 bg-amber-50 dark:bg-amber-950/40'
                            }`}
                          >
                            {assn.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {assn.title}
                        </h4>
                      </div>

                      <div className="sm:text-right shrink-0">
                        {assn.status === 'graded' ? (
                          <>
                            <div className="text-base font-black text-slate-900 dark:text-white">
                              {assn.score} / {assn.maxScore}
                            </div>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              {assn.percentage}%
                            </span>
                          </>
                        ) : (
                          <div className="text-xs font-semibold text-amber-500">
                            Scheduled
                          </div>
                        )}
                      </div>
                    </div>

                    {assn.feedback && (
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <FileCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            Teacher Feedback:
                          </span>{' '}
                          {assn.feedback}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
