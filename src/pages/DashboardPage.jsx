import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Sparkles, 
  LifeBuoy, 
  CheckCircle2, 
  Flame, 
  Calendar as CalendarIcon, 
  PieChart as PieChartIcon, 
  CheckCircle,
  TrendingUp, 
  HeartHandshake, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';
import CompactHabitRow from '../components/dashboard/CompactHabitRow';
import HabitFormModal from '../components/habits/HabitFormModal';
import SmartAdjustmentModal from '../components/habits/SmartAdjustmentModal';
import PatternCard from '../components/insights/PatternCard';

export default function DashboardPage() {
  const { currentUser, isDemoUser } = useAuth();
  const { habits, logs, recoveryPlans, insights, smartAdjustments, resetToDemoData } = useHabits();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const activeHabits = habits.filter(h => h.active);
  const activeHabitIds = new Set(activeHabits.map(h => h.id));

  // Only consider logs for currently existing active habits!
  const validLogs = logs.filter(l => activeHabitIds.has(l.habitId));
  const todayValidLogs = validLogs.filter(l => l.date === todayStr);

  const completedTodayCount = activeHabits.length > 0 
    ? todayValidLogs.filter(l => l.status === 'completed').length 
    : 0;

  // Percentage of habits completed today
  const todayCompletionPercentage = activeHabits.length > 0 
    ? Math.round((completedTodayCount / activeHabits.length) * 100) 
    : 0;
  
  // Real Overall Completion Rate Calculation
  const totalValidLogs = validLogs.length;
  const totalCompletedValidLogs = validLogs.filter(l => l.status === 'completed').length;
  
  const overallCompletionRate = (activeHabits.length > 0 && totalValidLogs > 0)
    ? Math.round((totalCompletedValidLogs / totalValidLogs) * 100) 
    : 0;

  // Real Consecutive Day Streak Calculation
  const calculateRealStreak = () => {
    if (activeHabits.length === 0 || validLogs.length === 0) return 0;
    
    const completedDates = new Set(
      validLogs.filter(l => l.status === 'completed').map(l => l.date)
    );

    let streak = 0;
    let checkDate = new Date();

    const todayFormatted = format(checkDate, 'yyyy-MM-dd');
    const yesterdayFormatted = format(subDays(checkDate, 1), 'yyyy-MM-dd');

    if (!completedDates.has(todayFormatted) && !completedDates.has(yesterdayFormatted)) {
      return 0;
    }

    if (!completedDates.has(todayFormatted) && completedDates.has(yesterdayFormatted)) {
      checkDate = subDays(checkDate, 1);
    }

    while (true) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      if (completedDates.has(dateStr)) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const realStreakDays = calculateRealStreak();

  const activePlans = recoveryPlans.filter(p => activeHabitIds.has(p.habitId) && (p.status === 'active' || p.status === 'pending_approval'));
  const activeSmartAdjustment = smartAdjustments[0];

  const hour = new Date().getHours();
  let timeOfDay = 'Good morning';
  if (hour >= 12 && hour < 17) timeOfDay = 'Good afternoon';
  if (hour >= 17) timeOfDay = 'Good evening';

  return (
    <div className="space-y-6">
      
      {/* Streamlined Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#293730] pb-4">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-[#84B59F]">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </span>
          <h1 className="font-heading text-2xl font-extrabold text-white flex items-center gap-2">
            {timeOfDay}, {currentUser?.displayName?.split(' ')[0] || 'Friend'} 🌱
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {isDemoUser && (
            <button
              onClick={resetToDemoData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E07A5F]/40 bg-[#E07A5F]/15 text-xs font-bold text-[#E07A5F]"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Demo Reset
            </button>
          )}
          
          <button
            onClick={() => { setEditingHabit(null); setFormModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#659F84] hover:bg-[#52796F] font-bold text-xs text-[#141917] shadow-md transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            Add Habit
          </button>
        </div>
      </div>

      {/* 3 Real Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Card 1: Real Current Streak */}
        <div className="rounded-3xl bg-[#659F84] p-5 text-white flex flex-col justify-between shadow-lg h-36">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
              <Flame className="h-5 w-5 text-[#E07A5F]" />
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-[11px] font-bold text-white">
              {realStreakDays}
            </div>
          </div>
          <div>
            <span className="text-xs font-bold tracking-tight opacity-90 block text-white">Current Streak</span>
            <span className="font-heading text-3xl font-extrabold tracking-tight block pt-0.5 text-white">
              {realStreakDays} {realStreakDays === 1 ? 'Day' : 'Days'}
            </span>
          </div>
        </div>

        {/* Card 2: Habits Completed as Completed / Total (e.g. 3/5) */}
        <div className="rounded-3xl bg-[#202B25] border border-[#293730] p-5 text-white flex flex-col justify-between shadow-lg h-36">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#659F84]/20">
              <CheckCircle className="h-5 w-5 text-[#659F84]" />
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#659F84]/20 text-[11px] font-bold text-[#84B59F]">
              {todayCompletionPercentage}%
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Habits Completed</span>
            <span className="font-heading text-3xl font-extrabold tracking-tight text-white block pt-0.5">
              {completedTodayCount}/{activeHabits.length}
            </span>
          </div>
        </div>

        {/* Card 3: Overall Completion Rate */}
        <div className="rounded-3xl bg-[#4F7E68] p-5 text-white flex flex-col justify-between shadow-lg h-36">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
              <PieChartIcon className="h-5 w-5 text-[#84B59F]" />
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-[10px] font-bold text-white">
              {overallCompletionRate}%
            </div>
          </div>
          <div>
            <span className="text-xs font-bold tracking-tight opacity-90 block text-white">Completion Rate</span>
            <span className="font-heading text-3xl font-extrabold tracking-tight block pt-0.5 text-white">
              {overallCompletionRate}%
            </span>
          </div>
        </div>

      </div>

      {/* Active Rescue Banner */}
      {activePlans.length > 0 && (
        <div className="rounded-2xl border border-[#E07A5F]/40 bg-[#202B25] p-4 flex items-center justify-between shadow-lg glow-amber">
          <div className="flex items-center gap-3">
            <LifeBuoy className="h-5 w-5 text-[#E07A5F] shrink-0" />
            <div>
              <h3 className="font-heading text-sm font-bold text-white">
                {activePlans.length} Active AI Recovery Plan{activePlans.length === 1 ? '' : 's'}
              </h3>
              <p className="text-xs text-slate-300">4-day micro-goals active.</p>
            </div>
          </div>
          <Link
            to="/rescue"
            className="text-xs font-bold text-[#E07A5F] hover:underline flex items-center gap-1 shrink-0"
          >
            View Rescue <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Brief Overview List of Daily Habits */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="font-heading text-lg font-bold text-white">Daily Habits Overview</h2>
            <p className="text-xs text-slate-400">Brief status summary of all habits being tracked.</p>
          </div>
          
          <Link
            to="/habits"
            className="text-xs font-bold text-[#84B59F] hover:text-white flex items-center gap-1"
          >
            Manage All Habits <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {activeHabits.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#293730] bg-[#202B25]/60 p-8 text-center space-y-3">
            <HeartHandshake className="h-8 w-8 text-[#659F84] mx-auto" />
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-heading text-base font-bold text-white">No Habits Yet</h3>
              <p className="text-xs text-slate-400">Create your first habit to begin your wellness journey.</p>
            </div>

            <button
              onClick={() => setFormModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#659F84] hover:bg-[#52796F] font-bold text-xs text-[#141917] shadow-md"
            >
              <Plus className="h-4 w-4" />
              Create First Habit
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeHabits.map((habit) => (
              <CompactHabitRow
                key={habit.id}
                habit={habit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <HabitFormModal
        habitToEdit={editingHabit}
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
      />

      <SmartAdjustmentModal
        adjustment={activeSmartAdjustment}
        isOpen={Boolean(activeSmartAdjustment)}
        onClose={() => {}}
      />

    </div>
  );
}
