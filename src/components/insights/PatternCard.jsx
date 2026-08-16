import React from 'react';
import { Sparkles, Calendar, AlertCircle, ArrowRight, Lightbulb } from 'lucide-react';

export default function PatternCard({ insight }) {
  if (!insight) return null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-3 glass-card-hover">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="font-heading text-sm font-bold text-white">{insight.title}</h3>
        </div>
        <span className="text-[10px] font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/30 px-2 py-0.5 rounded-full">
          AI Pattern Insight
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        {insight.content}
      </p>

      {insight.recommendation && (
        <div className="rounded-xl bg-violet-950/30 border border-violet-500/20 p-3 flex items-start gap-2.5">
          <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-200">
            <span className="font-bold text-amber-300 block">AI Recommendation:</span>
            {insight.recommendation}
          </div>
        </div>
      )}
    </div>
  );
}
