import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, LifeBuoy } from 'lucide-react';
import { useHabits } from '../context/HabitContext';

export default function CalendarPage() {
  const { habits, logs } = useHabits();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Only consider logs for currently existing active habits!
  const activeHabitIds = new Set(habits.filter(h => h.active).map(h => h.id));
  const validLogs = logs.filter(l => activeHabitIds.has(l.habitId));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#293730] pb-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-[#659F84]" />
            Monthly Calendar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Non-punitive monthly history of check-ins and recovery events.</p>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-xl border border-slate-200 dark:border-[#293730] bg-slate-50 dark:bg-[#202B25] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-heading text-sm font-bold text-slate-900 dark:text-white min-w-[120px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-xl border border-slate-200 dark:border-[#293730] bg-slate-50 dark:bg-[#202B25] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Calendar Symbol Legend Key Bar */}
      <div className="rounded-2xl bg-slate-50 dark:bg-[#202B25] border border-slate-200 dark:border-[#293730] p-3.5 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Calendar Symbol Key:</span>
        
        <div className="flex items-center gap-6 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-[#40755C] dark:text-[#84B59F]">
            <CheckCircle2 className="h-4 w-4 text-[#659F84]" />
            <span>Green Checkmark = Habit Completed</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#E07A5F]">
            <LifeBuoy className="h-4 w-4 text-[#E07A5F]" />
            <span>Orange Lifebuoy = Missed Day (AI Rescue Triggered)</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="rounded-3xl border border-slate-200 dark:border-[#293730] bg-white dark:bg-[#202B25] p-5 shadow-xl space-y-3">
        
        {/* Days Header */}
        <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-500 dark:text-slate-400 py-2 border-b border-slate-200 dark:border-[#293730]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayLogs = validLogs.filter(l => l.date === dateStr);
            const hasCompleted = dayLogs.some(l => l.status === 'completed');
            const hasMissed = dayLogs.some(l => l.status === 'missed');
            const isCurrentM = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={dateStr}
                className={`min-h-[70px] rounded-2xl border p-2 flex flex-col justify-between transition-all ${
                  !isCurrentM
                    ? 'opacity-30 border-transparent bg-transparent'
                    : isToday
                    ? 'border-[#659F84] bg-[#659F84]/10'
                    : 'border-slate-200 dark:border-[#293730] bg-slate-50 dark:bg-[#141917]'
                }`}
              >
                <span className={`text-xs font-bold ${isToday ? 'text-[#40755C] dark:text-[#84B59F]' : 'text-slate-700 dark:text-slate-300'}`}>
                  {format(day, 'd')}
                </span>

                <div className="flex items-center gap-1 flex-wrap">
                  {hasCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-[#659F84]" title="Completed Habit" />}
                  {hasMissed && <LifeBuoy className="h-3.5 w-3.5 text-[#E07A5F]" title="Missed Habit (AI Rescue Triggered)" />}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
