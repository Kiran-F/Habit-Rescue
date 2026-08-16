import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  MinusCircle, 
  LifeBuoy, 
  Clock, 
  ArrowRight,
  MoreVertical,
  Edit2,
  Trash2,
  Check
} from 'lucide-react';
import { format } from 'date-fns';
import { useHabits } from '../../context/HabitContext';
import MissedHabitModal from './MissedHabitModal';

export default function HabitCard({ habit, onEdit }) {
  const { 
    logs, 
    recoveryPlans, 
    logHabitStatus, 
    deleteHabit 
  } = useHabits();

  const [missModalOpen, setMissModalOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayLog = logs.find(l => l.habitId === habit.id && l.date === todayStr);

  const currentPlan = recoveryPlans.find(p => p.habitId === habit.id && p.status !== 'completed');

  const categoryColors = {
    Fitness: 'bg-[#659F84]/20 text-[#84B59F] border-[#659F84]/40',
    Hydration: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    Sleep: 'bg-emerald-600/20 text-emerald-300 border-emerald-600/40',
    Study: 'bg-[#E9C46A]/20 text-[#E9C46A] border-[#E9C46A]/40',
    Productivity: 'bg-[#E07A5F]/20 text-[#E07A5F] border-[#E07A5F]/40',
    Mindfulness: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    Personal: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    Other: 'bg-slate-500/20 text-slate-300 border-slate-500/40'
  };

  const badgeColor = categoryColors[habit.category] || categoryColors.Other;

  return (
    <>
      <div className={`relative flex flex-col justify-between rounded-3xl border p-5 transition-all ${
        habit.inRescueMode || currentPlan
          ? 'bg-[#202B25] border-[#E07A5F]/60 shadow-lg shadow-black/40 glow-amber'
          : 'bg-[#202B25] border-[#293730] hover:border-[#659F84]/50 glass-card-hover'
      }`}>
        
        {/* Card Top */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badgeColor}`}>
                  {habit.category}
                </span>
                {(habit.inRescueMode || currentPlan) && (
                  <span className="rounded-full bg-[#E07A5F]/20 text-[#E07A5F] border border-[#E07A5F]/40 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1 animate-pulse">
                    <LifeBuoy className="h-3 w-3 text-[#E07A5F]" /> Rescue Mode Active
                  </span>
                )}
              </div>
              <h3 className="font-heading text-lg font-bold text-white tracking-tight">
                <Link to={`/habits/${habit.id}`} className="hover:text-[#84B59F] transition-colors">
                  {habit.name}
                </Link>
              </h3>
            </div>

            {/* Menu options */}
            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="rounded-lg p-1 text-slate-400 hover:bg-[#141917] hover:text-white"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {showOptions && (
                <div className="absolute right-0 top-7 z-10 w-36 rounded-2xl border border-[#293730] bg-[#141917] p-1.5 shadow-xl space-y-1">
                  <button
                    onClick={() => { setShowOptions(false); onEdit?.(habit); }}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 hover:bg-[#202B25] hover:text-white"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit Habit
                  </button>
                  <button
                    onClick={() => { setShowOptions(false); deleteHabit(habit.id); }}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-950/40"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete Habit
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2">
            {habit.description || `Target: ${habit.targetAmount} ${habit.targetUnit} (${habit.frequency})`}
          </p>

          <div className="flex items-center gap-3 text-xs text-slate-400 pt-1 border-t border-[#293730]">
            <span className="flex items-center gap-1 font-semibold text-[#84B59F]">
              <Clock className="h-3.5 w-3.5 text-[#659F84]" />
              {habit.targetAmount} {habit.targetUnit}
            </span>
          </div>
        </div>

        {/* Clean Rescue Plan Redirect Button */}
        {currentPlan && (
          <div className="my-3">
            <Link
              to="/rescue"
              className="flex items-center justify-between gap-2 w-full rounded-2xl bg-[#E07A5F]/15 border border-[#E07A5F]/40 px-3.5 py-2.5 text-xs font-bold text-[#E07A5F] hover:bg-[#E07A5F]/25 transition-all group"
            >
              <span className="flex items-center gap-1.5">
                <LifeBuoy className="h-4 w-4 text-[#E07A5F]" />
                View Recovery Plan in Rescue Center
              </span>
              <ArrowRight className="h-4 w-4 text-[#E07A5F] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        {/* Check-In Controls for Today */}
        <div className="mt-4 pt-3 border-t border-[#293730]">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2">
            Today's Check-in ({todayStr}):
          </span>

          <div className="grid grid-cols-3 gap-2">
            {/* Mark Done Button (Green #659F84 when Completed, Light Orange #E07A5F otherwise!) */}
            <button
              onClick={() => logHabitStatus(habit.id, 'completed')}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-bold transition-all ${
                todayLog?.status === 'completed'
                  ? 'bg-[#659F84] text-[#141917] font-extrabold shadow-md shadow-[#659F84]/20'
                  : 'bg-[#E07A5F] text-white hover:bg-[#C95A3F]'
              }`}
            >
              {todayLog?.status === 'completed' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#141917] stroke-[3]" />
                  Done
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Mark Done
                </>
              )}
            </button>

            {/* Missed / Rescue Button */}
            <button
              onClick={() => setMissModalOpen(true)}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-semibold border transition-all ${
                todayLog?.status === 'missed'
                  ? 'bg-[#E9C46A]/20 border-[#E9C46A] text-[#E9C46A] font-bold'
                  : 'bg-[#141917] border-[#293730] text-slate-300 hover:bg-[#E9C46A]/20 hover:text-[#E9C46A]'
              }`}
            >
              <LifeBuoy className="h-3.5 w-3.5 text-[#E9C46A]" />
              Missed
            </button>

            {/* Skip Button */}
            <button
              onClick={() => logHabitStatus(habit.id, 'skipped', 'Rest day')}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-medium border transition-all ${
                todayLog?.status === 'skipped'
                  ? 'bg-[#293730] text-slate-300'
                  : 'bg-[#141917] border-[#293730] text-slate-400 hover:bg-[#202B25]'
              }`}
            >
              <MinusCircle className="h-3.5 w-3.5" />
              Skip
            </button>
          </div>
        </div>

      </div>

      {/* Missed Habit Modal */}
      <MissedHabitModal
        habit={habit}
        isOpen={missModalOpen}
        onClose={() => setMissModalOpen(false)}
      />
    </>
  );
}
