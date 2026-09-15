import React, { useState } from 'react';
import {
  X,
  Sparkles,
  HeartHandshake,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { REASON_OPTIONS } from '../../services/aiEngine';
import { useHabits } from '../../context/HabitContext';

export default function MissedHabitModal({ habit, isOpen, onClose }) {
  const { logHabitStatus } = useHabits();
  const [selectedReason, setSelectedReason] = useState('too_tired');
  const [userNotes, setUserNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !habit) return null;

  const handleLogMiss = () => {
    setIsSubmitting(true);
    const reasonObj = REASON_OPTIONS.find(r => r.id === selectedReason);
    const reasonText = reasonObj ? reasonObj.label : 'General Fatigue';

    logHabitStatus(habit.id, 'missed', reasonText, userNotes);

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-[#293730] bg-white dark:bg-[#202B25] p-6 shadow-2xl space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-[#293730] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E07A5F]/20 border border-[#E07A5F]/40 text-[#E07A5F]">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Let's get back on track</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Missed: <span className="text-slate-900 dark:text-white font-semibold">{habit.name}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#141917] hover:text-slate-900 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Question */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-black dark:text-white flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-[#659F84]" />
            What got in the way today?
          </label>

          <div className="grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {REASON_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedReason(opt.id)}
                className={`flex items-start gap-2.5 p-3 rounded-2xl border text-left transition-all ${selectedReason === opt.id
                    ? 'bg-[#659F84]/20 border-[#659F84] text-slate-900 dark:text-white shadow-md ring-1 ring-[#659F84]'
                    : 'bg-slate-50 dark:bg-[#141917] border-slate-200 dark:border-[#293730] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202B25]'
                  }`}
              >
                <span className="text-lg">{opt.icon}</span>
                <div>
                  <span className="text-xs font-bold block text-slate-900 dark:text-white">{opt.label}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight block">{opt.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Free text optional notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-black dark:text-white block">
            Optional details or context:
          </label>
          <textarea
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="e.g. Work meetings ran late, felt exhausted by 6 PM..."
            rows={2}
            className="w-full rounded-xl border border-slate-300 dark:border-[#293730] bg-slate-50 dark:bg-[#141917] px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#659F84] focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-[#293730]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLogMiss}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#659F84] hover:bg-[#52796F] text-xs font-bold text-white dark:text-[#141917] shadow-lg shadow-[#659F84]/20 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Generating AI Plan...</span>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate AI Rescue Plan
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
