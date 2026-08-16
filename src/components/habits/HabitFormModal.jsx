import React, { useState, useEffect } from 'react';
import { X, Plus, CheckCircle2, Clock, Calendar, Sparkles } from 'lucide-react';
import { useHabits } from '../../context/HabitContext';

const CATEGORIES = ['Fitness', 'Hydration', 'Sleep', 'Study', 'Productivity', 'Mindfulness', 'Personal', 'Other'];
const UNITS = ['minutes', 'hours', 'ml', 'liters', 'pages', 'reps', 'times'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HabitFormModal({ habitToEdit, isOpen, onClose }) {
  const { addHabit, updateHabit } = useHabits();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Fitness');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState(30);
  const [targetUnit, setTargetUnit] = useState('minutes');
  const [frequency, setFrequency] = useState('daily');
  const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [reminderTime, setReminderTime] = useState('18:00');

  useEffect(() => {
    if (habitToEdit) {
      setName(habitToEdit.name || '');
      setCategory(habitToEdit.category || 'Fitness');
      setDescription(habitToEdit.description || '');
      setTargetAmount(habitToEdit.targetAmount || 30);
      setTargetUnit(habitToEdit.targetUnit || 'minutes');
      setFrequency(habitToEdit.frequency || 'daily');
      setSelectedDays(habitToEdit.selectedDays || [0, 1, 2, 3, 4, 5, 6]);
      setReminderTime(habitToEdit.reminderTime || '18:00');
    } else {
      setName('');
      setCategory('Fitness');
      setDescription('');
      setTargetAmount(30);
      setTargetUnit('minutes');
      setFrequency('daily');
      setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
      setReminderTime('18:00');
    }
  }, [habitToEdit, isOpen]);

  if (!isOpen) return null;

  const toggleDay = (index) => {
    if (selectedDays.includes(index)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(d => d !== index));
      }
    } else {
      setSelectedDays([...selectedDays, index].sort());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const habitData = {
      name: name.trim(),
      category,
      description: description.trim(),
      targetAmount: Number(targetAmount),
      targetUnit,
      frequency,
      selectedDays,
      reminderTime
    };

    if (habitToEdit) {
      updateHabit(habitToEdit.id, habitData);
    } else {
      addHabit(habitData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-[#293730] bg-white dark:bg-[#202B25] p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#293730] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#659F84]/20 border border-[#659F84]/40 text-[#659F84]">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
              {habitToEdit ? 'Edit Habit' : 'Create New Habit'}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#141917] hover:text-slate-900 dark:hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Name */}
          <div className="space-y-1.5">
            <label className="font-bold text-black dark:text-white block">Habit Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Exercise 30 minutes daily, Read non-fiction..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-[#293730] bg-slate-50 dark:bg-[#141917] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#659F84] focus:outline-none"
            />
          </div>

          {/* Category & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-black dark:text-white block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-[#293730] bg-slate-50 dark:bg-[#141917] px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:border-[#659F84] focus:outline-none"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-black dark:text-white block">Measurement Unit</label>
              <select
                value={targetUnit}
                onChange={(e) => setTargetUnit(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-[#293730] bg-slate-50 dark:bg-[#141917] px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:border-[#659F84] focus:outline-none"
              >
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Target Amount & Reminder Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-black dark:text-white block">Daily Target Amount</label>
              <input
                type="number"
                min="1"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-[#293730] bg-slate-50 dark:bg-[#141917] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-[#659F84] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-black dark:text-white block">Reminder Time</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-[#293730] bg-slate-50 dark:bg-[#141917] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-[#659F84] focus:outline-none"
              />
            </div>
          </div>

          {/* Frequency & Active Days */}
          <div className="space-y-2 pt-1">
            <label className="font-bold text-black dark:text-white block">Active Days of Week</label>
            <div className="flex gap-1.5">
              {DAYS.map((day, idx) => {
                const isSelected = selectedDays.includes(idx);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(idx)}
                    className={`flex-1 py-2 rounded-lg font-bold text-center border transition-all ${
                      isSelected
                        ? 'bg-[#659F84]/20 border-[#659F84] text-[#40755C] dark:text-[#84B59F]'
                        : 'bg-slate-100 dark:bg-[#141917] border-slate-200 dark:border-[#293730] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-bold text-black dark:text-white block">Optional Description / Notes</label>
            <textarea
              rows={2}
              placeholder="Why this habit matters to your wellness..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-[#293730] bg-slate-50 dark:bg-[#141917] px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#659F84] focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-[#293730]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#659F84] hover:bg-[#52796F] font-bold text-white dark:text-[#141917] shadow-lg shadow-[#659F84]/20 transition-all hover:scale-[1.02]"
            >
              {habitToEdit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
