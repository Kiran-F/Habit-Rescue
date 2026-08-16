import React from 'react';
import { ShieldCheck, HeartHandshake, Sparkles, TrendingUp } from 'lucide-react';

export default function ResilienceBadge({ score = 84, recoveriesCount = 6, totalAttempts = 8 }) {
  const recoveryRate = totalAttempts > 0 ? Math.round((recoveriesCount / totalAttempts) * 100) : 100;

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-white">Resilience Score</h3>
            <p className="text-[11px] text-slate-400">Recovery & Habit Re-engagement Index</p>
          </div>
        </div>

        <div className="text-right">
          <span className="font-heading text-2xl font-extrabold text-emerald-400">{score}</span>
          <span className="text-xs text-slate-500 font-semibold">/100</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
        <div className="space-y-0.5">
          <span className="text-slate-400 block text-[11px]">Successful Recoveries</span>
          <span className="font-bold text-white text-sm flex items-center gap-1">
            <HeartHandshake className="h-3.5 w-3.5 text-amber-400" />
            {recoveriesCount} Times
          </span>
        </div>
        <div className="space-y-0.5">
          <span className="text-slate-400 block text-[11px]">Recovery Success Rate</span>
          <span className="font-bold text-emerald-400 text-sm flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            {recoveryRate}%
          </span>
        </div>
      </div>

      <p className="text-[10px] text-slate-500 italic">
        *Motivational product metric celebrating bounce-back consistency over fragile streaks.
      </p>
    </div>
  );
}
