import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  LifeBuoy, 
  Clock, 
  Sparkles,
  Droplets,
  Activity,
  BookOpen,
  Heart,
  Dumbbell,
  Moon,
  Smile,
  Target,
  Check
} from 'lucide-react';
import { format } from 'date-fns';
import { useHabits } from '../../context/HabitContext';
import MissedHabitModal from '../habits/MissedHabitModal';

export default function CompactHabitRow({ habit }) {
  const { logs, recoveryPlans, logHabitStatus } = useHabits();
  const [missModalOpen, setMissModalOpen] = useState(false);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayLog = logs.find(l => l.habitId === habit.id && l.date === todayStr);

  const isCompleted = todayLog?.status === 'completed';
  const isMissed = todayLog?.status === 'missed';
  const isSkipped = todayLog?.status === 'skipped';
  
  const activePlan = recoveryPlans.find(p => p.habitId === habit.id && p.status !== 'completed');

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Fitness': return <Dumbbell className="h-4 w-4 text-[#659F84]" />;
      case 'Hydration': return <Droplets className="h-4 w-4 text-teal-400" />;
      case 'Sleep': return <Moon className="h-4 w-4 text-emerald-400" />;
      case 'Study': return <BookOpen className="h-4 w-4 text-[#E9C46A]" />;
      case 'Productivity': return <Activity className="h-4 w-4 text-[#E07A5F]" />;
      case 'Mindfulness': return <Heart className="h-4 w-4 text-amber-400" />;
      default: return <Target className="h-4 w-4 text-[#659F84]" />;
    }
  };

  return (
    <>
      <div className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3.5 transition-all ${
        isCompleted
          ? 'bg-[#659F84]/15 border-[#659F84]/40'
          : habit.inRescueMode || activePlan
          ? 'bg-white dark:bg-[#202B25] border-[#E07A5F]/50 shadow-md glow-amber'
          : 'bg-white dark:bg-[#202B25] border-slate-200 dark:border-[#293730] hover:border-[#659F84]/40 shadow-sm'
      }`}>
        
        {/* Left Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-[#141917] border border-slate-200 dark:border-[#293730]">
            {getCategoryIcon(habit.category)}
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white truncate">
                <Link to={`/habits/${habit.id}`} className="hover:text-[#40755C] dark:hover:text-[#84B59F]">
                  {habit.name}
                </Link>
              </h3>
              {(habit.inRescueMode || activePlan) && (
                <span className="shrink-0 text-[10px] font-bold text-[#E07A5F] bg-[#E07A5F]/20 border border-[#E07A5F]/40 px-2 py-0.2 rounded-full flex items-center gap-1">
                  <LifeBuoy className="h-3 w-3" /> Rescue
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-0.5">
              <span>{habit.category}</span>
              <span>•</span>
              <span className="font-semibold text-[#40755C] dark:text-[#84B59F] flex items-center gap-1">
                <Clock className="h-3 w-3 text-[#659F84]" />
                {habit.targetAmount} {habit.targetUnit}
              </span>
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isCompleted ? (
            <button
              onClick={() => logHabitStatus(habit.id, 'completed')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#659F84] text-white dark:text-[#141917] font-extrabold text-xs shadow-md shadow-[#659F84]/20"
            >
              <Check className="h-3.5 w-3.5 text-white dark:text-[#141917] stroke-[3]" /> Done
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => logHabitStatus(habit.id, 'completed')}
                className="px-3.5 py-1.5 rounded-xl bg-[#E07A5F] hover:bg-[#C95A3F] text-xs font-bold text-white shadow-sm transition-all"
              >
                Mark as Done
              </button>

              <button
                onClick={() => setMissModalOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isMissed
                    ? 'bg-[#E9C46A]/20 border-[#E9C46A] text-[#B58A1C] dark:text-[#E9C46A] font-bold'
                    : 'border-slate-300 dark:border-[#293730] bg-slate-100 dark:bg-[#141917] text-slate-700 dark:text-slate-300 hover:text-[#B58A1C] dark:hover:text-[#E9C46A] hover:bg-slate-200 dark:hover:bg-[#E9C46A]/20'
                }`}
                title="Mark Missed (AI Rescue)"
              >
                <LifeBuoy className="h-3.5 w-3.5 text-[#E07A5F] dark:text-[#E9C46A]" />
                Missed
              </button>
            </div>
          )}
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
