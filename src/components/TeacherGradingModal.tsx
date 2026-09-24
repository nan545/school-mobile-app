import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { addAssignmentToFirestore } from '../firebase/dbService';
import {
  GraduationCap,
  PlusCircle,
  X,
  Send,
  Award,
  FileCheck,
} from 'lucide-react';
import { Assignment } from '../types';

interface TeacherGradingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherGradingModal: React.FC<TeacherGradingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { grades, activeStudent, triggerPushNotification } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(grades[0]?.id || '');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<Assignment['category']>('Quiz');
  const [score, setScore] = useState<number>(95);
  const [maxScore, setMaxScore] = useState<number>(100);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedSubjectId) return;

    setIsSubmitting(true);
    const percentage = Math.round((score / maxScore) * 100);
    const newAssignment: Assignment = {
      id: `assn-${Date.now()}`,
      title: title.trim(),
      category,
      score,
      maxScore,
      percentage,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      status: 'graded',
      feedback: feedback.trim() || undefined,
    };

    await addAssignmentToFirestore(selectedSubjectId, newAssignment);

    const subject = grades.find((g) => g.id === selectedSubjectId);

    triggerPushNotification({
      title: `New Grade Posted: ${subject?.name || 'Classwork'}`,
      body: `${activeStudent.name} received ${percentage}% (${score}/${maxScore}) on "${title.trim()}".`,
      category: 'grade',
      actionTab: 'grades',
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <GraduationCap className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Teacher Gradebook Entry
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Post official score for {activeStudent.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Select Subject Course
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
              required
            >
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} (Current: {g.currentPercentage}%, {g.letterGrade})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Assignment / Exam Title
            </label>
            <input
              type="text"
              placeholder="e.g. Chapter 4 Polynomials Exam"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
              >
                <option value="Exam">Exam (40%)</option>
                <option value="Quiz">Quiz (25%)</option>
                <option value="Homework">Homework (20%)</option>
                <option value="Project">Project (15%)</option>
                <option value="Lab">Lab (10%)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Points Earned
              </label>
              <input
                type="number"
                min="0"
                max="200"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Total Max
              </label>
              <input
                type="number"
                min="1"
                max="200"
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Teacher Feedback / Encouragement
            </label>
            <textarea
              placeholder="e.g. Excellent work on step-by-step factoring proofs!"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Posting...' : 'Publish to Student Portal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
