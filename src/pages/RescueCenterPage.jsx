import React from 'react';
import { LifeBuoy, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import RescueCard from '../components/rescue/RescueCard';

export default function RescueCenterPage() {
  const { habits, recoveryPlans } = useHabits();

  const rescuePlans = recoveryPlans.filter(p => p.status !== 'completed');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-[#293730] pb-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <LifeBuoy className="h-6 w-6 text-[#E07A5F]" />
            Rescue Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage active 4-day progressive AI recovery plans.</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#40755C] dark:text-[#84B59F] bg-slate-100 dark:bg-[#659F84]/20 border border-slate-200 dark:border-[#659F84]/40 px-3 py-1.5 rounded-full">
          {rescuePlans.length} Active Plan{rescuePlans.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Plans List */}
      {rescuePlans.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 dark:border-[#293730] bg-white dark:bg-[#202B25]/60 p-10 text-center space-y-3 shadow-sm">
          <CheckCircle2 className="h-8 w-8 text-[#659F84] mx-auto" />
          <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">No Active Rescue Plans</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">All routines are on track. When you mark a missed habit, AI micro-goals appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {rescuePlans.map((plan) => {
            const habit = habits.find(h => h.id === plan.habitId) || { name: 'Habit Routine' };
            return (
              <RescueCard
                key={plan.id}
                habit={habit}
                recoveryPlan={plan}
              />
            );
          })}
        </div>
      )}

    </div>
  );
}
