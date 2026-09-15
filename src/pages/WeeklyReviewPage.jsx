import React from 'react';
import { Sparkles, TrendingUp, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { generateAIWeeklySummary } from '../services/aiEngine';

export default function WeeklyReviewPage() {
  const { habits, logs, recoveryPlans } = useHabits();

  const summary = generateAIWeeklySummary(habits, logs, recoveryPlans);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#293730] pb-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[#E9C46A]" />
            AI Weekly Executive Review
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Actionable growth insights and progress metrics.</p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">Weekly Resilience</span>
          <span className="text-2xl font-extrabold text-[#40755C] dark:text-[#84B59F]">{summary.completionRate}%</span>
        </div>
      </div>

      {/* Main Review Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-[#293730] bg-white dark:bg-[#202B25] p-6 space-y-6 shadow-xl">
        
        <div className="space-y-2">
          <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">Weekly Summary</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{summary.summaryText}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-[#293730]">
          
          {/* Key Patterns */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold text-[#40755C] dark:text-[#84B59F] uppercase tracking-wider">Key Patterns</h4>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {summary.keyPatterns.map((pt, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#659F84] shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Steps */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold text-[#B58A1C] dark:text-[#E9C46A] uppercase tracking-wider">Recommendations</h4>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {summary.actionSteps.map((st, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-[#B58A1C] dark:text-[#E9C46A] shrink-0 mt-0.5" />
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
