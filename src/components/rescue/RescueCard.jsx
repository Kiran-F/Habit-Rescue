import React, { useState } from 'react';
import { 
  Sparkles, 
  LifeBuoy, 
  CheckCircle2, 
  RotateCcw, 
  X, 
  Clock, 
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Lock,
  CalendarCheck,
  Check,
  RefreshCw,
  Ban
} from 'lucide-react';
import { format } from 'date-fns';
import { useHabits } from '../../context/HabitContext';

export default function RescueCard({ habit, recoveryPlan }) {
  const { 
    acceptRecoveryPlan, 
    rejectRecoveryPlan, 
    dismissRecoveryPlan,
    regenerateRecoveryPlan, 
    reproposeCancelledPlan, 
    completeMicroStep 
  } = useHabits();

  if (!recoveryPlan) return null;

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const steps = recoveryPlan.steps || [];
  const completedStepsCount = steps.filter(s => s.status === 'completed').length;
  const progressPercent = Math.round((completedStepsCount / steps.length) * 100);

  const isPendingApproval = recoveryPlan.status === 'pending_approval';
  const isCancelled = recoveryPlan.status === 'cancelled';
  const completedToday = steps.some(s => s.status === 'completed' && s.completedDate === todayStr);

  // If plan was cancelled, show the Next-Day Re-proposal Card!
  if (isCancelled) {
    return (
      <div className="rounded-3xl border border-[#E9C46A]/60 bg-white dark:bg-[#1F2520] p-6 shadow-xl space-y-4 glow-amber">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E9C46A]/20 text-[#E9C46A]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">Next-Day AI Recovery Proposal</h3>
            <p className="text-xs text-[#E9C46A] font-bold">{habit.name}</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          You previously cancelled a recovery plan for <strong className="text-slate-900 dark:text-white">{habit.name}</strong>. Ready to try a fresh, lower-friction recovery strategy to get back on track today?
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => dismissRecoveryPlan(recoveryPlan.id)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#293730] rounded-xl bg-slate-50 dark:bg-[#141917]"
          >
            Dismiss
          </button>
          <button
            onClick={() => reproposeCancelledPlan(habit.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#659F84] hover:bg-[#52796F] text-xs font-bold text-white dark:text-[#141917] shadow-lg shadow-[#659F84]/20 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="h-4 w-4" />
            Review Fresh AI Proposal
          </button>
        </div>
      </div>
    );
  }

  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    const targetHabitId = recoveryPlan.habitId || habit?.id;
    try {
      await regenerateRecoveryPlan(targetHabitId);
    } catch (err) {
      console.warn('Failed to regenerate recovery plan:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className={`rounded-3xl border p-6 shadow-xl space-y-5 transition-colors duration-300 ${
      isPendingApproval
        ? 'border-[#E9C46A]/60 bg-white dark:bg-[#1F2721] glow-amber'
        : 'border-[#E07A5F]/40 bg-white dark:bg-[#18231E]/95 glow-amber'
    }`}>
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#293730] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            {isPendingApproval ? (
              <span className="rounded-full bg-[#E9C46A]/20 text-[#B58A1C] dark:text-[#E9C46A] border border-[#E9C46A]/40 px-3 py-0.5 text-xs font-bold flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> AI Proposal Reviewing
              </span>
            ) : (
              <span className="rounded-full bg-[#E07A5F]/20 text-[#E07A5F] border border-[#E07A5F]/40 px-3 py-0.5 text-xs font-bold flex items-center gap-1">
                <LifeBuoy className="h-3.5 w-3.5" /> Active Recovery Plan
              </span>
            )}
            {recoveryPlan.isAIGenerated && (
              <span className="rounded-full bg-emerald-500/15 text-[#2D6A4F] dark:text-[#84B59F] border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#659F84]" /> {recoveryPlan.aiModel ? (recoveryPlan.aiModel.includes('Groq') ? 'Powered by Groq LPU' : recoveryPlan.aiModel.includes('Gemini') ? 'Powered by Gemini AI' : `Powered by ${recoveryPlan.aiModel}`) : 'Powered by Groq AI'}
              </span>
            )}
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Triggered by: {recoveryPlan.triggerReason || 'Missed habit'}</span>
          </div>
          <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">{habit.name}</h2>
          {recoveryPlan.explanation && (
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
              {recoveryPlan.explanation}
            </p>
          )}
        </div>

        {/* Top Control Buttons */}
        <div className="flex items-center gap-2">
          {!isPendingApproval && (
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#293730] bg-slate-50 dark:bg-[#141917] text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-[#659F84]/40 transition-colors font-medium disabled:opacity-50"
            >
              <RotateCcw className={`h-3.5 w-3.5 text-[#E07A5F] ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Generating Plan...' : 'Generate Another Plan'}
            </button>
          )}
          <button
            onClick={() => dismissRecoveryPlan(recoveryPlan.id)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#293730] bg-slate-50 dark:bg-[#141917] text-xs text-slate-400 hover:text-red-500"
            title="Dismiss Recovery Plan"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ACTION WORKFLOW BAR FOR PROPOSED PLAN */}
      {isPendingApproval && (
        <div className="rounded-2xl bg-slate-50 dark:bg-[#141917] border border-slate-200 dark:border-[#293730] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Would you like to accept this 4-day recovery schedule?
          </span>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => acceptRecoveryPlan(recoveryPlan.id)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#659F84] hover:bg-[#52796F] text-xs font-bold text-white dark:text-[#141917] shadow-lg shadow-[#659F84]/20 transition-all hover:scale-[1.02]"
            >
              <Check className="h-4 w-4" />
              Accept Plan
            </button>

            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E9C46A]/40 bg-[#E9C46A]/15 text-xs font-bold text-[#B58A1C] dark:text-[#E9C46A] hover:bg-[#E9C46A]/25 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Generating...' : 'Generate Another'}
            </button>

            <button
              onClick={() => dismissRecoveryPlan(recoveryPlan.id)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-xs font-semibold text-red-500 hover:bg-red-500/20 transition-colors"
            >
              <Ban className="h-3.5 w-3.5" />
              Dismiss Plan
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar & Daily Pacing Notice */}
      {!isPendingApproval && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <span>Recovery Momentum Progress</span>
            <span className="text-[#40755C] dark:text-[#84B59F] font-bold">{completedStepsCount} of {steps.length} Steps Completed ({progressPercent}%)</span>
          </div>
          
          <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-[#141917] overflow-hidden border border-slate-200 dark:border-[#293730]">
            <div 
              className="h-full bg-gradient-to-r from-[#E07A5F] via-[#659F84] to-[#84B59F] transition-all duration-500 animate-shimmer"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {completedToday && (
            <div className="rounded-xl bg-[#659F84]/15 border border-[#659F84]/30 px-3.5 py-2 text-xs text-[#40755C] dark:text-[#84B59F] font-semibold flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-[#659F84]" />
              Great job! You completed today's micro-step. Next step unlocks tomorrow to maintain natural daily pacing.
            </div>
          )}
        </div>
      )}

      {/* 4-Day Progressive Micro-Goal Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step) => {
          const isDone = step.status === 'completed';
          const isPrevDone = step.stepNumber === 1 || steps.find(s => s.stepNumber === step.stepNumber - 1)?.status === 'completed';
          const isUnlocked = !isPendingApproval && isPrevDone && (!completedToday || (isDone && step.completedDate === todayStr));

          return (
            <div
              key={step.stepNumber}
              className={`rounded-2xl border p-4 flex flex-col justify-between space-y-3 transition-all ${
                isDone
                  ? 'bg-[#659F84]/20 border-[#659F84]/50 shadow-md'
                  : isUnlocked
                  ? 'bg-slate-50 dark:bg-[#141917] border-[#E07A5F]/60 ring-1 ring-[#E07A5F]/40 shadow-lg'
                  : 'bg-slate-50/50 dark:bg-[#141917]/50 border-slate-200 dark:border-[#293730] opacity-60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    isDone 
                      ? 'bg-[#659F84]/30 text-[#40755C] dark:text-[#84B59F] border-[#659F84]/50' 
                      : isUnlocked
                      ? 'bg-[#E07A5F]/20 text-[#E07A5F] border-[#E07A5F]/40'
                      : 'bg-slate-200 dark:bg-[#293730] text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                  }`}>
                    Step {step.stepNumber}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#659F84]" />
                    {step.duration} {step.unit}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white pt-1">{step.title}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">{step.description}</p>
              </div>

              <div>
                {isDone ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#40755C] dark:text-[#84B59F] pt-2 border-t border-[#659F84]/30">
                    <CheckCircle2 className="h-4 w-4" /> Step Completed ({step.completedDate || 'Done'})
                  </div>
                ) : isPendingApproval ? (
                  <div className="text-[11px] text-[#E9C46A] italic pt-1 font-semibold">
                    Awaiting Plan Acceptance
                  </div>
                ) : isUnlocked ? (
                  <button
                    onClick={() => completeMicroStep(recoveryPlan.id, step.stepNumber)}
                    className="w-full flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-[#E07A5F] hover:bg-[#C95A3F] text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02]"
                  >
                    Check-in ({step.duration} {step.unit})
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-[#293730]/60 text-[11px] font-semibold text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-[#293730] cursor-not-allowed"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    Unlocks Tomorrow
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
