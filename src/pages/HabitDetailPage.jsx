import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  LifeBuoy, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Calendar,
  RotateCcw,
  TrendingUp
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useHabits } from '../context/HabitContext';
import RescueCard from '../components/rescue/RescueCard';
import PatternCard from '../components/insights/PatternCard';

export default function HabitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { habits, logs, recoveryPlans, insights, triggerRescueMode } = useHabits();

  const habit = habits.find(h => h.id === id);
  if (!habit) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-lg font-bold text-white">Habit not found</h2>
        <Link to="/habits" className="text-xs font-semibold text-emerald-400 hover:underline">
          Return to Habits Directory
        </Link>
      </div>
    );
  }

  const habitLogs = logs.filter(l => l.habitId === habit.id);
  const completedLogs = habitLogs.filter(l => l.status === 'completed');
  const missedLogs = habitLogs.filter(l => l.status === 'missed');
  const activePlan = recoveryPlans.find(p => p.habitId === habit.id && p.status === 'active');
  const habitInsights = insights.filter(i => i.habitId === habit.id);

  // Failure reasons tally
  const reasonTally = {};
  missedLogs.forEach(l => {
    const r = l.failureReason || 'General Fatigue';
    reasonTally[r] = (reasonTally[r] || 0) + 1;
  });

  const completionRate = habitLogs.length > 0 ? Math.round((completedLogs.length / habitLogs.length) * 100) : 100;

  return (
    <div className="space-y-8">
      
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <button
          onClick={() => triggerRescueMode(habit.id, 'Manual check-in request', 'Requesting custom recovery micro-steps')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs font-bold text-amber-300 hover:bg-amber-500/20"
        >
          <LifeBuoy className="h-3.5 w-3.5 text-amber-400" />
          Trigger AI Rescue Mode
        </button>
      </div>

      {/* Habit Header */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-xs font-semibold">
            {habit.category}
          </span>
          {habit.inRescueMode && (
            <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 text-xs font-bold flex items-center gap-1">
              <LifeBuoy className="h-3.5 w-3.5" /> Rescue Mode Active
            </span>
          )}
        </div>

        <h1 className="font-heading text-3xl font-extrabold text-white">{habit.name}</h1>
        <p className="text-sm text-slate-300">{habit.description || 'No custom description provided.'}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Daily Target</span>
            <strong className="text-white text-sm">{habit.targetAmount} {habit.targetUnit}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Frequency</span>
            <strong className="text-white text-sm capitalize">{habit.frequency}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Consistency Rate</span>
            <strong className="text-emerald-400 text-sm">{completionRate}%</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Total Misses</span>
            <strong className="text-amber-400 text-sm">{missedLogs.length} days</strong>
          </div>
        </div>
      </div>

      {/* Active Recovery Plan Banner */}
      {activePlan && (
        <div className="space-y-3">
          <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
            <LifeBuoy className="h-5 w-5 text-amber-400" />
            Active AI Recovery Plan
          </h2>
          <RescueCard habit={habit} recoveryPlan={activePlan} />
        </div>
      )}

      {/* AI Insights & Failure Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Failure Reasons Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
          <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            Recorded Failure Obstacles
          </h3>

          {Object.keys(reasonTally).length === 0 ? (
            <p className="text-xs text-slate-400 italic">No missed logs recorded yet.</p>
          ) : (
            <div className="space-y-3 text-xs">
              {Object.entries(reasonTally).map(([reason, count]) => {
                const percent = Math.round((count / missedLogs.length) * 100);
                return (
                  <div key={reason} className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-medium">
                      <span>{reason}</span>
                      <span className="text-amber-400 font-bold">{count} times ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                      <div className="h-full bg-amber-400" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Insights specific to habit */}
        <div className="space-y-4">
          <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            Habit Specific Insights
          </h3>

          {habitInsights.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center space-y-2">
              <Sparkles className="h-5 w-5 text-amber-400 mx-auto" />
              <p className="text-xs text-slate-400">AI is gathering data to detect recurring obstacle patterns.</p>
            </div>
          ) : (
            habitInsights.map(i => <PatternCard key={i.id} insight={i} />)
          )}
        </div>

      </div>

      {/* Completion History Log Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <h3 className="font-heading text-base font-bold text-white">Recent Activity History</h3>

        {habitLogs.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No check-ins logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Reason / Context</th>
                  <th className="py-2.5 px-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {habitLogs.slice(0, 10).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-950/40">
                    <td className="py-2.5 px-3 font-semibold text-white">{log.date}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        log.status === 'missed' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{log.failureReason || '—'}</td>
                    <td className="py-2.5 px-3 text-slate-400 italic">{log.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
