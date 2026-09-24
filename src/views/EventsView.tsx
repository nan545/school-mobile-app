import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarDays,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  HelpCircle,
  XCircle,
  Share2,
  Download,
  Filter,
  Search,
} from 'lucide-react';
import { SchoolEvent } from '../types';

export const EventsView: React.FC = () => {
  const { events, setEventRsvp, activeStudent, triggerPushNotification } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEvents = events.filter((evt) => {
    const matchesCat = filterCategory === 'all' || evt.category === filterCategory;
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleExportIcs = (event: SchoolEvent) => {
    // Generate ICS content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EduPulse School//EN
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerPushNotification({
      title: 'Calendar Event Downloaded',
      body: `"${event.title}" saved to your device calendar.`,
      category: 'event',
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <CalendarDays className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Upcoming School Events & Calendar
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Conferences, athletic matches, exams, and district holidays for {activeStudent.name}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-indigo-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {['all', 'exam', 'academic', 'sports', 'arts', 'holiday'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl capitalize font-semibold transition shrink-0 ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? 'All Events' : cat}
          </button>
        ))}
      </div>

      {/* Events Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-500 transition"
          >
            <div>
              {/* Category Badge & Date */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    evt.category === 'exam'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : evt.category === 'sports'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : evt.category === 'academic'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {evt.category}
                </span>

                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  {evt.date}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {evt.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {evt.description}
              </p>

              {/* Meta details */}
              <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {evt.startTime} - {evt.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{evt.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {evt.attendeeCount} parents & students attending
                  </span>
                </div>
              </div>
            </div>

            {/* RSVP & Add to Calendar Buttons */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Your RSVP:
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEventRsvp(evt.id, 'attending')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      evt.rsvpStatus === 'attending'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    Going
                  </button>
                  <button
                    onClick={() => setEventRsvp(evt.id, 'maybe')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      evt.rsvpStatus === 'maybe'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    Maybe
                  </button>
                  <button
                    onClick={() => setEventRsvp(evt.id, 'declined')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      evt.rsvpStatus === 'declined'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleExportIcs(evt)}
                className="w-full py-1.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold transition flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-600"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Add to Device Calendar (.ics)</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
