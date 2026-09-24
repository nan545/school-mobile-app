import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Send,
  Bot,
  User,
  RefreshCw,
  Lightbulb,
  TrendingUp,
  Brain,
  CheckCircle,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';
import { AiInsight } from '../types';

export const AiCopilotView: React.FC = () => {
  const { activeStudent, grades, attendance } = useApp();

  const [insights, setInsights] = useState<AiInsight[]>([
    {
      id: 'ins-1',
      type: 'academic',
      priority: 'high',
      title: `Algebra I Honors Exam Target (Upcoming Oct 28)`,
      description: `${activeStudent.name} is currently holding an 88.4% (B+). Assignments indicate factoring polynomials took 3 attempts on Oct 14, but improved to 92% on Oct 22.`,
      actionableTip: 'Review 3 quadratic formula word problems together before 8:00 PM tonight to secure an A- grade on the midterm.',
      metric: '88.4% • +3.4% this quarter',
    },
    {
      id: 'ins-2',
      type: 'habit',
      priority: 'medium',
      title: 'Optimal Homework Completion Window',
      description: `Data analysis reveals ${activeStudent.name} achieves 18% higher quiz scores when homework is finished between 4:30 PM - 6:30 PM compared to after 9:00 PM.`,
      actionableTip: 'Establish a light snack and 45-min study block immediately upon arriving home.',
      metric: 'Avg 52 mins/day study time',
    },
    {
      id: 'ins-3',
      type: 'attendance',
      priority: 'low',
      title: 'Punctuality & Morning Readiness',
      description: `${activeStudent.name} has a 97.6% attendance record with average gate check-in at 7:51 AM. Consistent morning arrival strongly correlates with higher 1st period focus.`,
      actionableTip: 'Praise the morning routine consistency—it has boosted first-period quiz results by +0.3 GPA points.',
      metric: '97.6% Attendance Streak',
    },
  ]);

  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'model'; text: string; time: string }[]
  >([
    {
      role: 'model',
      text: `Hello! I am **EduPulse AI**, your dedicated school assistant. I have analyzed **${activeStudent.name}**'s latest grades, attendance records, and study habits.\n\nHow can I help you today? You can ask me for personalized study plans, test prep suggestions, or questions to ask teachers during conferences!`,
      time: 'Just now',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshingInsights, setIsRefreshingInsights] = useState<boolean>(false);

  const fetchAiInsights = async () => {
    setIsRefreshingInsights(true);
    try {
      const res = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: activeStudent.name,
          gradeLevel: activeStudent.grade,
          grades: grades.map((g) => ({
            name: g.name,
            percentage: g.currentPercentage,
            letter: g.letterGrade,
          })),
          attendance: {
            rate: activeStudent.attendanceRate,
            todayStatus: attendance[0]?.status,
          },
          habits: activeStudent.habits,
        }),
      });
      const data = await res.json();
      if (data.insights && Array.isArray(data.insights)) {
        setInsights(data.insights);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshingInsights(false);
    }
  };

  const handleSendMessage = async (msgText?: string) => {
    const textToSend = msgText || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userEntry = {
      role: 'user' as const,
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userEntry]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          studentContext: {
            name: activeStudent.name,
            grade: activeStudent.grade,
            gpa: activeStudent.currentGpa,
            attendanceRate: activeStudent.attendanceRate,
            habits: activeStudent.habits,
          },
          conversationHistory: chatMessages.slice(-6).map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      const data = await res.json();
      const botReply =
        data.reply ||
        `Based on ${activeStudent.name}'s performance in Algebra and Science, scheduling 30 minutes of focused practice before dinner yields the best results. Let me know if you need questions for their teacher!`;

      setChatMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: `I'm here to support ${activeStudent.name}'s education! Try reviewing recent feedback from Mrs. Jenkins in the Grades tab or booking a conference slot in the Events tab.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    `How can I help ${activeStudent.name} prep for the upcoming Algebra exam?`,
    `Analyze ${activeStudent.name}'s study habits & homework timing`,
    `Suggest 3 questions to ask teachers during Parent-Teacher Conferences`,
    `How can ${activeStudent.name} improve their Science lab report citations?`,
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 text-white p-6 rounded-3xl shadow-xl shadow-indigo-600/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-purple-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Powered by Gemini AI • Personalized for {activeStudent.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            EduPulse AI Assistant & Insights
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm max-w-xl">
            Real-time personalized recommendations, habit correlation analysis, and parent-educator guidance
          </p>
        </div>

        <button
          onClick={fetchAiInsights}
          disabled={isRefreshingInsights}
          className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition flex items-center gap-2 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshingInsights ? 'animate-spin' : ''}`} />
          <span>{isRefreshingInsights ? 'Analyzing Habits...' : 'Re-analyze Habits'}</span>
        </button>
      </div>

      {/* Personalized AI Insights Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Personalized Habit Insights & Alerts
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Based on grades, attendance, and homework patterns
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((ins, idx) => (
            <div
              key={ins.id || idx}
              className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between hover:border-indigo-400 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ins.priority === 'high'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : ins.priority === 'medium'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    }`}
                  >
                    {ins.priority} Priority
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {ins.metric}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {ins.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {ins.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                  Actionable Recommendation:
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-snug">
                  {ins.actionableTip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive AI Chat Assistant */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs overflow-hidden flex flex-col h-[520px]">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                EduPulse Parent Copilot
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ask anything regarding {activeStudent.name}&apos;s academics, homework, or teachers
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            Active
          </span>
        </div>

        {/* Quick Prompts Strip */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-700/60 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] shrink-0">
            Suggestions:
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-300 text-[11px] whitespace-nowrap transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Conversation Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-900/20">
          {chatMessages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                  <div
                    className={`mt-1.5 text-[10px] text-right ${
                      isUser ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              <span>EduPulse AI is analyzing student records & writing response...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder={`Ask a question about ${activeStudent.name}'s grades, study schedule, or teacher tips...`}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 border-none text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-indigo-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputPrompt.trim() || isLoading}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
