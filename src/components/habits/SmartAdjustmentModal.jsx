import React from 'react';
import { Sparkles, Sliders, CheckCircle2, X } from 'lucide-react';
import { useHabits } from '../../context/HabitContext';

export default function SmartAdjustmentModal({ adjustment, isOpen, onClose }) {
  const { acceptSmartAdjustment, declineSmartAdjustment } = useHabits();

  if (!isOpen || !adjustment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-amber-500/40 bg-slate-900 p-6 shadow-2xl space-y-5">
        
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-white">Smart Habit Recommendation</h3>
            <p className="text-xs text-amber-400 font-medium">{adjustment.habitName}</p>
          </div>
        </div>

        <div className="rounded-xl bg-amber-950/30 border border-amber-500/30 p-4 text-xs text-slate-200 leading-relaxed space-y-2">
          <p>{adjustment.reason}</p>
          <div className="pt-2 flex items-center justify-between border-t border-amber-500/20 text-slate-300">
            <span>Current Target: <strong className="text-white">{adjustment.currentTarget} {adjustment.unit}</strong></span>
            <span className="text-emerald-400 font-bold">Suggested: {adjustment.suggestedTarget} {adjustment.unit}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => { declineSmartAdjustment(adjustment.habitId); onClose(); }}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
          >
            Keep Original Target
          </button>
          <button
            onClick={() => { acceptSmartAdjustment(adjustment.habitId, adjustment.suggestedTarget); onClose(); }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
          >
            <CheckCircle2 className="h-4 w-4" />
            Accept {adjustment.suggestedTarget} {adjustment.unit} Target
          </button>
        </div>

      </div>
    </div>
  );
}
