import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Send,
  Paperclip,
  Check,
  CheckCheck,
  Sparkles,
  Phone,
  Video,
  Clock,
  UserCheck,
  RefreshCw,
  FileText,
  Smile,
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const {
    teacherContacts,
    messages,
    sendMessage,
    currentUser,
    activeStudent,
    triggerPushNotification,
  } = useApp();

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teacherContacts[0]?.id || '');
  const [inputText, setInputText] = useState<string>('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState<boolean>(false);
  const [draftPrompt, setDraftPrompt] = useState<string>('');
  const [showDraftModal, setShowDraftModal] = useState<boolean>(false);
  const [senderRole, setSenderRole] = useState<'parent' | 'teacher'>('parent');

  const selectedTeacher = teacherContacts.find((t) => t.id === selectedTeacherId) || teacherContacts[0];
  const currentThread = messages[selectedTeacherId] || [];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(selectedTeacherId, inputText, senderRole);
    setInputText('');
  };

  const handleUseQuickPreset = (preset: string) => {
    setInputText(preset);
  };

  const handleGenerateAiDraft = async () => {
    setIsGeneratingDraft(true);
    try {
      const res = await fetch('/api/gemini/draft-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherName: selectedTeacher.name,
          subject: selectedTeacher.subject,
          topic: draftPrompt || 'Recent assignment and student progress',
          studentName: activeStudent.name,
        }),
      });
      const data = await res.json();
      if (data.draft) {
        setInputText(data.draft);
        setShowDraftModal(false);
        setDraftPrompt('');
      }
    } catch (err) {
      setInputText(
        `Dear ${selectedTeacher.name},\n\nI hope you are having a wonderful week. I am reaching out to check on ${activeStudent.name}'s progress in ${selectedTeacher.subject} and see if there are any specific concepts we should review at home.\n\nThank you for your guidance!\nWarm regards,\nSarah Hayes`
      );
      setShowDraftModal(false);
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto h-[calc(100vh-140px)] min-h-[640px] flex flex-col space-y-4">
      {/* Top Banner with Teacher Switcher & Perspective Toggle */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
            <MessageSquare className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Direct Teacher Communication
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Encrypted messaging hub with {activeStudent.name}&apos;s educators
            </p>
          </div>
        </div>

        {/* Perspective Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-xl text-xs">
            <button
              onClick={() => setSenderRole('parent')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                senderRole === 'parent'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sending as: Parent
            </button>
            <button
              onClick={() => setSenderRole('teacher')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                senderRole === 'teacher'
                  ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Send as: Teacher (Test)
            </button>
          </div>

          <button
            onClick={() => setShowDraftModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold hover:opacity-95 transition flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Draft Note</span>
          </button>
        </div>
      </div>

      {/* Main Messaging Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-hidden">
        {/* Left Sidebar: Teachers List */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              Instructor Channels
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
            {teacherContacts.map((t) => {
              const isSelected = t.id === selectedTeacherId;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTeacherId(t.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-l-4 border-indigo-600'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/40'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-800 ${
                        t.status === 'Available' ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {t.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {t.lastMessageTime}
                      </span>
                    </div>
                    <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 truncate">
                      {t.subject}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {t.lastMessageSnippet}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Area: Active Chat Conversation */}
        <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col overflow-hidden">
          {/* Conversation Header */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={selectedTeacher.avatar}
                alt={selectedTeacher.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedTeacher.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedTeacher.title} • {selectedTeacher.officeHours}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {selectedTeacher.status}
              </span>
            </div>
          </div>

          {/* Quick Reply Presets Strip */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-700/60 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
            <span className="text-slate-400 font-bold uppercase text-[10px]">
              Quick Drafts:
            </span>
            {[
              'Request 15-min conference slot',
              'Homework question on yesterday’s worksheet',
              'Thank you for the encouraging feedback!',
              'Leo will be absent on Friday due to dentist',
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleUseQuickPreset(preset)}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-300 text-[11px] whitespace-nowrap transition"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-900/20">
            {currentThread.map((msg) => {
              const isMe = msg.senderRole === senderRole;
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mb-1 border border-slate-200 dark:border-slate-700"
                    />
                  )}

                  <div
                    className={`max-w-[78%] rounded-2xl p-3.5 shadow-xs text-xs sm:text-sm ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-br-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                    }`}
                  >
                    <div
                      className={`text-[10px] font-bold mb-1 opacity-80 ${
                        isMe ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.senderName}
                    </div>

                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                    {/* Attachment preview */}
                    {msg.attachment && (
                      <div
                        className={`mt-2 p-2 rounded-xl flex items-center gap-2 border ${
                          isMe
                            ? 'bg-indigo-700/80 border-indigo-500'
                            : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold truncate">
                            {msg.attachment.name}
                          </div>
                          {msg.attachment.size && (
                            <div className="text-[10px] opacity-75">{msg.attachment.size}</div>
                          )}
                        </div>
                      </div>
                    )}

                    <div
                      className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
                        isMe ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMe && (
                        <span>
                          {msg.status === 'read' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-indigo-300" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-2 shrink-0"
          >
            <button
              type="button"
              onClick={() =>
                setInputText((prev) => `${prev} [Attachment: Assignment_Sample.pdf]`)
              }
              title="Attach File / Assignment"
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={`Message ${selectedTeacher.name} as ${senderRole}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 border-none text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-indigo-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Gemini AI Message Drafter Modal */}
      {showDraftModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  EduPulse AI Note Drafter
                </h3>
              </div>
              <button
                onClick={() => setShowDraftModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Gemini will craft a polite, well-structured message to{' '}
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedTeacher.name}
                </span>{' '}
                incorporating {activeStudent.name}&apos;s academic context.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  What would you like to discuss?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Schedule a quick 10-min Zoom call regarding the upcoming math test"
                  value={draftPrompt}
                  onChange={(e) => setDraftPrompt(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDraftModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateAiDraft}
                  disabled={isGeneratingDraft}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
                >
                  {isGeneratingDraft ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Drafting with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Message</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
