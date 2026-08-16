import React, { useState } from 'react';
import { Plus, Search, Filter, CheckCircle2, LifeBuoy, Sparkles } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import HabitCard from '../components/habits/HabitCard';
import HabitFormModal from '../components/habits/HabitFormModal';

export default function HabitsPage() {
  const { habits } = useHabits();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const categories = ['All', 'Fitness', 'Hydration', 'Sleep', 'Study', 'Productivity', 'Mindfulness', 'Personal', 'Other'];

  const filteredHabits = habits.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase()) || 
                          (h.description && h.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || h.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#293730] pb-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">Habits Directory</h1>
          <p className="text-xs text-slate-400">Manage your routines, daily targets, and custom recovery presets.</p>
        </div>

        <button
          onClick={() => { setEditingHabit(null); setFormModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#659F84] hover:bg-[#52796F] font-bold text-xs text-[#141917] shadow-md transition-all hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          Create Habit
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search habits by name or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#293730] bg-[#202B25] pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#659F84] focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#659F84] text-[#141917] font-bold shadow-md shadow-[#659F84]/20'
                  : 'bg-[#202B25] border border-[#293730] text-slate-400 hover:text-white hover:border-[#659F84]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Habits Grid */}
      {filteredHabits.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#293730] bg-[#202B25]/60 p-12 text-center space-y-3">
          <p className="text-sm text-slate-400">No habits match your current search filter.</p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('All'); }}
            className="text-xs font-semibold text-[#84B59F] hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={(h) => { setEditingHabit(h); setFormModalOpen(true); }}
            />
          ))}
        </div>
      )}

      {/* Habit Creation / Edit Modal */}
      <HabitFormModal
        habitToEdit={editingHabit}
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
      />

    </div>
  );
}
